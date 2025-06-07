import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, User } from "lucide-react";
import type { EducationWithDetails } from "@/model/user/edukasi-model";

interface ArticleCardProps {
  article: EducationWithDetails;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/edukasi/${article.id}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white border-0 shadow-lg">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-full overflow-hidden">
              <Image
                src={article.image || "/placeholder.svg?height=400&width=600"}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-secondary text-white">Featured</Badge>
              </div>
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="text-secondary border-secondary"
                >
                  {article.category}
                </Badge>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author || "Admin"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readingTime || 5} min</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/edukasi/${article.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white border-0 shadow-md">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg?height=300&width=400"}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant="outline"
              className="bg-white/90 text-secondary border-secondary"
            >
              {article.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 group-hover:text-secondary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readingTime || 5} min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
