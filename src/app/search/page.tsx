// app/search/page.tsx
import Link from "next/link";
import { searchIndianRecipes } from "@/app/lib/api";
import SearchBar from "@/app/components/SearchBar";

// Define a type for TheMealDB recipe
interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  [key: string]: any; // For other properties that might be present
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; page?: string };
}) {
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const offset = (page - 1) * limit;

  const recipes = await searchIndianRecipes(query, offset, limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to home
      </Link>

      <div className="mb-8">
        <SearchBar />
      </div>

      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>

      {recipes.length === 0 ? (
        <div className="text-center py-10">
          <p>No recipes found for "{query}". Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe: MealDBRecipe) => (
            <Link
              key={recipe.idMeal}
              href={`/recipe/${recipe.idMeal}`}
              className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-lg">{recipe.strMeal}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {page > 1 && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
            className="px-4 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300"
          >
            Previous
          </Link>
        )}

        {recipes.length === limit && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
            className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
