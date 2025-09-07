#!/usr/bin/env python3
"""
Startup script for the Deep Research Agent backend server.
Handles Python path configuration and starts the FastAPI server.
"""

import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
src_dir = backend_dir / "src"
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(src_dir))

# Set environment variables
os.environ.setdefault("PYTHONPATH", f"{backend_dir}:{src_dir}")

if __name__ == "__main__":
    import uvicorn
    
    # Configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    print(f"Starting Deep Research Agent backend server...")
    print(f"Host: {host}, Port: {port}, Reload: {reload}")
    print(f"Python path: {sys.path[:3]}...")
    
    # Start the server
    uvicorn.run(
        "src.api.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )