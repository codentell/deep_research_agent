from dataclasses import dataclass
from typing import Optional, Any, Dict
from langchain_core.runnables import RunnableConfig


@dataclass
class Configuration:
    """Configuration for the research agent"""
    
    query_generator_model: str = "gemini-2.0-flash-exp"
    reflection_model: str = "gemini-2.0-flash-thinking-exp"
    answer_model: str = "gemini-2.0-flash-exp"
    number_of_initial_queries: int = 3
    max_research_loops: int = 2
    
    @classmethod
    def from_runnable_config(cls, config: Optional[RunnableConfig] = None) -> "Configuration":
        """Create configuration from runnable config"""
        if config is None:
            return cls()
            
        configurable = config.get("configurable", {})
        return cls(
            query_generator_model=configurable.get("query_generator_model", cls.query_generator_model),
            reflection_model=configurable.get("reflection_model", cls.reflection_model),
            answer_model=configurable.get("answer_model", cls.answer_model),
            number_of_initial_queries=configurable.get("number_of_initial_queries", cls.number_of_initial_queries),
            max_research_loops=configurable.get("max_research_loops", cls.max_research_loops),
        )