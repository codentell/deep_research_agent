# Deep Research Agent

A powerful fullstack application using React frontend and LangGraph-powered backend agent for comprehensive web research. The agent dynamically generates search queries, performs web research using Google's Gemini models with native search capabilities, and provides well-structured answers with proper citations.

## Features

- 🧠 **LangGraph Agent**: Advanced research workflow with iterative query generation and reflection
- 🔍 **Native Google Search**: Uses Google's Gemini models with built-in search capabilities
- 📊 **Structured Research**: Multi-loop research process with knowledge gap analysis
- 📄 **Citation Management**: Automatic source tracking and citation formatting
- ✨ **Modern UI**: Built with shadcn/ui components and Framer Motion animations
- 🎬 **Live Process Visualization**: Real-time agent thinking process with animated states
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🔄 **Interactive Progress**: Watch the AI generate queries, search, reflect, and synthesize
- 🎨 **Beautiful Animations**: Smooth transitions and micro-interactions throughout
- 🐳 **Docker Support**: Easy deployment with containerization

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  LangGraph      │    │  Google Gemini  │
│   - TypeScript  │◄──►│  Backend Agent  │◄──►│  - Search API   │
│   - Tailwind CSS│    │  - FastAPI      │    │  - LLM Models   │
│   - Markdown    │    │  - Research     │    │  - Grounding    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ (or Conda)
- **GEMINI_API_KEY**: Google Gemini API key with search capabilities enabled

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd deep_research_agent
```

### 2. Backend Setup

Choose either **Option A** (Conda - Recommended) or **Option B** (pip):

#### Option A: Using Conda Environment (Recommended)

```bash
# Create and activate conda environment
conda env create -f environment.yml
conda activate deep-research-agent

# Setup environment variables
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Verify setup (optional but recommended)
python check_setup.py
```

#### Option B: Using pip and venv

```bash
# Create virtual environment
python -m venv myenv

# Activate virtual environment
# On Windows:
.\myenv\Scripts\activate
# On Mac/Linux:
source myenv/bin/activate

# Install backend dependencies
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
pip install -e .

# Verify setup (optional but recommended)
python check_setup.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies and setup shadcn/ui
npm install

# Initialize shadcn/ui (choose default options)
npx shadcn@latest init

# Add required components
npx shadcn@latest add button card progress badge separator textarea select

# Or run the automated setup script
# chmod +x ../setup-shadcn.sh && ../setup-shadcn.sh
```

### 4. Development Servers

**Terminal 1 - Backend:**
```bash
# Make sure your environment is activated
# Conda: conda activate deep-research-agent
# Venv: source myenv/bin/activate (or .\myenv\Scripts\activate on Windows)

cd backend
python run_server.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## ✨ Modern UI Features

### Live Process Visualization
- **Animated Process Steps**: Watch the agent progress through query generation, web search, reflection, and synthesis
- **Real-time Updates**: See generated queries, search results count, and reflection notes as they happen  
- **Progress Indicators**: Visual progress bars and step indicators
- **Interactive Animations**: Smooth transitions and micro-interactions powered by Framer Motion

### Beautiful Interface
- **shadcn/ui Components**: Modern, accessible components with consistent design
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Ready**: Built-in support for light/dark theme switching
- **Gradient Backgrounds**: Subtle gradients and visual effects
- **Animated Icons**: Rotating brain icons and interactive elements

### Enhanced UX
- **Collapsible Settings**: Expandable configuration panel for research parameters
- **Smart Tooltips**: Contextual help and information
- **Loading States**: Engaging loading animations and skeleton screens
- **Error Handling**: Beautiful error states with clear messaging
- **Source Cards**: Interactive source cards with hover effects

### Environment Management

**Conda Commands:**
```bash
# List conda environments
conda env list

# Activate environment
conda activate deep-research-agent

# Deactivate environment
conda deactivate

# Update environment from file
conda env update -f environment.yml

# Remove environment
conda env remove -n deep-research-agent
```

## Research Agent Workflow

The agent follows a sophisticated research process:

### 1. **Query Generation**
- Takes user input and generates multiple diverse search queries
- Uses Gemini 2.0 Flash for strategic query formulation
- Considers different angles and aspects of the research topic

### 2. **Web Research** 
- Executes parallel web searches using Google's native search tool
- Leverages Gemini's grounding capabilities for accurate information
- Extracts and processes relevant content from multiple sources

### 3. **Reflection & Analysis**
- Analyzes gathered information for completeness
- Identifies knowledge gaps and missing perspectives  
- Uses Gemini 2.0 Flash Thinking for deep reflection

### 4. **Iterative Refinement**
- Generates follow-up queries if information is insufficient
- Repeats research cycles up to configured maximum
- Ensures comprehensive coverage of the research topic

