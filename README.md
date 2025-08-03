# 🚀 IdeaSpark - AI-Powered Business Idea Generator

> Transform your skills and interests into profitable business opportunities with data-driven insights

<img width="1271" height="670" alt="image" src="https://github.com/user-attachments/assets/a7488515-996c-4213-9591-187158a62c23" />

**IdeaSpark** is an intelligent web application that helps entrepreneurs and creators discover personalized business ideas with real market potential. Using the Gold Mining Framework, IdeaSpark analyzes Reddit discussions, market trends, and your unique profile to uncover pain points and generate tailored business opportunities.

## ✨ Why IdeaSpark?

- **🎯 Personalized Recommendations**: Generate ideas based on your specific skills, interests, and niche
- **📊 Data-Driven Insights**: Leverage real Reddit discussions and Google Trends data for validation
- **🔍 Pain Point Discovery**: Identify genuine problems people are discussing online
- **⚡ Smart Targeting**: AI-powered subreddit selection for relevant market research
- **💼 Business-Ready Output**: Get complete idea packages with features, value propositions, and market analysis

## 📑 Table of Contents

- [Why IdeaSpark?](#-why-ideaspark)
- [Technology Stack](#️-technology-stack)
- [Quick Start](#quick-start)
- [Setup Instructions](#setup-instructions)
- [New Features](#new-features)
- [API Endpoints](#api-endpoints)
- [Contributing](#-contributing)

## 🏗️ Technology Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.9+
- **AI Integration**: OpenAI GPT-4
- **Data Sources**: Reddit API (PRAW) + Google Trends (PyTrends)
- **Storage**: Local browser storage for privacy

## Project Structure

```
idea-spark/
├── frontend/          # React (Vite) application
│   ├── src/
│   │   ├── components/
│   │   │   ├── APIConfig.jsx
│   │   │   └── PainPointAnalyzer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── backend/           # FastAPI application
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── start-dev.ps1      # PowerShell script to start both servers
└── setup-env.ps1      # Environment setup script
```

## Quick Start

1. **Run the development servers**:
   ```powershell
   .\start-dev.ps1
   ```
   This will start both the backend (port 8000) and frontend (port 5173) with auto-reload.

2. **Or set up manually**:
   ```powershell
   .\setup-env.ps1
   ```

## Setup Instructions

1.  **Prerequisites**:
    -   Node.js (v16+): [nodejs.org](https://nodejs.org/)
    -   Python (3.9+): [python.org](https://www.python.org/)
    -   Git: [git-scm.com](https://git-scm.com/)

2.  **Clone the Project**:
    ```bash
    git clone https://github.com/your-username/idea-spark.git
    cd idea-spark
    ```

3.  **Backend Setup**:
    -   Navigate to `backend`:
        ```bash
        cd backend
        ```
    -   Create a virtual environment:
        ```bash
        python -m venv venv
        source venv/bin/activate  # Windows: venv\Scripts\activate
        ```
    -   Install dependencies:
        ```bash
        pip install -r requirements.txt
        ```
    -   Create `.env` file with your API keys:
        -   OpenAI: Sign up at [platform.openai.com](https://platform.openai.com/) for an API key.
        -   Reddit: Create an app at [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps/) for client ID and secret.
        -   Example `.env`:
            ```text
            OPENAI_API_KEY=sk-...
            REDDIT_CLIENT_ID=...
            REDDIT_CLIENT_SECRET=...
            REDDIT_USER_AGENT=IdeaSpark/1.0
            ```
    -   Run the server:
        ```bash
        uvicorn main:app --reload
        ```
    -   Server runs at `http://localhost:8000`.

4.  **Frontend Setup**:
    -   Navigate to `frontend`:
        ```bash
        cd ../frontend
        ```
    -   Install dependencies:
        ```bash
        npm install
        ```
    -   Run the development server:
        ```bash
        npm run dev
        ```
    -   App runs at `http://localhost:5173`.

## New Features

### 🎯 **Subreddit Metadata System**
- **Local subreddit database** with activity metrics and user engagement scores
- **Smart subreddit targeting** based on user profile and niche selection
- **Research-focused subreddit discovery** for more accurate pain point analysis
- **Subreddit scoring algorithm** that considers activity level, user engagement, and topic relevance

### 👤 **Profile Management**
- **Named profiles** with local storage for API keys and user preferences
- **Profile switching** - save multiple configurations for different use cases
- **Profile deletion** and management interface
- **Auto-save** functionality for current session

### 🔄 **Improved UI Flow**
- **8-step process** with clear progress tracking
- **Step validation** - ensures subreddit selection before Reddit search
- **Loading indicators** with spinners and disabled states
- **Better error handling** with user-friendly messages

### 🚀 **Enhanced Backend**
- **New endpoints** for subreddit management (`/subreddits/`, `/subreddits/search/`)
- **Targeted Reddit search** (`/reddit/search/`) with subreddit filtering
- **Improved CORS handling** for better frontend-backend communication
- **Consistent API responses** with proper data structure

### 📊 **Better Data Processing**
- **Accurate pain point clustering** with improved OpenAI prompts
- **Structured response format** for consistent frontend parsing
- **Error recovery** with fallback mechanisms

## Features Implemented

-   **Custom Onboarding**: Dropdowns with "Other" text inputs and a details textarea, validated to ensure interest and skill are provided.
-   **Profile Management**: Save and load named profiles with API keys and user preferences.
-   **Subreddit Selection**: Choose from targeted subreddits based on your niche and profile.
-   **Niche Selection**: Dropdown to choose from 5 AI-generated niches, with back navigation.
-   **Demand Validation**: PyTrends data (mocked if API fails) displayed as a Chart.js line chart with trend summary.
-   **Reddit Search**: Search for relevant posts in selected subreddits with filtering options.
-   **Pain Point Extraction**: Textarea for Reddit threads, processed by OpenAI (mocked if no API), with drag-and-drop prioritization using React-DnD.
-   **Business Idea Generation**: 3 ideas with names, descriptions, features, value propositions, and resonance scores (mocked at 70–80), plus 1–5 star ratings.
-   **Progress Tracking**: Progress bar (0–100%) and local storage for persistence.
-   **Download Summary**: Text file with all user inputs and outputs.
-   **UI/UX**: Premium design with calming blue-green palette, clean Tailwind CSS, responsive layout, supportive tone, and loading indicators.

## API Endpoints

### Backend Endpoints
- `POST /onboard/` - Process user onboarding data
- `POST /niches/` - Generate business niches
- `GET /demand/{keyword}` - Get demand trends for keywords
- `GET /subreddits/` - Get available subreddits
- `POST /subreddits/search/` - Search for subreddits
- `POST /reddit/search/` - Search Reddit posts in selected subreddits
- `POST /analyze/` - Analyze Reddit posts for pain points
- `POST /ideas/` - Generate business ideas from pain points
- `POST /summary/` - Generate summary report

## Notes

-   **Mock Data**: OpenAI, PRAW, and PyTrends responses are mocked to ensure you can test without API keys. Replace `.env` values for real integrations.
-   **Resonance Score**: Mocked (70–80) for MVP. Future logic will use skill alignment (40%), interest alignment (30%), and market potential (30%).
-   **Subreddit Metadata**: Stored locally and updated via Reddit API for targeted research.
-   **Profile Storage**: All profiles stored in browser localStorage for privacy.
-   **Auto-reload**: Both frontend (Vite) and backend (uvicorn --reload) auto-reload on code changes.
-   **Error Handling**: Comprehensive error handling with user-friendly messages and fallback mechanisms.

## Troubleshooting

-   **API Errors**: Check `.env` for correct keys. If OpenAI fails, ensure `gpt-4o-mini` is available or fallback to `gpt-3.5-turbo`.
-   **Reddit Rate Limits**: PRAW may hit limits; use mock threads if needed.
-   **CORS Issues**: Backend CORS configured for `http://localhost:5173` and other common origins.
-   **Profile Issues**: Clear browser localStorage if profile data becomes corrupted.
-   **Run Issues**: Use `start-dev.ps1` script for automatic server startup.

## Future Enhancements

-   Real resonance score calculation.
-   Advanced subreddit analytics and trending topics.
-   Additional data sources (X, user uploads).
-   Landing page for IdeaSpark using **Landing Page Prompt Generator** and **Transition Guardian** guidelines.
-   User accounts with server-side storage.
-   Advanced keyword research (e.g., Ahrefs API).
-   Subreddit activity monitoring and alerts.


## 🧪 Testing Plan

1.  **Profile Setup**: Test profile creation, loading, and deletion with API keys.
2.  **Onboarding**: Test dropdowns, "Other" inputs, and details textarea. Submit without interest/skill → See error.
3.  **Subreddit Selection**: Choose from targeted subreddits based on niche.
4.  **Niche Selection**: Verify 5 niches load (mocked or real). Select one → Proceed.
5.  **Demand Validation**: Check chart loads with 6 months of data. Paste Reddit text → Proceed.
6.  **Reddit Search**: Search for posts in selected subreddits and review results.
7.  **Pain Points**: Drag to reorder 5 pain points. Select top 3 → Proceed.
8.  **Ideas**: Rate 3 ideas (1–5 stars). Check resonance scores (70–80). Proceed.
9.  **Summary**: Download text file, verify contents. Restart and confirm progress clears.
10. **Edge Cases**: Test empty inputs, API failures, and page reloads.

## 🤝 Contributing

We welcome contributions to IdeaSpark! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and structure
- Test your changes thoroughly using the testing plan above
- Update documentation for any new features
- Ensure all API endpoints are properly documented

## 🌟 Acknowledgments

- Built with the Gold Mining Framework for systematic opportunity discovery
- Powered by OpenAI's GPT models for intelligent content generation
- Reddit community data for real-world pain point validation
- Google Trends for market demand insights

---

**Ready to discover your next big idea?** 🚀 Get started with IdeaSpark today! 
