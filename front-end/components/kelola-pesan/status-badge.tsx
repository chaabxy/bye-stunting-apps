// View component for status badges
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, CheckCircle } from "lucide-react";
import type { UserMessage } from "@/model/admin/user-message-model";

interface StatusBadgeProps {
  status: UserMessage["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    "Belum Dibaca": "bg-blue-100 text-blue-800 -900 -300",
    Dibaca: "bg-yellow-100 text-yellow-800 -900 -300",
    Dibalas: "bg-green-100 text-green-800 -900 -300",
  };

  const icons = {
    "Belum Dibaca": <Clock className="w-3 h-3 mr-1" />,
    Dibaca: <Eye className="w-3 h-3 mr-1" />,
    Dibalas: <CheckCircle className="w-3 h-3 mr-1" />,
  };

  return (
    <Badge className={`${variants[status]} flex items-center`}>
      {icons[status]}
      {status}
    </Badge>
  );
}
