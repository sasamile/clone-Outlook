import { EmailResponse } from "@/types";
import { Button } from "../ui/button";
import { Pin } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

function EmailItem({
  email,
  isSelected,
  onSelect,
  isPinned,
  onPin,
}: {
  email: EmailResponse;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPinned: boolean;
  onPin: () => void;
}) {
  return (
    <div className="relative flex items-center p-2 hover:bg-gray-800/30 rounded-lg group">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(email.id)}
        className="mr-2"
      />
      {/* ... resto del contenido del email ... */}
      <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={onPin}>
          <Pin className={`w-4 h-4 ${isPinned ? "text-blue-500" : ""}`} />
        </Button>
      </div>
    </div>
  );
}

export default EmailItem;
