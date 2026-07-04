# 🚨 Emergency Response System

An intelligent, AI-powered platform built to streamline communication, coordinate critical data, and optimize decision-making during emergency scenarios. This application leverages the Google Gemini API to analyze situation reports and generate real-time action plans.

## 🛠️ Tech Stack

- **Framework:** React (TypeScript)
- **Build Tool:** Vite
- **AI Integration:** Google Gemini API (via `@google/generative-ai`)
- **Styling:** Tailwind CSS (configured via `components.json`)

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed (v18 or higher recommended).

### 1. Clone & Install Dependencies

```bash
# Install package dependencies
npm install
```

### 2. Environment Configuration

The application requires a valid Google Gemini API key to interact with the AI features. 

1. Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```
2. Open `.env.local` and add your API key using the required Vite prefix:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

> ⚠️ **Security Warning:** Never commit `.env.local` or raw API keys to GitHub. Ensure `.env*` remains listed inside your `.gitignore` file.

### 3. Run Locally

To spin up the local development server:

```bash
npm run dev
```

Once started, open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

## 📦 Production Builds

To compile and optimize the application for production deployment:

```bash
# Generates static assets inside the /dist folder
npm run build

# Preview the local production build
npm run preview
```

## 📁 Project Structure

```text
├── dist/               # Compiled production files (ignored by Git)
├── node_modules/       # Project dependencies (ignored by Git)
├── src/                # Core application source code
│   ├── components/     # Reusable UI elements
│   ├── main.tsx        # Application entry point
│   └── App.tsx         # Global layouts and routing
├── .env.local          # Local environment secrets (ignored by Git)
├── .gitignore          # Version control ignore targets
├── components.json     # UI and component frameworks settings
├── index.html          # HTML template entry point
├── package.json        # Dependencies and scripts definitions
├── tsconfig.json       # TypeScript compiler settings
└── vite.config.ts      # Vite server options and bundling configuration
```
