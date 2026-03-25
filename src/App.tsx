import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import SetupPage from './pages/SetupPage';
import { Dashboard } from './pages/Dashboard';
import { Sidebar } from './components/Layout/Sidebar';
import { AssetsPage } from './pages/AssetsPage';
import { LocationsPage } from './pages/LocationsPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { SitesPage } from './pages/dcim/SitesPage';
import { RegionsPage } from './pages/dcim/RegionsPage';
import { RacksPage } from './pages/dcim/RacksPage';
import { ManufacturersPage } from './pages/dcim/ManufacturersPage';
import { DeviceTypesPage } from './pages/dcim/DeviceTypesPage';
import { DeviceRolesPage } from './pages/dcim/DeviceRolesPage';
import { PlatformsPage } from './pages/dcim/PlatformsPage';
import { DevicesPage } from './pages/dcim/DevicesPage';
import { InterfacesPage } from './pages/dcim/InterfacesPage';
import { CablesPage } from './pages/dcim/CablesPage';
import { VRFsPage } from './pages/ipam/VRFsPage';
import { PrefixesPage } from './pages/ipam/PrefixesPage';
import { IPAddressesPage } from './pages/ipam/IPAddressesPage';
import { VLANsPage } from './pages/ipam/VLANsPage';
import { VLANGroupsPage } from './pages/ipam/VLANGroupsPage';
import { ClustersPage } from './pages/virtualization/ClustersPage';
import { ClusterTypesPage } from './pages/virtualization/ClusterTypesPage';
import { VirtualMachinesPage } from './pages/virtualization/VirtualMachinesPage';
import { ProvidersPage } from './pages/circuits/ProvidersPage';
import { CircuitTypesPage } from './pages/circuits/CircuitTypesPage';
import { CircuitsPage } from './pages/circuits/CircuitsPage';
import { TenantsPage } from './pages/tenancy/TenantsPage';
import { TenantGroupsPage } from './pages/tenancy/TenantGroupsPage';
import { ContactsPage } from './pages/tenancy/ContactsPage';
import { ContactGroupsPage } from './pages/tenancy/ContactGroupsPage';
import { ContactRolesPage } from './pages/tenancy/ContactRolesPage';
import { DesignerPage } from './pages/DesignerPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ActivityLogPage } from './pages/admin/ActivityLogPage';
import { ProfilePage } from './pages/ProfilePage';
import api from './lib/api';

const VIEW_MAP: Record<string, React.ComponentType> = {
  'dcim-sites': SitesPage,
  'dcim-regions': RegionsPage,
  'dcim-racks': RacksPage,
  'dcim-manufacturers': ManufacturersPage,
  'dcim-device-types': DeviceTypesPage,
  'dcim-device-roles': DeviceRolesPage,
  'dcim-platforms': PlatformsPage,
  'dcim-devices': DevicesPage,
  'dcim-interfaces': InterfacesPage,
  'dcim-cables': CablesPage,
  'ipam-vrfs': VRFsPage,
  'ipam-prefixes': PrefixesPage,
  'ipam-ip-addresses': IPAddressesPage,
  'ipam-vlans': VLANsPage,
  'ipam-vlan-groups': VLANGroupsPage,
  'virt-clusters': ClustersPage,
  'virt-cluster-types': ClusterTypesPage,
  'virt-virtual-machines': VirtualMachinesPage,
  'circuits-providers': ProvidersPage,
  'circuits-types': CircuitTypesPage,
  'circuits-list': CircuitsPage,
  'tenants': TenantsPage,
  'tenant-groups': TenantGroupsPage,
  'contacts': ContactsPage,
  'contact-groups': ContactGroupsPage,
  'contact-roles': ContactRolesPage,
  'assets': AssetsPage,
  'locations': LocationsPage,
  'diagrams': InfrastructurePage,
  'designer': DesignerPage,
  'users': UsersPage,
  'activity-log': ActivityLogPage,
  'profile': ProfilePage,
};

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [installed, setInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    try {
      const status = await api.setup.status();
      setInstalled(status.installed);
    } catch (error) {
      console.error('Error checking installation:', error);
      setInstalled(false);
    }
  };

  if (installed === null || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!installed) {
    return <SetupPage onComplete={() => setInstalled(true)} />;
  }

  if (!user) {
    return <AuthPage />;
  }

  const ViewComponent = VIEW_MAP[currentView];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarVisible && (
        <Sidebar currentView={currentView} onViewChange={setCurrentView} onHide={() => setSidebarVisible(false)} />
      )}
      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-5 h-12 rounded-r-lg transition-all hover:w-7"
          style={{ background: '#1E3A5F', color: '#60A5FA', border: '1px solid #2563EB40', borderLeft: 'none' }}
          title="Show sidebar"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <div className="flex-1 overflow-auto">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : ViewComponent ? (
          <ViewComponent />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
