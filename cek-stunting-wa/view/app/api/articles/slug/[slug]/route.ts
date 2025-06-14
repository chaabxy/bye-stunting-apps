import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Forward request ke backend API untuk artikel berdasarkan slug
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    // Coba endpoint educations terlebih dahulu
    let response = await fetch(`${backendUrl}/api/educations/slug/${slug}`, {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 1 minute untuk performance
      next: { revalidate: 60 },
    });

    // Jika gagal, coba endpoint articles sebagai fallback
    if (!response.ok && response.status !== 404) {
      console.log(
        `Educations endpoint failed, trying articles endpoint for slug: ${slug}`
      );
      response = await fetch(`${backendUrl}/api/articles/slug/${slug}`, {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      });
    }

    // Jika masih gagal dan slug terlihat seperti ID, coba sebagai ID
    if (!response.ok && !isNaN(Number(slug))) {
      console.log(`Trying as ID for: ${slug}`);
      response = await fetch(`${backendUrl}/api/educations/${slug}`, {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      });
    }

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const result = await response.json();

    // Transform data untuk konsistensi dengan format yang diharapkan frontend
    if (result.data) {
      const transformedData = {
        id: result.data.id.toString(),
        slug: result.data.slug,
        title: result.data.title,
        excerpt: result.data.excerpt,
        category: result.data.category,
        tags: result.data.tags || [],
        source: result.data.source,
        author: result.data.author,
        content_sections:
          result.data.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.section_order || index + 1,
            illustration: section.illustration,
          })) || [],
        conclusion: result.data.conclusion?.[0] || {
          heading: "Kesimpulan",
          paragraph: "",
        },
        important_points:
          result.data.important_points?.map((point: any) => ({
            id: point.id?.toString() || Math.random().toString(),
            content: point.content,
            point_order: point.point_order || 1,
          })) || [],
        view_count: result.data.view_count || 0,
        like_count: result.data.like_count || 0,
        header_image:
          result.data.header_image || "/placeholder.svg?height=400&width=600",
        publish_date: result.data.publish_date || result.data.created_at,
        created_at: result.data.created_at,
        reading_time: result.data.reading_time || 5,
      };

      return NextResponse.json({ data: transformedData });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch article", details: error.message },
      { status: 500 }
    );
  }
}
