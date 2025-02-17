# Interactive Adventure Chat Frontend

A React-based interface for an AI-powered text adventure game. This project provides a modern, responsive chat experience for interactive storytelling, leveraging real-time updates and a sleek design.

## 🌟 Features

- **~~Modern~~ Chat Interface:**  
  Built with React and Vite for a fast, interactive experience.
- **Real-Time Message Updates:**  
  Displays AI responses and user messages instantly.
- **Character Stats Tracking (kinda):**  
  Monitor health, gold, and inventory.
- **Theme Selection:**  
  Choose between Fantasy, Sci-Fi, and Horror modes.
- **Quick Action Buttons:**  
  Easily trigger game actions.
- **Dark Mode & Responsive Design:**  
  Optimized for all devices (yet tested on 1).

## 🚀 Getting Started

### Prerequisites

1. **Node.js (LTS Recommended):**  
   Install Node.js (LTS version) and verify installation:
   ```bash
   # On Windows using winget
   winget install OpenJS.NodeJS.LTS
   node --version
   npm --version
   ```

2. **Backend Service (Required):**  
   - Clone and set up the backend from [shiny-system](https://github.com/iddv/shiny-system).  
   - Ensure it's running on [http://localhost:8080](http://localhost:8080).

3. **Ollama (Required for Backend AI):**  
   - Install Ollama from [ollama.ai](https://ollama.ai/).  
   - Pull the required model:
     ```bash
     ollama pull deepseek-r1:14b
     ```

### Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/iddv/chat-app.git
   cd chat-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:5173](http://localhost:5173).

### Verify Installation

- **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Backend:** Ensure it is running at [http://localhost:8080](http://localhost:8080).
- **Ollama:** Confirm the service is active at [http://localhost:11434](http://localhost:11434).

## 🔧 Tech Stack

- [Vite](https://vitejs.dev/) – Next Generation Frontend Tooling
- [React](https://reactjs.org/) – Library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) – Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Lucide React](https://lucide.dev/) – Icon library
- [Axios](https://axios-http.com/) – Promise-based HTTP client

## 🛠️ Development

### Available Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build for production.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run ESLint checks.

### ESLint Configuration

For improved type-aware linting, update your ESLint config as follows:

1. **Parser Options:**
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

2. **Enhanced Type Checking:**  
   Replace `tseslint.configs.recommended` with either:
   - `tseslint.configs.recommendedTypeChecked` or
   - `tseslint.configs.strictTypeChecked`  
   Optionally include `...tseslint.configs.stylisticTypeChecked`.

3. **React-Specific Settings:**
   ```js
   // eslint.config.js
   import react from 'eslint-plugin-react'
   export default tseslint.config({
     settings: { react: { version: '18.3' } },
     plugins: { react },
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
│   │   └── api.ts        # API service layer for backend communication
│   ├── assets/           # Images, icons, and other static assets
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── public/               # Public static files
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🔌 Backend Integration

This frontend interacts with the following services:

1. **Frontend:** Runs on [http://localhost:5173](http://localhost:5173)
2. **Backend Service:** Provided by [shiny-system](https://github.com/iddv/shiny-system) on [http://localhost:8080](http://localhost:8080)
3. **Ollama Service:** Running at [http://localhost:11434](http://localhost:11434) for AI text generation

The backend handles:
- AI text generation via Ollama
- Game state management
- Character progression and session handling

## 🔜 Roadmap & Future Features

- [ ] User authentication and profiles
- [ ] Save/load game functionality
- [ ] Sound effects and background music
- [ ] Enhanced character customization
- [ ] Multiplayer support
- [ ] Advanced inventory management
- [ ] Quest system and achievement tracking
- [ ] **Real-Time Notifications:** Integrate push notifications for in-game events and updates
- [ ] LOOT BOXES!

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

---

For more information about the backend service, visit the [shiny-system repository](https://github.com/iddv/shiny-system).

Happy chatting and adventuring!