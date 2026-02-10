import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
}

const EmptyState = ({ icon: Icon, message }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <Icon className="w-12 h-12 mb-3 opacity-40" />
      <p className="text-center text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
