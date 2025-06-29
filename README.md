# AI Interview Practice Platform with LiveKit Voice Integration

A comprehensive AI-powered interview practice application that uses Large Language Models (LLMs) and LiveKit for real-time voice interviews, generating dynamic, contextual interview questions and providing intelligent feedback.

## 🚀 Features

### 🎙️ **LiveKit Voice Interviews**
- **Real-time voice communication** using LiveKit WebRTC infrastructure
- **AI-powered voice interviewer** that speaks questions and listens to responses
- **Speech-to-text transcription** for response analysis
- **Low-latency audio streaming** for natural conversation flow
- **Connection recovery** and session management
- **Multi-participant support** for group interviews (future enhancement)

### 🤖 **LLM-Powered Question Generation**
- Dynamic question generation based on your specific topic, experience level, and interview style
- Contextual follow-up questions that adapt to your responses
- Company-specific scenarios when target company is provided
- Support for multiple LLM providers (OpenAI GPT-4, Anthropic Claude, Google Gemini)

### 🎯 **Interview Types**
- **Technical Interviews**: Code problems, system design, technical concepts
- **HR Interviews**: Company culture, work-life balance, career goals
- **Behavioral Interviews**: STAR method scenarios, past experiences
- **Salary Negotiation**: Compensation discussions, benefit negotiations
- **Case Study Interviews**: Problem-solving scenarios, business cases

### 📊 **Intelligent Analytics**
- AI-powered response analysis and scoring
- Personalized feedback and improvement suggestions
- Detailed question-by-question review
- Performance tracking across multiple dimensions
- Voice interview session recordings and playback

### 🎙️ **Advanced Interface**
- **Voice-first interview experience** with LiveKit integration
- Speech-to-text input capability with fallback text input
- Real-time interview simulation with audio feedback
- Progress tracking and timer
- Note-taking functionality during voice interviews
- Responsive design for all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **LiveKit Client SDK** for real-time communication
- **Lucide React** for icons

### Backend
- **Python FastAPI** with Pydantic AI
- **LiveKit Server SDK** for room management
- **Multiple LLM Providers**: OpenAI, Anthropic, Google Gemini
- **Agentic AI Framework** for intelligent question generation
- **WebSocket** support for real-time communication

### AI Agents (Python)
- **LiveKit Agents Framework** (Python)
- **OpenAI** and **Google Cloud** integration
- **Speech-to-Text** and **Text-to-Speech**
- **Real-time conversation management**

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Python 3.8+** for AI agents
- **API keys** from either OpenAI, Anthropic, or Google
- **LiveKit Cloud account** or self-hosted LiveKit server
- **Microphone access** for voice interviews

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-interview-platform
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Setup Python environment and dependencies
npm run setup-python
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Choose your LLM provider
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here

# OR use OpenAI
# LLM_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here

# OR use Anthropic
# LLM_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# LiveKit Configuration (required for voice interviews)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-livekit-server.com

# Google Cloud (for advanced voice features)
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id

# Server Configuration
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Deployment Options

### Option 1: Simple Script Deployment (Recommended)

Use the deployment script for a single-command deployment:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

This script will:
1. Install frontend dependencies
2. Build the frontend for production
3. Install Python dependencies
4. Start the combined server

### Option 2: Manual Deployment

```bash
# Build frontend
npm run build

# Start the combined server
npm run start-prod
```

### Option 3: Docker Deployment

```bash
# Build and run with Docker
chmod +x deploy-docker.sh
./deploy-docker.sh
```

Or manually:
```bash
# Build the image
docker build -t ai-interview-platform .

# Run the container
docker run -d -p 3001:3001 --env-file .env ai-interview-platform
```

### Option 4: Docker Compose

```bash
# Start with docker-compose
docker-compose up -d
```

## 📚 Available Scripts

### Development Scripts
```bash
npm run dev              # Start frontend development server
npm run python-server    # Start Python backend only
```

### Production Scripts
```bash
npm run build           # Build frontend for production
npm run start-prod      # Build frontend and start production server
npm run start           # Alias for start-prod
npm run deploy          # Production deployment with uvicorn
```

### Utility Scripts
```bash
npm run setup-python    # Install Python dependencies
npm run lint            # Run ESLint
npm run preview         # Preview built frontend
```

## 🌐 Access Your Application

After deployment, your application will be available at:
- **Main Application**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **API Documentation**: http://localhost:3001/docs (FastAPI auto-generated)

## 🔧 Configuration

### LiveKit Setup

#### Option A: LiveKit Cloud (Recommended)
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Copy your API Key, Secret Key, and WebSocket URL
4. Add them to your `.env` file

#### Option B: Self-hosted LiveKit
1. Follow the [LiveKit deployment guide](https://docs.livekit.io/deploy/)
2. Configure your server URL in the `.env` file
3. Set up your API credentials

### LLM Provider Setup

#### Google Gemini (Recommended)
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set `LLM_PROVIDER=gemini` and `GEMINI_API_KEY` in `.env`

#### OpenAI
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set `LLM_PROVIDER=openai` and `OPENAI_API_KEY` in `.env`

#### Anthropic Claude
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Set `LLM_PROVIDER=anthropic` and `ANTHROPIC_API_KEY` in `.env`

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_production_api_key
LIVEKIT_WS_URL=wss://your-production-livekit-server.com
```

### Deployment to Cloud Platforms

#### Heroku
```bash
# Add buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/python

# Deploy
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway deploy
```

#### DigitalOcean App Platform
1. Connect your repository
2. Set build command: `npm run build`
3. Set run command: `python python_backend/main.py`
4. Add environment variables

## 🔒 Security

- **Token-based Authentication**: Secure LiveKit room access
- **API Key Protection**: Server-side credential management
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Proper cross-origin setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues related to:
- **LiveKit Integration**: Check [LiveKit Documentation](https://docs.livekit.io/)
- **Voice Features**: Review browser microphone permissions
- **API Issues**: Check backend logs and health endpoints
- **General Support**: Create an issue in this repository

## 🙏 Acknowledgments

- [LiveKit](https://livekit.io/) for real-time communication infrastructure
- [OpenAI](https://openai.com/) for GPT models and Whisper
- [Google Cloud](https://cloud.google.com/) for Speech and Gemini AI
- [Anthropic](https://anthropic.com/) for Claude models
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the Python backend framework