import { useState } from 'react';
import {
  LayoutDashboard,
  Server,
  Network,
  Globe,
  MonitorPlay,
  Layers,
  Building2,
  Package,
  ChevronDown,
  ChevronRight,
  LogOut,
  Activity,
  PanelLeftClose,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onHide?: () => void;
}

interface NavItem {
  id: string;
  label: string;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'dcim',
    label: 'DCIM',
    icon: Server,
    color: 'text-blue-400',
    items: [
      { id: 'dcim-sites', label: 'Sites' },
      { id: 'dcim-regions', label: 'Regions' },
      { id: 'dcim-racks', label: 'Racks' },
      { id: 'dcim-manufacturers', label: 'Manufacturers' },
      { id: 'dcim-device-types', label: 'Device Types' },
      { id: 'dcim-device-roles', label: 'Device Roles' },
      { id: 'dcim-platforms', label: 'Platforms' },
      { id: 'dcim-devices', label: 'Devices' },
      { id: 'dcim-interfaces', label: 'Interfaces' },
      { id: 'dcim-cables', label: 'Cables' },
    ],
  },
  {
    id: 'ipam',
    label: 'IPAM',
    icon: Network,
    color: 'text-green-400',
    items: [
      { id: 'ipam-vrfs', label: 'VRFs' },
      { id: 'ipam-prefixes', label: 'Prefixes' },
      { id: 'ipam-ip-addresses', label: 'IP Addresses' },
      { id: 'ipam-vlans', label: 'VLANs' },
      { id: 'ipam-vlan-groups', label: 'VLAN Groups' },
    ],
  },
  {
    id: 'virtualization',
    label: 'Virtualization',
    icon: MonitorPlay,
    color: 'text-sky-400',
    items: [
      { id: 'virt-clusters', label: 'Clusters' },
      { id: 'virt-cluster-types', label: 'Cluster Types' },
      { id: 'virt-virtual-machines', label: 'Virtual Machines' },
    ],
  },
  {
    id: 'circuits',
    label: 'Circuits',
    icon: Layers,
    color: 'text-yellow-400',
    items: [
      { id: 'circuits-providers', label: 'Providers' },
      { id: 'circuits-types', label: 'Circuit Types' },
      { id: 'circuits-list', label: 'Circuits' },
    ],
  },
  {
    id: 'tenancy',
    label: 'Tenancy',
    icon: Building2,
    color: 'text-orange-400',
    items: [
      { id: 'tenants', label: 'Tenants' },
      { id: 'tenant-groups', label: 'Tenant Groups' },
      { id: 'contacts', label: 'Contacts' },
      { id: 'contact-groups', label: 'Contact Groups' },
      { id: 'contact-roles', label: 'Contact Roles' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    color: 'text-pink-400',
    items: [
      { id: 'assets', label: 'Assets' },
      { id: 'locations', label: 'Locations' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: Globe,
    color: 'text-cyan-400',
    items: [
      { id: 'diagrams', label: 'Diagrams' },
      { id: 'designer', label: 'Designer' },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: Shield,
    color: 'text-red-400',
    items: [
      { id: 'users', label: 'Users' },
      { id: 'activity-log', label: 'Activity Log' },
    ],
  },
];

function sectionOwns(section: NavSection, view: string) {
  return section.items.some((i) => i.id === view);
}

export function Sidebar({ currentView, onViewChange, onHide }: SidebarProps) {
  const { signOut, user, profile } = useAuth();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NAV_SECTIONS.forEach((s) => { init[s.id] = sectionOwns(s, currentView); });
    return init;
  });

  const toggle = (sectionId: string) =>
    setExpanded((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));

  return (
    <div className="w-60 bg-gray-950 text-white h-screen flex flex-col shrink-0 overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight flex-1">NetForge</span>
          {onHide && (
            <button onClick={onHide} className="p-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors" title="Hide sidebar">
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate pl-0.5">{profile?.full_name || user?.email || ''}</p>
      </div>

      <div className="px-2 pt-2 shrink-0">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentView === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="font-medium">Dashboard</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = !!expanded[section.id];
          const hasActive = sectionOwns(section, currentView);

          return (
            <div key={section.id}>
              <button
                onClick={() => toggle(section.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  hasActive ? 'bg-gray-800/80' : 'hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${section.color}`} />
                  <span className="text-gray-200 font-medium text-xs uppercase tracking-wider">
                    {section.label}
                  </span>
                </div>
                {isOpen
                  ? <ChevronDown className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                  : <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                }
              </button>

              {isOpen && (
                <div className="ml-3 pl-3 border-l border-gray-800 mb-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                        currentView === item.id
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/70'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-2 py-2 border-t border-gray-800 shrink-0 space-y-1">
        {profile?.role === 'admin' && (
          <>
            <button
              onClick={() => onViewChange('users')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                currentView === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              Users
            </button>
            <button
              onClick={() => onViewChange('activity-log')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                currentView === 'activity-log'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              Activity Log
            </button>
          </>
        )}
        <button
          onClick={() => onViewChange('profile')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
            currentView === 'profile'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <User className="w-4 h-4" />
          My Profile
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
