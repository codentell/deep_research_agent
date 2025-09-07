from typing import Annotated, TypedDict, List, Dict, Any, Optional, Union
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
import operator


def add_sources(existing: List[Dict[str, Any]], new: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Safely combine source lists from parallel operations"""
    if not existing:
        return new
    if not new:
        return existing
    return existing + new


def add_queries(existing: List[str], new: List[str]) -> List[str]:
    """Safely combine query lists from parallel operations"""
    if not existing:
        return new
    if not new:
        return existing
    return existing + new


def add_results(existing: List[str], new: List[str]) -> List[str]:
    """Safely combine result lists from parallel operations"""
    if not existing:
        return new
    if not new:
        return existing
    return existing + new


class QueryGenerationState(TypedDict):
    search_query: List[str]


class WebSearchState(TypedDict):
    search_query: str
    id: int


class ReflectionState(TypedDict):
    is_sufficient: bool
    knowledge_gap: str
    follow_up_queries: List[str]
    research_loop_count: int
    number_of_ran_queries: int


class OverallState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    search_query: Annotated[List[str], add_queries]
    sources_gathered: Annotated[List[Dict[str, Any]], add_sources]
    web_research_result: Annotated[List[str], add_results]
    research_loop_count: int
    initial_search_query_count: Optional[int]
    max_research_loops: Optional[int]
    reasoning_model: Optional[str]