### 5. **Answer Synthesis**
- Combines all research findings into coherent response
- Provides proper citations and source attribution
- Structures information logically with clear insights

## Configuration

### Research Parameters

- **Max Research Loops**: 1-3 (default: 2)
- **Initial Queries**: 2-5 (default: 3)  
- **Models**: Configurable Gemini model selection

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
LANGCHAIN_API_KEY=your_langsmith_key_here  # Optional for tracing
LANGCHAIN_PROJECT=deep-research-agent      # Optional
```

## Production Deployment

### Docker Deployment

```bash
# Build the image
docker build -t deep-research-agent .

# Run with environment variables
docker run -p 8123:8123 \
  -e GEMINI_API_KEY=your_key_here \
  deep-research-agent
```

### Docker Compose

```bash
# Copy environment variables
cp backend/.env.example .env
# Edit .env with your API keys

# Start the application
docker-compose up -d
```

Access the application at http://localhost:8123/app

## API Endpoints

- `GET /` - Health check and API info
- `POST /research` - Conduct research on a query
- `GET /config` - Get current agent configuration
- `GET /health` - System health status

### Research API Example

```json
POST /research
{
  "query": "What are the latest developments in quantum computing?",
  "max_research_loops": 2,
  "initial_search_query_count": 3
}
```

Response:
```json
{
  "answer": "Comprehensive research-based answer with citations...",
  "sources": [
    {
      "value": "https://example.com/article",
      "short_url": "[example-abc123]",
      "title": "Article Title"
    }
  ],
  "iterations": 2,
  "status": "completed"
}
```

## Development

### Project Structure

```
deep_research_agent/
├── backend/
│   └── src/
│       ├── agent/          # LangGraph agent implementation
│       │   ├── graph.py    # Main agent workflow
│       │   ├── state.py    # Agent state management
│       │   ├── prompts.py  # LLM prompts
│       │   └── utils.py    # Utility functions
│       └── api/
│           └── main.py     # FastAPI application
├── frontend/
│   └── src/
│       ├── components/     # React components
│       ├── types/          # TypeScript types
│       └── utils/          # API client
└── docker-compose.yml      # Production deployment
```

### Key Dependencies

**Backend:**
- `langgraph>=0.2.6` - Agent workflow framework
- `langchain-google-genai` - Gemini model integration
- `google-genai` - Native Google AI client
- `fastapi` - Web API framework

**Frontend:**
- `react` + `typescript` - UI framework
- `shadcn/ui` + `radix-ui` - Component library
- `tailwindcss` - Styling system
- `framer-motion` - Animation library
- `react-markdown` - Markdown rendering
- `axios` - API client

## Features & Enhancements

### Current Features
- ✅ Multi-step research workflow with LangGraph
- ✅ Native Google Search integration via Gemini
- ✅ Citation management and formatting
- ✅ Configurable research parameters
- ✅ Live process visualization with animations
- ✅ Modern shadcn/ui interface
- ✅ Framer Motion animations throughout
- ✅ Real-time agent state tracking
- ✅ Responsive mobile-first design
- ✅ Docker deployment support

### Potential Enhancements
- 🔲 Research history and session management
- 🔲 Export results (PDF, Word, Markdown)
- 🔲 Custom research templates
- 🔲 Collaborative research workspaces
- 🔲 Advanced filtering and source preferences
- 🔲 Research progress visualization
- 🔲 Integration with academic databases
- 🔲 Multi-language research support

## License

This project is licensed under the Apache License 2.0. See the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

**1. ModuleNotFoundError: No module named 'agent'**
```bash
# Solution: Use the provided startup script
cd backend
python run_server.py  # Instead of uvicorn directly
```

**2. ModuleNotFoundError: No module named 'langgraph'**
```bash
# Solution: Install dependencies
conda activate deep-research-agent
pip install -e .  # Or recreate conda environment
```

**3. GEMINI_API_KEY not configured**
```bash
# Solution: Set up your API key
cd backend
cp .env.example .env
# Edit .env file and add: GEMINI_API_KEY=your_actual_api_key_here
```

**4. Import or startup issues**
```bash
# Run the setup verification script
cd backend
python check_setup.py
```

**5. Port already in use**
```bash
# Change the port in run_server.py or set environment variable
export PORT=8001
python run_server.py
```

### Setup Verification

Run the setup check script to diagnose issues:
```bash
cd backend
python check_setup.py
```

This will verify:
- ✅ All required dependencies are installed
- ✅ Environment variables are configured
- ✅ Agent modules can be imported
- ✅ System is ready to start

## Support

For issues and questions, please open a GitHub issue or refer to the documentation.