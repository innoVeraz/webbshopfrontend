export type SearchResult = {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
};

export type SearchState = {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
};

export type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: SearchResult[] }
  | { type: "FETCH_ERROR"; payload: string };

export const initialSearchState: SearchState = {
  query: "",
  results: [],
  loading: false,
  error: null,
};

export function searchReducer(
  state: SearchState,
  action: SearchAction
): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, results: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
