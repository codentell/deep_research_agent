import asyncio
import httpx
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
import os
from models.state import Source
import logging

logger = logging.getLogger(__name__)


class WebSearchTool:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_SEARCH_API_KEY")
        self.google_cse_id = os.getenv("GOOGLE_CSE_ID")
        self.max_sources = int(os.getenv("MAX_SOURCES_PER_QUERY", "5"))
        
    async def search(self, query: str, num_results: int = None) -> List[Source]:
        if not self.google_api_key or not self.google_cse_id:
            logger.warning("Google Search API credentials not configured")
            return []
            
        num_results = num_results or self.max_sources
        
        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "key": self.google_api_key,
                    "cx": self.google_cse_id,
                    "q": query,
                    "num": num_results,
                }
                
                response = await client.get(
                    "https://www.googleapis.com/customsearch/v1",
                    params=params,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                sources = []
                for item in data.get("items", []):
                    try:
                        content = await self._fetch_content(item["link"])
                        source = Source(
                            url=item["link"],
                            title=item["title"],
                            content=content,
                            snippet=item.get("snippet", ""),
                            timestamp=item.get("cacheId", "")
                        )
                        sources.append(source)
                    except Exception as e:
                        logger.warning(f"Failed to fetch content for {item['link']}: {e}")
                        continue
                        
                return sources
                
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []
    
    async def _fetch_content(self, url: str, max_chars: int = 5000) -> str:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url, 
                    timeout=10.0,
                    headers={"User-Agent": "DeepResearchAgent/1.0"}
                )
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                for script in soup(["script", "style", "nav", "header", "footer"]):
                    script.decompose()
                
                text = soup.get_text()
                lines = (line.strip() for line in text.splitlines())
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                text = ' '.join(chunk for chunk in chunks if chunk)
                
                return text[:max_chars] if len(text) > max_chars else text
                
        except Exception as e:
            logger.warning(f"Failed to fetch content from {url}: {e}")
            return ""