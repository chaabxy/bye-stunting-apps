import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamMember } from "@/models/tentang-kami-model";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-100 -900 group">
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0  transition-opacity duration-300 z-10"></div>
        <Image
          src={member.image || "/placeholder.svg"}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6 text-center relative bg-white -950 mb-5">
        <h3 className="text-xl font-semibold mb-1 text-secondary -300">
          {member.name}
        </h3>
        <p className="text-primary -400 font-medium mb-1">{member.role}</p>
        <p className="text-muted-foreground -400 text-sm">
          {member.university}
        </p>
      </CardContent>
    </Card>
  );
}
