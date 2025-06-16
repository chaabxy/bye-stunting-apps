import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, User, Calendar } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/model/user/edukasi-model";

interface ArticleContentProps {
  article: Article;
  readingTime: number;
  relatedArticles: Article[];
}

export function ArticleContent({
  article,
  readingTime,
  relatedArticles,
}: ArticleContentProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-secondary text-white">{article.category}</Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{article.author || "Admin"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{article.date || "2024-01-01"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{article.views || 0} views</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <Card className="mb-8">
        <CardContent className="p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            {article.content_sections.map((section, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {section.paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
