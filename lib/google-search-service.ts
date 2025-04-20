export const fetchGoogleSearchResult = async (query: string) => {
  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_CX}&q=${query}`
  );
  const data = await res.json();
  console.log(data);
};