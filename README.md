# 🌸 AI Journaling Companion

> *Your private, empathetic companion for meaningful self-reflection and personal growth*

An intelligent journaling application that helps users track their emotional well-being through AI-powered insights, clarity tracking, and personalized reflection prompts.

![AI Journaling Companion](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript) ![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat-square&logo=vite)

## ✨ Features

### 🧠 **Intelligent Analysis**
- **Sentiment Analysis**: Real-time emotional tone detection
- **Theme Extraction**: Identifies key emotions and life areas from your writing
- **Anxiety Pattern Detection**: Recognizes stress indicators and provides supportive resources
- **Dynamic Prompts**: Personalized writing prompts based on your recent entries

### 📊 **Clarity Tracking**
- **Daily Clarity Metrics**: Track how journaling improves your mental clarity
- **Before/After Assessment**: Measure clarity improvements from writing
- **Visual Progress Charts**: Beautiful pink-themed visualizations of your clarity journey
- **Multi-day Insights**: Understand patterns across weeks and months

### 🎨 **Beautiful Design**
- **Pink Gradient Theme**: Warm, calming color palette
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Delightful interactions and transitions
- **Accessibility Focused**: WCAG compliant design patterns

### 🔒 **Privacy First**
- **Local Storage**: All data stays on your device
- **No Account Required**: Start journaling immediately
- **Secure**: No data transmission to external servers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd journal-companion

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Mode
When you first open the app, click **"Load Demo Data"** to see the app in action with 3 weeks of realistic journal entries.

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **Charts**: Recharts 3.1.2
- **State Management**: Zustand 5.0.8
- **Form Handling**: React Hook Form 7.62.0
- **Validation**: Zod 4.1.5
- **Icons**: Lucide React 0.542.0

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AnxietySupport.tsx    # Anxiety detection & support
│   └── ClarityTracking.tsx   # Clarity measurement & visualization
├── utils/              # Utility functions
│   ├── nlp.ts               # Natural language processing
│   ├── anxietyDetection.ts  # Anxiety pattern recognition
│   ├── clarityTracking.ts   # Mental clarity algorithms
│   └── demoData.ts          # Sample data for demos
├── store.ts            # Zustand state management
├── types.ts            # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🎯 Key Algorithms

### Sentiment Analysis
- Analyzes emotional tone using curated word lists
- Returns sentiment scores from -1 (negative) to +1 (positive)
- Considers context and emotional nuance

### Theme Extraction
- Identifies emotional themes (joy, stress, gratitude, etc.)
- Recognizes life areas (work, relationships, health)
- Filters out generic words to focus on meaningful content

### Clarity Tracking
- Measures confusion vs. clarity indicators in text
- Tracks before/after writing emotional states
- Calculates improvement scores and patterns

## 🎨 Design Philosophy

- **Empathetic**: Warm, supportive language and interactions
- **Non-judgmental**: Celebrating all emotions as valid
- **Growth-focused**: Emphasizing progress and self-discovery
- **Accessible**: Clear typography, good contrast, intuitive navigation

## 📱 Usage Guide

1. **Start Writing**: Use the dynamic prompts or write freely
2. **Select Mood**: Choose your current emotional state
3. **Track Clarity**: Use the optional clarity check-in feature
4. **Review Insights**: Explore your emotional patterns and themes
5. **Monitor Progress**: Watch your clarity improvements over time

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Type checking
npm run build

# Linting
npm run lint

# Preview production build
npm run preview
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🎭 Demo Features

- **3 Weeks of Sample Data**: Realistic entries spanning work, gym, family time
- **Mixed Emotions**: Shows the full spectrum of human experience
- **Clarity Progression**: Demonstrates how journaling improves mental clarity
- **Theme Evolution**: Watch how emotional patterns change over time

## 🌟 Future Roadmap

- [ ] Export/import functionality
- [ ] Goal setting and tracking
- [ ] Meditation and mindfulness integration
- [ ] Mood correlation insights
- [ ] Custom theme creation
- [ ] Voice-to-text journaling

## 📄 License

MIT License - see LICENSE file for details

---

*Built with ❤️ for mental wellness and self-reflection*
