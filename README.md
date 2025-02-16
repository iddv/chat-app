# Interactive Adventure Chat Frontend

A React-based frontend for an AI-powered text adventure game. This project provides a modern, interactive interface for text-based adventure gaming with real-time AI responses.

## 🌟 Features

- Modern React-based chat interface
- Real-time message updates
- Character stats tracking (health, gold, inventory)
- Theme selection (Fantasy, Sci-Fi, Horror)
- Quick action buttons
- Dark mode styling
- Responsive design

## 🚀 Getting Started

### Prerequisites

1. Node.js (LTS version recommended)
   ```bash
   # Using winget (Windows)
   winget install OpenJS.NodeJS.LTS
   # Verify installation
   node --version
   npm --version
   ```

2. Backend Service (Required)
   - Clone and set up the backend from: [Backend Repository]
   - Ensure it's running on localhost:8080

3. Ollama (Required for the backend)
   - Install Ollama from https://ollama.ai/
   - Pull the required model:
     ```bash
     ollama pull deepseek-r1:14b
     ```

### Installation & Setup

1. Clone the repository
   ```bash
   git clone https://github.com/iddv/chat-app.git
   cd chat-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Verify Everything is Running

1. Frontend: Open http://localhost:5173 in your browser
2. Backend: Should be running on http://localhost:8080
3. Ollama: Should be running on http://localhost:11434

## 🔧 Tech Stack

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- [Axios](https://axios-http.com/) - Promise based HTTP client

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

### ESLint Configuration

For production development, we recommend enabling type-aware lint rules:

1. Configure parserOptions in your ESLint config:
```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

2. Enhance type checking:
- Replace `tseslint.configs.recommended` with either:
  - `tseslint.configs.recommendedTypeChecked`
  - `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`

3. Add React-specific ESLint configuration:
```js
// eslint.config.js
import react from 'eslint-plugin-react'
export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## 📁 Project Structure

```
chat-app/
├── src/
│   ├── App.tsx           # Main application component
│   ├── services/
│   │   └── api.ts        # API service layer
│   ├── assets/
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🔌 Backend Integration

This frontend requires three services to be running:

1. This frontend (port 5173)
2. Backend service (port 8080)
3. Ollama service (port 11434)

The backend repository contains the Kotlin server that handles:
- AI text generation via Ollama
- Game state management
- Character progression
- Session handling

## 🔜 Roadmap

- [ ] User authentication and profiles
- [ ] Save/load game functionality
- [ ] Sound effects and background music
- [ ] Enhanced character customization
- [ ] Multiplayer support
- [ ] Advanced inventory management
- [ ] Quest system
- [ ] Achievement tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Requestg

---

For more information about the backend service, visit the [backend repository](https://github.com/iddv/shiny-system).