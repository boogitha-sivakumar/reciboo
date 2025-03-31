// app/recipe/[id]/page.tsx - Recipe Detail Page
import Link from "next/link";
import { getRecipeById } from "@/app/lib/api";

function getTextColor(backgroundColor: string): string {
  // Utility to determine text color based on background brightness
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "text-black" : "text-white";
}

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    return <div className="text-center py-10 text-black">Recipe not found</div>;
  }

  // Extract ingredients from the API response
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({ ingredient, measure });
    }
  }

  // Example background color for the recipe card
  const backgroundColor = "#1E293B"; // Dark background
  const textColor = getTextColor(backgroundColor);

  return (
    <div
      className={`container mx-auto px-4 py-8 ${textColor}`}
      style={{ backgroundColor }}
    >
      <Link
        href="/"
        className="text-peach-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to recipes
      </Link>

      <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-72 object-cover"
        />

        <div className="p-6 text-black">
          <h1 className="text-3xl font-bold mb-2">{recipe.strMeal}</h1>
          <p className="text-black-600 mb-6">Category: {recipe.strCategory}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {ingredients.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>
                      {item.measure} {item.ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <div className="space-y-4">
                {(recipe.strInstructions ?? "")
                  .split("\r\n")
                  .filter(Boolean)
                  .map((step: string, index: number) => (
                    <p key={index}>{step}</p>
                  ))}
              </div>
            </div>
          </div>

          {recipe.strYoutube && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Video Tutorial</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="560"
                  height="315"
                  src={recipe.strYoutube.replace("watch?v=", "embed/")}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
