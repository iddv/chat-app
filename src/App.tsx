import React, { useState } from 'react';
import { 
  SendHorizontal, 
  VolumeX,
  Volume2,
  Settings,
  Heart,
  Coins,
  Backpack
} from 'lucide-react';
import { apiService, type AdventureSettings } from './services/api';

interface Message {
  content: string;
  type: 'system' | 'user' | 'error';
  timestamp: number;
}

const AdventureChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('Fantasy');
  const [adventureSettings, setAdventureSettings] = useState<AdventureSettings>({
    setting: 'medieval fantasy',
    genre: 'fantasy',
    playerCharacter: 'adventurer',
    theme: 'heroic',
    toneStyle: 'classic fantasy',
    additionalDetails: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const backgroundStyle = {
    backgroundColor: '#1a1a1a'
  };

  const addMessage = (content: string, type: Message['type']) => {
    setMessages(prev => [...prev, {
      content,
      type,
      timestamp: Date.now()
    }]);
  };

  const configureAdventure = async () => {
    setIsLoading(true);
    try {
      // Update settings based on selected theme
      const updatedSettings = {
        ...adventureSettings,
        genre: selectedTheme.toLowerCase(),
        setting: selectedTheme === 'Fantasy' ? 'medieval fantasy' :
                selectedTheme === 'Sci-Fi' ? 'futuristic space colony' :
                'gothic horror mansion',
        toneStyle: selectedTheme === 'Fantasy' ? 'classic fantasy' :
                   selectedTheme === 'Sci-Fi' ? 'hard science fiction' :
                   'psychological horror'
      };
      setAdventureSettings(updatedSettings);
      
      const response = await apiService.setAdventureSettings(updatedSettings);
      if (response.success) {
        setIsConfigured(true);
        addMessage('Adventure configured successfully! Click Start Adventure to begin.', 'system');
      }
    } catch (error) {
      addMessage('Failed to configure adventure. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const startAdventure = async () => {
    if (!isConfigured) return;
    setIsLoading(true);
    try {
      const response = await apiService.startAdventure(adventureSettings);
      if (response.success && response.data) {
        setGameStarted(true);
        addMessage(response.data, 'system');
      }
    } catch (error) {
      addMessage('Failed to start adventure. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !gameStarted) return;

    const userInput = input.trim();
    setInput('');
    addMessage(userInput, 'user');
    setIsLoading(true);

    try {
      const response = await apiService.sendAction(userInput);
      if (response.success && response.data) {
        addMessage(response.data, 'system');
      }
    } catch (error) {
      addMessage('Failed to process your action. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <div className="min-h-screen bg-black bg-opacity-75">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white">Interactive Adventure Engine</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <button 
                className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Settings size={24} />
              </button>
            </div>
          </div>

          {!gameStarted && (
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                {['Fantasy', 'Sci-Fi', 'Horror'].map((theme) => (
                  <button 
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedTheme === theme 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>

              {!isConfigured ? (
                <button 
                  onClick={configureAdventure} 
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:bg-gray-600"
                >
                  {isLoading ? 'Configuring...' : 'Configure Adventure'}
                </button>
              ) : (
                <button 
                  onClick={startAdventure} 
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-gray-600"
                >
                  {isLoading ? 'Starting...' : 'Start Adventure'}
                </button>
              )}
            </div>
          )}

          <div className="bg-gray-900 rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${
                  message.type === 'user' ? 'text-blue-400' : 
                  message.type === 'error' ? 'text-red-400' : 
                  'text-green-400'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>

          {gameStarted && (
            <form onSubmit={handleAction} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-gray-800 text-white rounded px-4 py-2"
                placeholder="What would you like to do?"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-gray-600"
              >
                <SendHorizontal size={24} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdventureChatInterface;