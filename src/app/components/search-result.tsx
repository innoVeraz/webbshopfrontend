// src/app/components/SearchResults.tsx
import Link from "next/link";

type SearchResultItem = {
  title: string;
  link: string;
  snippet: string;
  image?: string;
};

type Props = {
  results: SearchResultItem[];
};

export const SearchResults = ({ results }: Props) => {
  if (!results.length) return null;

  return (
    <div className="mt-6 space-y-4">
      {results.map((item, i) => (
        <div key={i} className="p-4 border rounded shadow-sm bg-white">
          <h3 className="text-lg font-semibold">
            <Link href={item.link} target="_blank" className="text-blue-600 hover:underline">
              {item.title}
            </Link>
          </h3>
          <p className="text-sm text-gray-700">{item.snippet}</p>
        </div>
      ))}
    </div>
  );
};
