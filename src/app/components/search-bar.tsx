import { useSearch } from "@/app/context/search-context";

export const SearchBar = () => {
  const { state, setQuery, fetchSearchResults } = useSearch();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSearchResults(state.query);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label className="input">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          placeholder="Search"
          value={state.query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
      </label>
    </form>
  );
};
