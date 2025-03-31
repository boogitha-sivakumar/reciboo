// app/place/[name]/page.tsx - Place-specific recipes page
import Link from "next/link";
import { searchRecipesByPlace } from "@/app/lib/api";

export default async function PlacePage({
  params,
}: {
  params: { name: string };
}) {
  const placeName = decodeURIComponent(params.name);
  const recipes = await searchRecipesByPlace(placeName);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="hover:underline mb-4 inline-block">
        &larr; Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-peach">
        {placeName} Recipes
      </h1>

      {recipes.length === 0 ? (
        <div className="text-center py-10">
          <p>
            No recipes found for {placeName}. Try searching for another place.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-peach text-white rounded-lg hover:opacity-90 transition"
          >
            Back to Search
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
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
                <h3 className="font-medium text-lg text-black">
                  {recipe.strMeal}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
