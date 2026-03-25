import { useEffect, useState } from 'react';
import { MapPin, Server, Network, Database, Users, Cable } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  sites: number;
  assets: number;
  devices: number;
  diagrams: number;
  locations: number;
  manufacturers: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    sites: 0,
    assets: 0,
    devices: 0,
    diagrams: 0,
    locations: 0,
    manufacturers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        { count: sitesCount },
        { count: assetsCount },
        { count: devicesCount },
        { count: diagramsCount },
        { count: locationsCount },
        { count: manufacturersCount }
      ] = await Promise.all([
        supabase.from('sites').select('*', { count: 'exact', head: true }),
        supabase.from('assets').select('*', { count: 'exact', head: true }),
        supabase.from('devices').select('*', { count: 'exact', head: true }),
        supabase.from('infrastructure_diagrams').select('*', { count: 'exact', head: true }),
        supabase.from('locations').select('*', { count: 'exact', head: true }),
        supabase.from('manufacturers').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        sites: sitesCount || 0,
        assets: assetsCount || 0,
        devices: devicesCount || 0,
        diagrams: diagramsCount || 0,
        locations: locationsCount || 0,
        manufacturers: manufacturersCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Sites', value: stats.sites, icon: MapPin, color: 'bg-blue-500' },
    { label: 'Assets', value: stats.assets, icon: Server, color: 'bg-green-500' },
    { label: 'Devices', value: stats.devices, icon: Network, color: 'bg-orange-500' },
    { label: 'Diagrams', value: stats.diagrams, icon: Cable, color: 'bg-cyan-500' },
    { label: 'Locations', value: stats.locations, icon: Database, color: 'bg-rose-500' },
    { label: 'Manufacturers', value: stats.manufacturers, icon: Users, color: 'bg-amber-500' },
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
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </div>
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
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
                <h3 className="font-medium text-gray-900">Add Asset</h3>
                <p className="text-sm text-gray-500">Register a new asset</p>
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
