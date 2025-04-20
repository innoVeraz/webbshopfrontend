'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SearchState, initialSearchState, searchReducer } from '@/reducers/search-reducer';
import { fetchGoogleSearchResult } from '../../../lib/google-search-service';

type SearchContextType = {
  state: SearchState;
  setQuery: (query: string) => void;
  fetchSearchResults: (query: string) => Promise<void>;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  const setQuery = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  };

  const fetchSearchResults = async (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'FETCH_START' });

    try {
      const results = await fetchGoogleSearchResult(query);
      console.log('Search results received in context:', results);

      if (Array.isArray(results)) {
        dispatch({ type: 'FETCH_SUCCESS', payload: results });
      } else {
        console.error('Results is not an array:', results);
        dispatch({ type: 'FETCH_ERROR', payload: 'Invalid response format' });
      }
    } catch (err: any) {
      console.error('Search context error:', err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Något gick fel' });
    }
  };

  return (
    <SearchContext.Provider value={{ state, setQuery, fetchSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};