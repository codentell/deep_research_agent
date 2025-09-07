from typing import List
from pydantic import BaseModel, Field


class SearchQueryList(BaseModel):
    query: List[str] = Field(
        description="List of search queries to execute for comprehensive research"
    )


class Reflection(BaseModel):
    is_sufficient: bool = Field(
        description="Whether the current research findings are sufficient to answer the original question"
    )
    knowledge_gap: str = Field(
        description="Description of any knowledge gaps or missing information"
    )
    follow_up_queries: List[str] = Field(
        description="List of follow-up search queries to address knowledge gaps",
        default_factory=list
    )