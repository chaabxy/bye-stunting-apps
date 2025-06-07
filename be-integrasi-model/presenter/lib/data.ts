// Data fetching functions for articles

/**
 * Get article by ID
 */
export async function getArticleById(id: number) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/articles/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch article with ID ${id}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

/**
 * Get related articles based on category
 */
export async function getRelatedArticles(category: string, currentId: number) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/articles?category=${category}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related articles");
    }

    const articles = await response.json();
    // Filter out current article and limit to 3 related articles
    return articles
      .filter((article: any) => article.id !== currentId)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

/**
 * Get popular articles
 */
export async function getPopularArticles() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/articles/popular`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular articles");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching popular articles:", error);
    return [];
  }
}

/**
 * Get all articles with optional filtering
 */
export async function getArticles(params?: {
  category?: string;
  search?: string;
}) {
  try {
    let url = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/articles`;

    // Add query parameters if provided
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append("category", params.category);
      if (params.search) queryParams.append("search", params.search);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
