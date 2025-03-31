// lib/api.ts
// API functions to interact with TheMealDB API
/*eslint - disable*/

// Define a type for TheMealDB recipe
export interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string;
  strYoutube?: string;
  [key: string]: any; // For other properties that might be present
}

// Define a type for TheMealDB API response
interface MealDBResponse {
  meals: MealDBRecipe[] | null;
}

// API base URL
const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

/**
 * Fetches all Indian recipes
 */
export async function getIndianRecipes(): Promise<MealDBRecipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?a=Indian`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Indian recipes: ${response.status}`);
    }

    const data: MealDBResponse = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching Indian recipes:", error);
    return [];
  }
}

/**
 * Fetches recipes by region/area from TheMealDB API
 */
export async function searchRecipesByRegion(region: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/filter.php?a=${encodeURIComponent(region)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes for region: ${region}`);
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching recipes by region:", error);
    return [];
  }
}

/**
 * Searches for recipes by place name (city, state, or location in India)
 * This function searches through recipe details to find matches
 */
export async function searchRecipesByPlace(
  place: string
): Promise<MealDBRecipe[]> {
  try {
    // First fetch all Indian recipes
    const response = await fetch(`${API_BASE_URL}/filter.php?a=Indian`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Indian recipes: ${response.status}`);
    }

    const data: MealDBResponse = await response.json();
    const allRecipes = data.meals || [];

    if (allRecipes.length === 0) {
      return [];
    }

    // Create case-insensitive regex for searching
    const placeRegex = new RegExp(place, "i");

    // Get detailed information for each recipe to search
    const detailedRecipes = await Promise.all(
      allRecipes.map(async (recipe) => {
        const detailResponse = await fetch(
          `${API_BASE_URL}/lookup.php?i=${recipe.idMeal}`
        );

        if (!detailResponse.ok) {
          return null;
        }

        const detailData: MealDBResponse = await detailResponse.json();
        return detailData.meals?.[0] || null;
      })
    );

    // Filter recipes that mention the place
    return detailedRecipes.filter((recipe): recipe is MealDBRecipe => {
      if (!recipe) return false;

      // Fields to check for place name
      const fieldsToCheck = [
        recipe.strMeal || "",
        recipe.strInstructions || "",
        recipe.strTags || "",
        recipe.strArea || "",
      ];

      // Check ingredients and measures
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`] || "";
        const measure = recipe[`strMeasure${i}`] || "";
        if (ingredient.trim()) {
          fieldsToCheck.push(ingredient, measure);
        }
      }

      // Return true if the place name is found in any field
      return fieldsToCheck.some((field) => placeRegex.test(field));
    });
  } catch (error) {
    console.error(`Error searching recipes for place ${place}:`, error);
    return [];
  }
}

/**
 * Searches for Indian recipes with optional query
 */
export async function searchIndianRecipes(
  query: string = "",
  offset: number = 0,
  limit: number = 12
): Promise<MealDBRecipe[]> {
  try {
    // First fetch all Indian recipes
    const response = await fetch(`${API_BASE_URL}/filter.php?a=Indian`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Indian recipes: ${response.status}`);
    }

    const data: MealDBResponse = await response.json();
    const allRecipes = data.meals || [];

    // Filter by query if provided
    let filteredRecipes = allRecipes;
    if (query) {
      filteredRecipes = allRecipes.filter((recipe) =>
        recipe.strMeal.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply pagination
    return filteredRecipes.slice(offset, offset + limit);
  } catch (error) {
    console.error("Error searching Indian recipes:", error);
    return [];
  }
}

/**
 * General search function for recipes by name
 */
export async function searchRecipesByName(
  query: string
): Promise<MealDBRecipe[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to search recipes: ${response.status}`);
    }

    const data: MealDBResponse = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error searching recipes by name:", error);
    return [];
  }
}

/**
 * Fetches a recipe by its ID
 */
export async function getRecipeById(id: string): Promise<MealDBRecipe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe: ${response.status}`);
    }

    const data: MealDBResponse = await response.json();
    return data.meals && data.meals.length > 0 ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return null;
  }
}

