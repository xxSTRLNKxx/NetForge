interface StatusBadgeProps {
  status: string;
  label?: string;
  color?: string;
  size?: 'sm' | 'md';
}

const STATUS_MAP: Record<string, string> = {
  active: 'bg-green-100 text-green-800 ring-green-200',
  planned: 'bg-blue-100 text-blue-800 ring-blue-200',
  staged: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  staging: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  offline: 'bg-gray-100 text-gray-700 ring-gray-200',
  failed: 'bg-red-100 text-red-800 ring-red-200',
  decommissioning: 'bg-orange-100 text-orange-800 ring-orange-200',
  decommissioned: 'bg-gray-100 text-gray-600 ring-gray-200',
  provisioning: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  deprovisioning: 'bg-orange-100 text-orange-800 ring-orange-200',
  reserved: 'bg-purple-100 text-purple-800 ring-purple-200',
  deprecated: 'bg-gray-100 text-gray-600 ring-gray-200',
  connected: 'bg-green-100 text-green-800 ring-green-200',
  available: 'bg-green-100 text-green-800 ring-green-200',
  'in-use': 'bg-blue-100 text-blue-800 ring-blue-200',
  maintenance: 'bg-orange-100 text-orange-800 ring-orange-200',
  retired: 'bg-gray-100 text-gray-600 ring-gray-200',
  container: 'bg-slate-100 text-slate-700 ring-slate-200',
  dhcp: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
  slaac: 'bg-teal-100 text-teal-700 ring-teal-200',
  created: 'bg-green-100 text-green-800 ring-green-200',
  updated: 'bg-blue-100 text-blue-800 ring-blue-200',
  deleted: 'bg-red-100 text-red-800 ring-red-200',
  admin: 'bg-red-100 text-red-800 ring-red-200',
  user: 'bg-blue-100 text-blue-800 ring-blue-200',
  read_only: 'bg-gray-100 text-gray-700 ring-gray-200',
  inactive: 'bg-gray-100 text-gray-600 ring-gray-200',
};

const COLOR_MAP: Record<string, string> = {
  green: 'bg-green-100 text-green-800 ring-green-200',
  blue: 'bg-blue-100 text-blue-800 ring-blue-200',
  red: 'bg-red-100 text-red-800 ring-red-200',
  gray: 'bg-gray-100 text-gray-600 ring-gray-200',
  orange: 'bg-orange-100 text-orange-800 ring-orange-200',
  yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
};

export function StatusBadge({ status, label, color, size = 'md' }: StatusBadgeProps) {
  const classes = color
    ? (COLOR_MAP[color] ?? 'bg-gray-100 text-gray-600 ring-gray-200')
    : (STATUS_MAP[status] ?? 'bg-gray-100 text-gray-600 ring-gray-200');
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ring-1 ring-inset ${classes} ${sizeClasses}`}>
      {label || status}
    </span>
  );
}
