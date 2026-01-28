import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import logging

logger = logging.getLogger(__name__)

class ArxivWrapper:
    """
    Fetches real scientific papers from the Arxiv API.
    """
    
    BASE_URL = "http://export.arxiv.org/api/query"
    
    def search_papers(self, query: str, max_results: int = 5):
        """
        Queries Arxiv and returns a list of papers.
        """
        try:
            # Construct API query
            # We search in title (ti) and abstract (abs)
            # Example: http://export.arxiv.org/api/query?search_query=all:electron&start=0&max_results=1
            
            # Clean query for URL
            safe_query = urllib.parse.quote(f"all:{query}")
            url = f"{self.BASE_URL}?search_query={safe_query}&start=0&max_results={max_results}&sortBy=relevance&sortOrder=descending"
            
            logger.info(f"Fetching Arxiv data from: {url}")
            
            with urllib.request.urlopen(url) as response:
                xml_data = response.read()
                
            # Parse XML
            root = ET.fromstring(xml_data)
            ns = {'atom': 'http://www.w3.org/2005/Atom'} # Arxiv uses Atom namespace
            
            papers = []
            for entry in root.findall('atom:entry', ns):
                title = entry.find('atom:title', ns).text.strip().replace('\n', ' ')
                summary = entry.find('atom:summary', ns).text.strip().replace('\n', ' ')
                published = entry.find('atom:published', ns).text[:4] # Year only
                
                # Get first author
                author = entry.find('atom:author', ns).find('atom:name', ns).text
                
                # Calculate a mock relevance score for UI flair
                relevance = f"{90 + (len(title) % 10)}%" 
                
                papers.append({
                    "title": title,
                    "author": f"{author} et al.",
                    "journal": f"ArXiv ({published})",
                    "relevance": relevance,
                    "summary": summary[:150] + "..." # Truncate for UI
                })
                
            return papers
            
        except Exception as e:
            logger.error(f"Arxiv fetch failed: {e}")
            # Fallback to empty list or placeholders if critical
            return []

# Global Instance
arxiv_client = ArxivWrapper()
