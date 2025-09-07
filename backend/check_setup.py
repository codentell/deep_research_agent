#!/usr/bin/env python3
"""
Setup verification script for Deep Research Agent backend.
Checks if all required dependencies are installed and importable.
"""

import sys
from pathlib import Path

def check_dependencies():
    """Check if all required dependencies are available."""
    required_packages = [
        ("langgraph", "LangGraph framework"),
        ("langchain", "LangChain core"),
        ("langchain_google_genai", "Google Gemini integration"),
        ("fastapi", "FastAPI web framework"),
        ("google.genai", "Google AI client"),
        ("dotenv", "Environment variable loading"),
        ("pydantic", "Data validation"),
    ]
    
    missing_packages = []
    
    print("🔍 Checking dependencies...")
    print("-" * 40)
    
    for package, description in required_packages:
        try:
            __import__(package)
            print(f"✅ {package:<20} - {description}")
        except ImportError:
            print(f"❌ {package:<20} - {description}")
            missing_packages.append(package)
    
    print("-" * 40)
    
    if missing_packages:
        print(f"\n⚠️  Missing {len(missing_packages)} required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n💡 Install missing packages with:")
        print("   conda env create -f environment.yml")
        print("   conda activate deep-research-agent")
        print("   OR")
        print("   pip install -e .")
        return False
    else:
        print(f"✅ All {len(required_packages)} dependencies are installed!")
        return True

def check_environment():
    """Check environment configuration."""
    import os
    
    print("\n🔧 Checking environment configuration...")
    print("-" * 40)
    
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        print("✅ .env file found")
        
        # Check for GEMINI_API_KEY
        from dotenv import load_dotenv
        load_dotenv()
        
        if os.getenv("GEMINI_API_KEY"):
            key = os.getenv("GEMINI_API_KEY")
            masked_key = key[:8] + "..." + key[-4:] if len(key) > 12 else "***"
            print(f"✅ GEMINI_API_KEY configured ({masked_key})")
        else:
            print("❌ GEMINI_API_KEY not found in environment")
            print("💡 Add your Gemini API key to the .env file")
            return False
    else:
        print("❌ .env file not found")
        print("💡 Copy .env.example to .env and configure your API key")
        return False
    
    return True

def check_imports():
    """Check if the agent modules can be imported."""
    print("\n📦 Checking agent imports...")
    print("-" * 40)
    
    # Add backend/src to Python path
    backend_dir = Path(__file__).parent
    src_dir = backend_dir / "src"
    sys.path.insert(0, str(src_dir))
    
    try:
        from src.agent.graph import graph
        print("✅ Agent graph imported successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to import agent graph: {e}")
        return False

def main():
    """Run all setup checks."""
    print("🚀 Deep Research Agent - Setup Verification")
    print("=" * 50)
    
    deps_ok = check_dependencies()
    env_ok = check_environment() if deps_ok else False
    imports_ok = check_imports() if deps_ok else False
    
    print("\n" + "=" * 50)
    
    if deps_ok and env_ok and imports_ok:
        print("🎉 Setup verification completed successfully!")
        print("✅ Ready to start the Deep Research Agent backend")
        print("\n💡 Start the server with: python run_server.py")
        return 0
    else:
        print("❌ Setup verification failed")
        print("🔧 Please fix the issues above before starting the server")
        return 1

if __name__ == "__main__":
    sys.exit(main())