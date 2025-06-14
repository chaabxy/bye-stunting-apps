import Link from "next/link";
import { BookOpen } from "lucide-react";

interface EducationCardProps {
  id: string;
  title: string;
  slug?: string;
  viewCount: number;
}

export default function EducationCard({
  id,
  title,
  slug,
  viewCount,
}: EducationCardProps) {
  return (
    <Link href={`/edukasi/${slug || id}`}>
      <div className="bg-foreground ">
        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors bg-white mb-2">
          <div className="mt-1">
            <BookOpen className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-text line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{viewCount} views</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
