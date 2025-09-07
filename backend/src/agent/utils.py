import re
from typing import List, Dict, Any
from urllib.parse import urlparse
import hashlib


def get_research_topic(messages: List[Any]) -> str:
    """Extract research topic from messages"""
    if not messages:
        return ""
    
    # Get the last human message
    for message in reversed(messages):
        if hasattr(message, 'content') and message.content:
            return message.content
    return ""


def get_citations(response, resolved_urls: Dict[str, str]) -> List[Dict[str, Any]]:
    """Extract citations from Gemini response with grounding metadata"""
    citations = []
    
    # Check if response has grounding metadata
    if hasattr(response, 'candidates') and response.candidates:
        candidate = response.candidates[0]
        if hasattr(candidate, 'grounding_metadata') and candidate.grounding_metadata:
            grounding_chunks = candidate.grounding_metadata.grounding_chunks
            
            for chunk in grounding_chunks:
                if hasattr(chunk, 'web') and chunk.web:
                    url = chunk.web.uri
                    title = getattr(chunk.web, 'title', url)
                    
                    # Create short URL for citation
                    short_url = resolved_urls.get(url, create_short_url(url))
                    
                    citations.append({
                        "segments": [{
                            "value": url,
                            "short_url": short_url,
                            "title": title
                        }],
                        "start_index": getattr(chunk, 'start_index', 0),
                        "end_index": getattr(chunk, 'end_index', 0)
                    })
    
    return citations


def create_short_url(url: str) -> str:
    """Create a short URL identifier for citations"""
    parsed = urlparse(url)
    domain = parsed.netloc.replace('www.', '')
    
    # Create a short hash
    url_hash = hashlib.md5(url.encode()).hexdigest()[:6]
    
    return f"[{domain}-{url_hash}]"


def resolve_urls(grounding_chunks, query_id: int) -> Dict[str, str]:
    """Resolve URLs to short identifiers for token efficiency"""
    resolved = {}
    
    for i, chunk in enumerate(grounding_chunks):
        if hasattr(chunk, 'web') and chunk.web:
            url = chunk.web.uri
            short_id = f"[{query_id}-{i}]"
            resolved[url] = short_id
    
    return resolved


def insert_citation_markers(text: str, citations: List[Dict[str, Any]]) -> str:
    """Insert citation markers into text"""
    if not citations:
        return text
    
    # Sort citations by start index in reverse order to maintain positions
    sorted_citations = sorted(citations, key=lambda x: x.get('start_index', 0), reverse=True)
    
    modified_text = text
    for citation in sorted_citations:
        if citation.get('segments'):
            segment = citation['segments'][0]
            short_url = segment.get('short_url', '')
            start_idx = citation.get('start_index', 0)
            
            # Insert citation marker
            if short_url and start_idx < len(modified_text):
                modified_text = (
                    modified_text[:start_idx] + 
                    f" {short_url}" + 
                    modified_text[start_idx:]
                )
    
    return modified_text