/**
 * Fetches all meal categories
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories.php`);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    return data.categories?.map((category: any) => category.strCategory) || [];
  } catch (error) {
    console.error("Error fetching meal categories:", error);
    return [];
  }
}

/**
 * Fetches all meal areas/regions
 */
export async function getAllAreas(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?a=list`);

    if (!response.ok) {
      throw new Error(`Failed to fetch areas: ${response.status}`);
    }

    const data = await response.json();
    return data.meals?.map((area: any) => area.strArea) || [];
  } catch (error) {
    console.error("Error fetching meal areas:", error);
    return [];
  }
}

/**
 * Fetches recipes by category
 */
export async function getRecipesByCategory(
  category: string
): Promise<MealDBRecipe[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch recipes by category: ${response.status}`
      );
    }

    const data: MealDBResponse = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching recipes by category:", error);
    return [];
  }
}

/**
 * Fetches a random recipe
 */
export async function getRandomRecipe(): Promise<MealDBRecipe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/random.php`);

    if (!response.ok) {
      throw new Error(`Failed to fetch random recipe: ${response.status}`);
    }

    const data: MealDBResponse = await response.json();
    return data.meals && data.meals.length > 0 ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching random recipe:", error);
    return null;
  }
}

/**
 * Extracts ingredients and measurements from a recipe
 */
export function extractIngredientsFromRecipe(
  recipe: MealDBRecipe
): { ingredient: string; measure: string }[] {
  const ingredients: { ingredient: string; measure: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient,
        measure: measure?.trim() || "",
      });
    }
  }

  return ingredients;
}

/**
 * Filters recipes by multiple criteria
 */
export async function filterRecipes({
  query = "",
  category = "",
  area = "",
  place = "",
  limit = 20,
  offset = 0,
}: {
  query?: string;
  category?: string;
  area?: string;
  place?: string;
  limit?: number;
  offset?: number;
}): Promise<MealDBRecipe[]> {
  try {
    let recipes: MealDBRecipe[] = [];

    // Check if we're searching by place first
    if (place) {
      recipes = await searchRecipesByPlace(place);

      // Apply other filters if needed
      if (category) {
        const categoryRecipes = await getRecipesByCategory(category);
        const categoryIds = new Set(categoryRecipes.map((r) => r.idMeal));
        recipes = recipes.filter((r) => categoryIds.has(r.idMeal));
      }

      // Apply text search if query is provided
      if (query) {
        recipes = recipes.filter((recipe) =>
          recipe.strMeal.toLowerCase().includes(query.toLowerCase())
        );
      }
    }
    // If not searching by place, use the original filter logic
    else if (area && category) {
      // Need to fetch by area and then filter by category (or vice versa)
      const areaRecipes = await searchRecipesByRegion(area);
      const categoryRecipes = await getRecipesByCategory(category);

      // Find intersection by meal ID
      const categoryIds = new Set(categoryRecipes.map((r) => r.idMeal));
      recipes = areaRecipes.filter((r: MealDBRecipe) =>
        categoryIds.has(r.idMeal)
      );
    } else if (area) {
      recipes = await searchRecipesByRegion(area);
    } else if (category) {
      recipes = await getRecipesByCategory(category);
    } else if (query) {
      recipes = await searchRecipesByName(query);
    } else {
      // Fetch a default set of recipes if no criteria provided
      const randomArea = "Indian"; // Default to Indian cuisine
      recipes = await searchRecipesByRegion(randomArea);
    }

    // Apply text search if query is provided and we haven't already searched by name or filtered by query
    if (query && (area || category) && !place) {
      recipes = recipes.filter((recipe) =>
        recipe.strMeal.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply pagination
    return recipes.slice(offset, offset + limit);
  } catch (error) {
    console.error("Error filtering recipes:", error);
    return [];
  }
}
