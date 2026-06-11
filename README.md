# ORBIT

### Operational Research and Benchmarking Interface for Transformers

ORBIT is a lightweight, local-first AI engineering workspace focused on open-source language models.

The project aims to simplify the workflow of AI developers by providing a unified environment for managing, testing, evaluating, and benchmarking local AI systems.

---

## 🚀 Quick Start

**New to ORBIT?** Start here:

→ [**Getting Started Guide**](./Documents_For_Developers/GETTING_STARTED.md) - Step-by-step setup for beginners

**Want technical details?**

→ [**Chat Interface Documentation**](./Documents_For_Developers/ChatInterface.md) - Architecture, API, and implementation details

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [GETTING_STARTED.md](./Documents_For_Developers/GETTING_STARTED.md) | Complete setup guide with all dependencies and commands |
| [ChatInterface.md](./Documents_For_Developers/ChatInterface.md) | Technical architecture, API reference, and implementation details |
| [README.md](./README.md) | Project overview and vision (this file) |

---

## Current Focus


The initial development phase is focused on building the foundation:

- Chat Interface
- Chat History & Persistence
- Context Management
- Ollama Model Management
- System Resource Monitoring

---

## Long-Term Vision

ORBIT will gradually evolve into a complete AI engineering platform featuring:

- Model Evaluation & Benchmarking
- Prompt Testing
- RAG Experimentation
- Vector Database Management
- Agent Workflow Testing
- Local AI Infrastructure Tooling

---

## Core Principles

- Local First
- Open Source
- Lightweight
- Developer Focused
- Privacy Friendly

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- FastAPI (Python)
- Ollama

### AI Layer
- Python
- Ollama (qwen3.5:4b)
- llama.cpp (Coming Soon)

### Database
- PostgreSQL (Planned)

---

## 🎯 Core Principles

- **Local First** - Run everything on your machine
- **Open Source** - Free and transparent
- **Lightweight** - Minimal dependencies
- **Developer Focused** - Built for AI engineers
- **Privacy Friendly** - Your data stays on your device

---

## 📊 Project Status

🚧 **Early Development (Pre-Alpha)**

ORBIT is currently under active development with focus on the chat interface and session management.

### Current Features
✅ Real-time streaming chat responses  
✅ Session history with localStorage persistence  
✅ Markdown rendering with code blocks  
✅ Responsive dark-themed UI  
✅ Copy-to-clipboard for code  
✅ Local Ollama integration  

---

## 🗺️ Long-Term Vision

ORBIT will gradually evolve into a complete AI engineering platform featuring:

- Model Evaluation & Benchmarking
- Prompt Testing & Optimization
- RAG Experimentation
- Vector Database Management
- Agent Workflow Testing
- Local AI Infrastructure Tooling
- Resource Monitoring & Analytics

---

## 📖 Getting Help

### For Setup Issues
See the [**Getting Started Guide**](./Documents_For_Developers/GETTING_STARTED.md) for:
- Prerequisites and installation steps
- Troubleshooting common issues
- Quick command reference

### For Technical Questions
See [**Chat Interface Documentation**](./Documents_For_Developers/ChatInterface.md) for:
- System architecture
- API reference
- Implementation details
- File structure

### Common Issues
- **Backend won't start?** → [Troubleshooting Guide](./Documents_For_Developers/GETTING_STARTED.md#troubleshooting)
- **Frontend errors?** → Check backend is running on http://127.0.0.1:5000
- **Model download slow?** → Run `ollama pull qwen3.5:4b` separately
- **Port conflicts?** → See [Port Already in Use](./Documents_For_Developers/GETTING_STARTED.md#issue-port-already-in-use)

---

## 🔗 Quick Links

- **Get Started:** [GETTING_STARTED.md](./Documents_For_Developers/GETTING_STARTED.md)
- **Architecture:** [ChatInterface.md](./Documents_For_Developers/ChatInterface.md)
- **Ollama Models:** [ollama.ai/library](https://ollama.ai/library)
- **FastAPI Docs:** [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **React Guide:** [react.dev](https://react.dev)

---

## 💡 Key Commands

```bash
# Setup
python -m venv .venv
source .venv/bin/activate  # macOS/Linux or .venv\Scripts\activate (Windows)
pip install fastapi uvicorn ollama pydantic

# Backend
python main.py

# Frontend
cd frontend
npm install
npm run dev

# Build
npm run build
```

See [**Quick Command Reference**](./Documents_For_Developers/GETTING_STARTED.md#quick-command-reference) for more.

---

## 📄 License

TBD

---

## 👨‍💻 Development Notes

### Project Structure
```
ORBIT/
├── Documents_For_Developers/    # All documentation
│   ├── GETTING_STARTED.md       # ← Start here!
│   ├── ChatInterface.md         # Technical docs
│   └── Walkthrough.md           # Additional reference
├── backend/                     # Python API & services
├── frontend/                    # React + TypeScript UI
├── main.py                      # Server entry point
├── README.md                    # This file
└── rough.py                     # Experimental code
```

### Getting Started with Development
1. Read [GETTING_STARTED.md](./Documents_For_Developers/GETTING_STARTED.md)
2. Follow setup steps in "Step 1-5"
3. Review [ChatInterface.md](./Documents_For_Developers/ChatInterface.md) for architecture
4. Explore code in `backend/` and `frontend/` folders

---

> Building the engineering workspace I always wished existed for local AI development.

**Last Updated:** June 2026

