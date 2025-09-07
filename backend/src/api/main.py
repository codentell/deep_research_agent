from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from pathlib import Path
from langchain_core.messages import HumanMessage

from src.agent.graph import graph

app = FastAPI(title="Deep Research Agent", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    query: str
    max_research_loops: Optional[int] = 2
    initial_search_query_count: Optional[int] = 3


class ResearchResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    iterations: int
    status: str = "completed"


@app.get("/")
async def root():
    return {"message": "Deep Research Agent API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/research", response_model=ResearchResponse)
async def conduct_research(request: ResearchRequest):
    """
    Conduct comprehensive research on a given query using the LangGraph agent
    """
    try:
        # Prepare the initial state
        initial_state = {
            "messages": [HumanMessage(content=request.query)],
            "search_query": [],
            "sources_gathered": [],
            "web_research_result": [],
            "research_loop_count": 0,
            "initial_search_query_count": request.initial_search_query_count,
            "max_research_loops": request.max_research_loops,
        }
        
        # Configure the research parameters
        config = {
            "configurable": {
                "max_research_loops": request.max_research_loops,
                "number_of_initial_queries": request.initial_search_query_count,
            }
        }
        
        # Run the research agent
        final_state = await graph.ainvoke(initial_state, config)
        
        # Extract the final answer from messages
        answer = ""
        if final_state.get("messages"):
            last_message = final_state["messages"][-1]
            if hasattr(last_message, 'content'):
                answer = last_message.content
        
        # Format sources
        sources = final_state.get("sources_gathered", [])
        iterations = final_state.get("research_loop_count", 0)
        
        return ResearchResponse(
            answer=answer,
            sources=sources,
            iterations=iterations,
            status="completed"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")


@app.get("/config")
async def get_config():
    """Get current agent configuration"""
    return {
        "models": {
            "query_generator": "gemini-2.0-flash-exp",
            "reflection": "gemini-2.0-flash-thinking-exp", 
            "answer": "gemini-2.0-flash-exp"
        },
        "limits": {
            "max_research_loops": 2,
            "initial_queries": 3
        }
    }


@app.post("/test")
async def test_agent():
    """Test basic agent functionality with a simple query"""
    try:
        # Simple test query
        test_request = ResearchRequest(
            query="What is artificial intelligence?",
            max_research_loops=1,
            initial_search_query_count=2
        )
        
        # Use the same logic as the main research endpoint
        initial_state = {
            "messages": [HumanMessage(content=test_request.query)],
            "search_query": [],
            "sources_gathered": [],
            "web_research_result": [],
            "research_loop_count": 0,
            "initial_search_query_count": test_request.initial_search_query_count,
            "max_research_loops": test_request.max_research_loops,
        }
        
        config = {
            "configurable": {
                "max_research_loops": test_request.max_research_loops,
                "number_of_initial_queries": test_request.initial_search_query_count,
            }
        }
        
        # Run just the query generation step
        from src.agent.graph import generate_query
        result = generate_query(initial_state, config)
        
        return {
            "status": "success",
            "message": "Agent basic functionality working",
            "generated_queries": result.get("search_query", []),
            "test_query": test_request.query
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Agent test failed: {str(e)}",
            "error_type": type(e).__name__
        }


# Serve static files (frontend build) in production
frontend_dist = Path(__file__).parent.parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/app", StaticFiles(directory=str(frontend_dist), html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)