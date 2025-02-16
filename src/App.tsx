import React, { useState } from 'react';
import { 
  SendHorizontal, 
  VolumeX,
  Volume2,
  Moon,
  Settings,
  Heart,
  Coins,
  Backpack
} from 'lucide-react';
import { apiService } from './services/api';

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
  const [adventureSettings, setAdventureSettings] = useState({
    setting: 'medieval fantasy',
    genre: 'fantasy',
    playerCharacter: 'adventurer',
    theme: 'heroic',
    toneStyle: 'classic fantasy',
    additionalDetails: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);

  const backgroundStyle = {
    backgroundImage: 'url("/api/placeholder/1920/1080")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const configureAdventure = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.setAdventureSettings(adventureSettings);
      if (response.success) {
        setIsConfigured(true);
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
        addMessage(response.data.response, 'system');
      }
    } catch (error) {
      addMessage('Failed to start adventure. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (content: string, type: Message['type']) => {
    setMessages(prev => [...prev, {
      content,
      type,
      timestamp: Date.now()
    }]);
  };

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <div className="min-h-screen bg-black bg-opacity-75">
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-white">Interactive Adventure Engine</h1>
          <div className="mb-6 flex gap-4">
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
            <button onClick={configureAdventure} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500">
              Configure Adventure
            </button>
          ) : (
            <button onClick={startAdventure} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
              Start Adventure
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdventureChatInterface;
