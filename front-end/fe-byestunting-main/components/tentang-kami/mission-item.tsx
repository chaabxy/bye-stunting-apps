import {
  CheckCircle,
  ArchiveRestore,
  NotepadText,
  Users,
  Contact,
} from "lucide-react";

interface MissionItemProps {
  icon: string;
  text: string;
}

const iconMap = {
  CheckCircle,
  ArchiveRestore,
  NotepadText,
  Users,
  Contact,
};

export function MissionItem({ icon, text }: MissionItemProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || CheckCircle;

  return (
    <li className="flex items-start space-x-3 bg-input -950/30 p-4 rounded-lg">
      <IconComponent className="mt-1 h-5 w-5 text-secondary -400 flex-shrink-0" />
      <span className="text-gray-700 -300">{text}</span>
    </li>
  );
}
