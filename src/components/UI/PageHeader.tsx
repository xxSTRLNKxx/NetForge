import { Plus, type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
  actions?: React.ReactNode;
  icon?: LucideIcon;
}

export function PageHeader({ title, subtitle, description, count, onAdd, addLabel = 'Add', actions, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-gray-700" />}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {count !== undefined && (
            <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
