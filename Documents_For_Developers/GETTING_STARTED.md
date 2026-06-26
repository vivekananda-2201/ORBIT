# Getting Started with ORBIT

**Welcome!** This guide will walk you through installing and running ORBIT from scratch, even if you're completely new to development.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Step 1: Install Prerequisites](#step-1-install-prerequisites)
4. [Step 2: Clone the Project](#step-2-clone-the-project)
5. [Step 3: Backend Setup](#step-3-backend-setup)
6. [Step 4: Frontend Setup](#step-4-frontend-setup)
7. [Step 5: Run the Application](#step-5-run-the-application)
8. [Step 6: Using ORBIT](#step-6-using-orbit)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## Prerequisites

Before starting, you'll need:

1. **Python** (version 3.10 or higher)
2. **Node.js** (version 18 or higher, includes npm)
3. **Ollama** (for local AI models)
4. **A Code Editor** (VS Code recommended)
5. **Terminal/Command Line Access**

---

## System Requirements

- **OS:** Windows, macOS, or Linux
- **RAM:** 8GB minimum (16GB recommended for running large models)
- **Storage:** 5GB free space
- **Internet:** Required for initial setup and model downloads

---

## Step 1: Install Prerequisites

### 1.1 Install Python

**Windows:**
1. Visit [python.org](https://www.python.org/downloads/)
2. Download Python 3.11+ installer
3. Run installer and **CHECK** "Add Python to PATH"
4. Click "Install Now"
5. Verify installation:
```bash
python --version
```

**macOS:**
```bash
# Using Homebrew
brew install python@3.11
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

### 1.2 Install Node.js

**Windows & macOS:**
1. Visit [nodejs.org](https://nodejs.org/) 
2. Download LTS version (18+ or 20+)
3. Run installer and follow prompts
4. Verify installation:
```bash
node --version
npm --version
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 1.3 Install Ollama

1. Visit [ollama.ai](https://ollama.ai)
2. Download installer for your OS
3. Run installer and follow setup instructions
4. After installation, download the required model:
```bash
ollama pull qwen3.5:4b
```

This downloads a lightweight 4B parameter model (~2.5GB). The first pull takes a few minutes.

Verify Ollama is running:
```bash
ollama list
```

You should see `qwen3.5:4b` in the list.

### 1.4 Install a Code Editor (Optional but Recommended)

Download [VS Code](https://code.visualstudio.com/) and install the **Python** and **ES7+ React/Redux/React-Native snippets** extensions.

---

## Step 2: Clone the Project

Open your terminal and navigate to where you want the project:

```bash
# Navigate to a folder (example: Desktop or Documents)
cd ~/Desktop

# Clone the ORBIT repository
git clone https://github.com/your-username/ORBIT.git

# Enter the project folder
cd ORBIT
```

If you don't have git, [install it here](https://git-scm.com/downloads).

---

## Step 3: Backend Setup

The backend runs the AI logic and API server.

### 3.1 Create Virtual Environment

A virtual environment isolates Python packages for this project.

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

✅ You'll see `(.venv)` in your terminal when active.

### 3.2 Install Python Dependencies

```bash
pip install --upgrade pip
pip install fastapi uvicorn ollama pydantic
```

Wait for installations to complete (1-2 minutes).

### 3.3 Verify Backend Setup

```bash
python -c "import fastapi; import ollama; print('✓ Backend dependencies installed')"
```

---

## Step 4: Frontend Setup

The frontend is the UI you see in the browser.

### 4.1 Navigate to Frontend Folder

```bash
cd frontend
```

### 4.2 Install Node Dependencies

```bash
npm install
```

This downloads ~1000 packages (~500MB). Takes 2-5 minutes depending on internet speed.

### 4.3 Verify Frontend Setup

```bash
npm list react react-dom vite typescript
```

Should show version numbers without errors.

---

## Step 5: Run the Application

You need **two terminal windows** running simultaneously.

### 5.1 Terminal 1: Start Backend

**Keep the first terminal in the project root:**

```bash
# Make sure you're in the project root (not in frontend folder)
cd /path/to/ORBIT

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Start backend
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:5000
INFO:     Application startup complete
```

✅ Backend is ready. **Don't close this terminal.**

### 5.2 Terminal 2: Start Frontend

**Open a NEW terminal window** and navigate to the project:

```bash
cd /path/to/ORBIT/frontend

npm run dev
```

You should see:
```
  VITE v8.0.16  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### 5.3 Open in Browser

Click the link or manually open: **http://localhost:5173/**

✅ ORBIT is now running!

---

## Step 6: Using ORBIT

### 6.1 Basic Usage

1. **Type a message** in the input box at the bottom
2. **Press Enter** or click Send
3. **Wait for response** - you'll see it stream in real-time
4. **Create new chats** by clicking "+ New Chat" in the sidebar
5. **View history** in the left sidebar under "RECENT CHATS"

### 6.2 Example Prompts to Try

- "What is machine learning?"
- "Write a simple Python function to calculate factorial"
- "Explain quantum computing in simple terms"
- "Help me debug this code: [paste code here]"

### 6.3 Chat History

- All conversations auto-save to your browser
- Click chat names to switch between conversations
- Click the trash icon to delete a chat
- History persists even after closing the browser

---

## Troubleshooting

### Issue: Backend fails to start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
# Make sure virtual environment is activated (you should see (.venv) in terminal)
pip install fastapi uvicorn ollama pydantic
```

---

### Issue: Frontend won't start

**Error:** `npm ERR! command not found: npm`

**Solution:** Node.js not installed or not in PATH
- Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation

---

### Issue: "Cannot connect to backend"

**Error:** Connection error in chat interface

**Solutions:**
1. Check Terminal 1 - backend must be running (http://127.0.0.1:5000)
2. Make sure you're using two separate terminals
3. Verify Ollama is running: `ollama list`
4. Try restarting both backend and frontend

---

### Issue: Ollama model not downloading

**Error:** "No model found" or connection timeout

**Solutions:**
```bash
# Ensure Ollama is running
ollama serve

# In another terminal, download the model
ollama pull qwen3.5:4b

# Check what models you have
ollama list
```

---

### Issue: Port already in use

**Error:** `Address already in use` or `EADDRINUSE`

**Solutions:**
```bash
# Find what's using port 5000 (backend)
# Windows:
netstat -ano | findstr :5000

# macOS/Linux:
lsof -i :5000

# Kill the process or use a different port in main.py
```

---

## Next Steps

### Learn More

- Read [ChatInterface.md](./ChatInterface.md) for technical architecture
- Explore [Ollama documentation](https://ollama.ai/library)
- Learn [React basics](https://react.dev)

### Development

- Modify prompts in `frontend/src/components/chat/PromptSuggestions/PromptSuggestions.tsx`
- Change the fallback model in `backend/modules/chat/service.py`
- Customize UI in `frontend/src/index.css`

### Common Modifications

**Using a different Ollama model:**
```python
# In backend/modules/chat/service.py, change the fallback:
model="mistral:7b"  # or "neural-chat", "dolphin-mixtral", etc.
```

**Adjust UI theme:**
Edit CSS variables in `frontend/src/index.css`

---

## Getting Help

1. **Check terminal output** - error messages usually indicate the problem
2. **Restart components** - close and rerun backend/frontend
3. **Verify installations** - run prerequisite checks above
4. **Read the logs** - backend shows detailed error info

---

## Quick Command Reference

| What | Command |
|------|---------|
| Activate Python env | `source .venv/bin/activate` (macOS/Linux) or `.venv\Scripts\activate` (Windows) |
| Install backend deps | `pip install fastapi uvicorn ollama pydantic` |
| Install frontend deps | `cd frontend && npm install` |
| Start backend | `python main.py` |
| Start frontend | `cd frontend && npm run dev` |
| Build for production | `cd frontend && npm run build` |
| Stop server | `Ctrl+C` (in terminal) |
| Download Ollama model | `ollama pull qwen3.5:4b` |

---

## System Check

Before starting, verify everything is installed:

```bash
python --version        # Should show 3.10+
node --version          # Should show 18+
npm --version           # Should show 9+
ollama list             # Should show qwen3.5:4b
```

If all show versions, you're ready! Proceed to **Step 2: Clone the Project**.

---

**Last Updated:** June 2026  
**For Technical Details:** See [ChatInterface.md](./ChatInterface.md)  
**Project Overview:** See [../README.md](../README.md)
