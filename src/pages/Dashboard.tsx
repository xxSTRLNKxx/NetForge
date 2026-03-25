import { useEffect, useState } from 'react';
import { MapPin, Server, Network, Database, Users, Cable } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  dcim: {
    sites: number;
    racks: number;
    devices: number;
    deviceTypes: number;
    cables: number;
    interfaces: number;
  };
  ipam: {
    vrfs: number;
    prefixes: number;
    ipAddresses: number;
    vlans: number;
  };
  circuits: {
    providers: number;
    circuits: number;
    circuitTypes: number;
  };
  virtualization: {
    clusters: number;
    virtualMachines: number;
  };
  tenancy: {
    tenants: number;
    contacts: number;
  };
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    dcim: {
      sites: 0,
      racks: 0,
      devices: 0,
      deviceTypes: 0,
      cables: 0,
      interfaces: 0,
    },
    ipam: {
      vrfs: 0,
      prefixes: 0,
      ipAddresses: 0,
      vlans: 0,
    },
    circuits: {
      providers: 0,
      circuits: 0,
      circuitTypes: 0,
    },
    virtualization: {
      clusters: 0,
      virtualMachines: 0,
    },
    tenancy: {
      tenants: 0,
      contacts: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        sitesResult,
        racksResult,
        devicesResult,
        deviceTypesResult,
        cablesResult,
        interfacesResult,
        vrfsResult,
        prefixesResult,
        ipAddressesResult,
        vlansResult,
        providersResult,
        circuitsResult,
        circuitTypesResult,
        clustersResult,
        virtualMachinesResult,
        tenantsResult,
        contactsResult,
      ] = await Promise.all([
        supabase.from('dcim_sites').select('id', { count: 'exact', head: true }),
        supabase.from('dcim_racks').select('id', { count: 'exact', head: true }),
        supabase.from('dcim_devices').select('id', { count: 'exact', head: true }),
        supabase.from('dcim_device_types').select('id', { count: 'exact', head: true }),
        supabase.from('dcim_cables').select('id', { count: 'exact', head: true }),
        supabase.from('dcim_interfaces').select('id', { count: 'exact', head: true }),
        supabase.from('ipam_vrfs').select('id', { count: 'exact', head: true }),
        supabase.from('ipam_prefixes').select('id', { count: 'exact', head: true }),
        supabase.from('ipam_ip_addresses').select('id', { count: 'exact', head: true }),
        supabase.from('ipam_vlans').select('id', { count: 'exact', head: true }),
        supabase.from('circuits_providers').select('id', { count: 'exact', head: true }),
        supabase.from('circuits_circuits').select('id', { count: 'exact', head: true }),
        supabase.from('circuits_circuit_types').select('id', { count: 'exact', head: true }),
        supabase.from('virtualization_clusters').select('id', { count: 'exact', head: true }),
        supabase.from('virtualization_virtual_machines').select('id', { count: 'exact', head: true }),
        supabase.from('tenancy_tenants').select('id', { count: 'exact', head: true }),
        supabase.from('tenancy_contacts').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        dcim: {
          sites: sitesResult.count || 0,
          racks: racksResult.count || 0,
          devices: devicesResult.count || 0,
          deviceTypes: deviceTypesResult.count || 0,
          cables: cablesResult.count || 0,
          interfaces: interfacesResult.count || 0,
        },
        ipam: {
          vrfs: vrfsResult.count || 0,
          prefixes: prefixesResult.count || 0,
          ipAddresses: ipAddressesResult.count || 0,
          vlans: vlansResult.count || 0,
        },
        circuits: {
          providers: providersResult.count || 0,
          circuits: circuitsResult.count || 0,
          circuitTypes: circuitTypesResult.count || 0,
        },
        virtualization: {
          clusters: clustersResult.count || 0,
          virtualMachines: virtualMachinesResult.count || 0,
        },
        tenancy: {
          tenants: tenantsResult.count || 0,
          contacts: contactsResult.count || 0,
        },
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  interface StatSection {
    title: string;
    icon: typeof Server;
    items: Array<{ label: string; value: number }>;
  }

  const statSections: StatSection[] = [
    {
      title: 'DCIM',
      icon: Server,
      items: [
        { label: 'Sites', value: stats.dcim.sites },
        { label: 'Racks', value: stats.dcim.racks },
        { label: 'Device Types', value: stats.dcim.deviceTypes },
        { label: 'Devices', value: stats.dcim.devices },
        { label: 'Cables', value: stats.dcim.cables },
        { label: 'Interfaces', value: stats.dcim.interfaces },
      ],
    },
    {
      title: 'IPAM',
      icon: Network,
      items: [
        { label: 'VRFs', value: stats.ipam.vrfs },
        { label: 'Prefixes', value: stats.ipam.prefixes },
        { label: 'IP Addresses', value: stats.ipam.ipAddresses },
        { label: 'VLANs', value: stats.ipam.vlans },
      ],
    },
    {
      title: 'Circuits',
      icon: Cable,
      items: [
        { label: 'Providers', value: stats.circuits.providers },
        { label: 'Circuits', value: stats.circuits.circuits },
        { label: 'Circuit Types', value: stats.circuits.circuitTypes },
      ],
    },
    {
      title: 'Virtualization',
      icon: Database,
      items: [
        { label: 'Clusters', value: stats.virtualization.clusters },
        { label: 'Virtual Machines', value: stats.virtualization.virtualMachines },
      ],
    },
    {
      title: 'Tenancy',
      icon: Users,
      items: [
        { label: 'Tenants', value: stats.tenancy.tenants },
        { label: 'Contacts', value: stats.tenancy.contacts },
      ],
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      {section.title}
                    </h2>
                  </div>
                  <div className="p-4 space-y-3">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-lg font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <Server className="w-8 h-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Add Device</h3>
                <p className="text-sm text-gray-500">Register a new device</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <MapPin className="w-8 h-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Add Site</h3>
                <p className="text-sm text-gray-500">Create a new site</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <Network className="w-8 h-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Design Infrastructure</h3>
                <p className="text-sm text-gray-500">Create network diagram</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
