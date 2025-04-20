import { initialSearchState, searchReducer } from '@/reducers/search-reducer';
import { useReducer } from 'react';
import { fetchGoogleSearchResult } from '../../lib/google-search-service';

export function useSearch() {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);
  
  const setQuery = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  };
  
  const fetchSearchResults = async (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'FETCH_START' });
    
    try {
      const results = await fetchGoogleSearchResult(query);
      console.log('Search results received in hook:', results);
      
      // Make sure results is an array before dispatching
      if (Array.isArray(results)) {
        dispatch({ type: 'FETCH_SUCCESS', payload: results });
        console.log('State after dispatch:', state); // Note: This won't show updated state due to closure
      } else {
        console.error('Results is not an array:', results);
        dispatch({ type: 'FETCH_ERROR', payload: 'Invalid response format' });
      }
    } catch (err: unknown) {
      console.error('Search hook error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Något gick fel';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  };
  
  return { state, setQuery, fetchSearchResults };
}
