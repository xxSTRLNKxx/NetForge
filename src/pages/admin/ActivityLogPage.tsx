import { useState, useEffect } from 'react';
import { Activity, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/UI/PageHeader';
import { StatusBadge } from '../../components/UI/StatusBadge';

interface ActivityLogEntry {
  id: string;
  user_id: string;
  action: 'created' | 'updated' | 'deleted';
  table_name: string;
  record_id: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  created_at: string;
  user_name?: string;
}

export function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterTable, setFilterTable] = useState<string>('all');
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  useEffect(() => {
    checkCurrentUserRole();
    loadActivities();
  }, [filterAction, filterTable]);

  const checkCurrentUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setCurrentUserRole(data.role);
      }
    }
  };

  const loadActivities = async () => {
    try {
      let query = supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterAction !== 'all') {
        query = query.eq('action', filterAction);
      }

      if (filterTable !== 'all') {
        query = query.eq('table_name', filterTable);
      }

      const { data, error } = await query;

      if (error) throw error;

      const userIds = [...new Set(data?.map(a => a.user_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .in('id', userIds);

      const activitiesWithUser = data?.map(activity => ({
        ...activity,
        user_name: profiles?.find(p => p.id === activity.user_id)?.full_name || 'Unknown User'
      })) || [];

      setActivities(activitiesWithUser);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'green';
      case 'updated':
        return 'blue';
      case 'deleted':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatTableName = (tableName: string) => {
    return tableName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (currentUserRole !== 'admin') {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Activity Log"
        description="View all system activity and changes"
        icon={Activity}
      />

      <div className="bg-white rounded-lg shadow border border-gray-200 mb-6 p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Action:</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Table:</label>
            <select
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tables</option>
              <option value="dcim_devices">Devices</option>
              <option value="dcim_sites">Sites</option>
              <option value="ipam_ip_addresses">IP Addresses</option>
              <option value="user_profiles">User Profiles</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No activity records found
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(activity.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.user_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={activity.action}
                          label={activity.action.toUpperCase()}
                          color={getActionColor(activity.action)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTableName(activity.table_name)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {activity.record_id ? activity.record_id.slice(0, 8) + '...' : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
