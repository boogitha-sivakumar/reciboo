// app/page.tsx - Homepage with place search
import Link from "next/link";
import { getIndianRecipes } from "@/app/lib/api";
import SearchForm from "@/app/components/SearchForm";

export default async function Home() {
  const recipes = await getIndianRecipes();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-peach">
        Reciboo - Indian Cuisine Recipes
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-peach">
          Find Recipes by Place
        </h2>
        <SearchForm />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-peach">
          Popular Recipes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.slice(0, 8).map((recipe) => (
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
      </div>
    </main>
  );
}
