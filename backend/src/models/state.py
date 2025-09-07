from typing import List, Dict, Any, Optional, Annotated
from pydantic import BaseModel, Field
from langgraph.graph import add_messages


class Source(BaseModel):
    url: str
    title: str
    content: str
    snippet: str
    timestamp: str


class SearchQuery(BaseModel):
    query: str
    reasoning: str


class ResearchState(BaseModel):
    original_query: str
    messages: Annotated[List[Dict[str, Any]], add_messages] = Field(default_factory=list)
    search_queries: List[SearchQuery] = Field(default_factory=list)
    sources: List[Source] = Field(default_factory=list)
    knowledge_gaps: List[str] = Field(default_factory=list)
    iteration_count: int = 0
    max_iterations: int = 3
    final_answer: Optional[str] = None
    research_complete: bool = False
    error: Optional[str] = None


class ResearchRequest(BaseModel):
    query: str
    max_iterations: Optional[int] = 3
    max_sources_per_query: Optional[int] = 5


class ResearchResponse(BaseModel):
    answer: str
    sources: List[Source]
    iterations: int
    status: str