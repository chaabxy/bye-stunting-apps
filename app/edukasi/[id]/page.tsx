import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"

// Fungsi untuk mendapatkan artikel berdasarkan ID
async function getArticleById(id: number) {
  try {
    // Dalam implementasi nyata, ini akan memanggil API atau database
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/articles/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch article")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

// Fungsi untuk mendapatkan artikel terkait
async function getRelatedArticles(category: string, currentId: number) {
  try {
    // Dalam implementasi nyata, ini akan memanggil API atau database
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/articles?category=${category}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch related articles")
    }

    const articles = await response.json()
    // Filter artikel saat ini dan batasi hanya 3 artikel terkait
    return articles.filter((article: any) => article.id !== currentId).slice(0, 3)
  } catch (error) {
    console.error("Error fetching related articles:", error)
    return []
  }
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const articleId = Number.parseInt(params.id)

  if (isNaN(articleId)) {
    notFound()
  }

  const article = await getArticleById(articleId)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.category, articleId)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/edukasi">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Edukasi
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article>
            <div className="mb-6">
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                {article.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>5 menit membaca</span>
                </div>
              </div>
            </div>

            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.image || "/placeholder.svg?height=400&width=800"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-blue max-w-none dark:prose-invert">
              <p className="font-medium text-lg mb-4">{article.excerpt}</p>

              {/* Konten artikel - dalam implementasi nyata, ini akan berupa HTML atau Markdown yang dirender */}
              <div className="space-y-4">
                {article.content.split("\n\n").map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-b py-4 dark:border-gray-800">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Bagikan artikel ini:</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Artikel Terkait</h2>
            <div className="space-y-4">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((relatedArticle: any) => (
                  <Link href={`/edukasi/${relatedArticle.id}`} key={relatedArticle.id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40 w-full">
                        <Image
                          src={relatedArticle.image || "/placeholder.svg?height=160&width=320"}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2">
                          {relatedArticle.category}
                        </Badge>
                        <h3 className="font-semibold mb-1 line-clamp-2">{relatedArticle.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Tidak ada artikel terkait</p>
              )}
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-bold mb-3">Cek Risiko Stunting</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Masukkan data anak Anda untuk memeriksa risiko stunting dan dapatkan rekomendasi yang sesuai.
              </p>
              <Link href="/cek-stunting">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                  Cek Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
