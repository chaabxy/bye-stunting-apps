import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface EducationCardProps {
  title: string;
  id: string;
}

export default function EducationCard({ title, id }: EducationCardProps) {
  return (
    <Link href={`/edukasi/${id}`}>
      <Card className="hover:shadow-md transition mb-2 bg-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center ">
            <h3 className="text-sm font-medium text-gray-800">{title}</h3>
            <ArrowRight size={16} className="text-[#317BC4]" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
