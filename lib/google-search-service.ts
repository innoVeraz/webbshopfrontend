export const fetchGoogleSearchResult = async (query: string) => {
  try {
    console.log(`Fetching search results for query: "${query}"`);
    const res = await fetch(
      `/api/search?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from search API');
    }
    
    return data.results;
  } catch (error) {
    console.error("Google search error:", error);
    throw error;
  }
};