import { initialSearchState, searchReducer } from '@/reducers/search-reducer';
import { useReducer } from 'react';


export function useSearch() {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  const setQuery = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  };

  const fetchSearchResults = async (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'FETCH_START' });

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      dispatch({ type: 'FETCH_SUCCESS', payload: data.results });
    } catch (err: any) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Något gick fel' });
    }
  };

  return { state, setQuery, fetchSearchResults };
}
