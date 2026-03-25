-- NetForge SQLite Database Schema
-- Converted from PostgreSQL schema for self-hosted deployment

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'read_only')),
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data TEXT,
  new_data TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_table_name ON activity_log(table_name);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- DCIM: Regions
CREATE TABLE IF NOT EXISTS dcim_regions (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id TEXT REFERENCES dcim_regions(id) ON DELETE SET NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- DCIM: Sites
CREATE TABLE IF NOT EXISTS dcim_sites (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region_id TEXT REFERENCES dcim_regions(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('planned', 'staging', 'active', 'decommissioning', 'retired')),
  facility TEXT,
  asn INTEGER,
  time_zone TEXT,
  description TEXT,
  physical_address TEXT,
  shipping_address TEXT,
  latitude REAL,
  longitude REAL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_dcim_sites_region ON dcim_sites(region_id);
CREATE INDEX IF NOT EXISTS idx_dcim_sites_status ON dcim_sites(status);

-- DCIM: Racks
CREATE TABLE IF NOT EXISTS dcim_racks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  site_id TEXT REFERENCES dcim_sites(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('planned', 'reserved', 'available', 'active', 'deprecated')),
  facility_id TEXT,
  u_height INTEGER DEFAULT 42,
  desc_units INTEGER DEFAULT 0,
  outer_width INTEGER,
  outer_depth INTEGER,
  outer_unit TEXT DEFAULT 'mm' CHECK (outer_unit IN ('mm', 'in')),
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(site_id, name)
);

CREATE INDEX IF NOT EXISTS idx_dcim_racks_site ON dcim_racks(site_id);

-- DCIM: Manufacturers
CREATE TABLE IF NOT EXISTS dcim_manufacturers (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- DCIM: Device Types
CREATE TABLE IF NOT EXISTS dcim_device_types (
  id TEXT PRIMARY KEY,
  manufacturer_id TEXT REFERENCES dcim_manufacturers(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  part_number TEXT,
  u_height REAL DEFAULT 1.0,
  is_full_depth INTEGER DEFAULT 1,
  subdevice_role TEXT CHECK (subdevice_role IN ('parent', 'child')),
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(manufacturer_id, model)
);

CREATE INDEX IF NOT EXISTS idx_dcim_device_types_manufacturer ON dcim_device_types(manufacturer_id);

-- DCIM: Platforms
CREATE TABLE IF NOT EXISTS dcim_platforms (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  manufacturer_id TEXT REFERENCES dcim_manufacturers(id) ON DELETE SET NULL,
  napalm_driver TEXT,
  napalm_args TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- DCIM: Device Roles
CREATE TABLE IF NOT EXISTS dcim_device_roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '9e9e9e',
  vm_role INTEGER DEFAULT 1,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- DCIM: Devices
CREATE TABLE IF NOT EXISTS dcim_devices (
  id TEXT PRIMARY KEY,
  name TEXT,
  device_type_id TEXT REFERENCES dcim_device_types(id) ON DELETE CASCADE,
  device_role_id TEXT REFERENCES dcim_device_roles(id) ON DELETE CASCADE,
  platform_id TEXT REFERENCES dcim_platforms(id) ON DELETE SET NULL,
  site_id TEXT REFERENCES dcim_sites(id) ON DELETE CASCADE,
  rack_id TEXT REFERENCES dcim_racks(id) ON DELETE SET NULL,
  position REAL,
  face TEXT CHECK (face IN ('front', 'rear')),
  status TEXT DEFAULT 'active' CHECK (status IN ('offline', 'active', 'planned', 'staged', 'failed', 'inventory', 'decommissioning')),
  serial TEXT,
  asset_tag TEXT,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_dcim_devices_site ON dcim_devices(site_id);
CREATE INDEX IF NOT EXISTS idx_dcim_devices_rack ON dcim_devices(rack_id);
CREATE INDEX IF NOT EXISTS idx_dcim_devices_device_type ON dcim_devices(device_type_id);
CREATE INDEX IF NOT EXISTS idx_dcim_devices_status ON dcim_devices(status);

-- DCIM: Interfaces
CREATE TABLE IF NOT EXISTS dcim_interfaces (
  id TEXT PRIMARY KEY,
  device_id TEXT REFERENCES dcim_devices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('virtual', '1000base-t', '10gbase-x-sfpp', '25gbase-x-sfp28', '40gbase-x-qsfpp', '100gbase-x-qsfp28', 'other')),
  enabled INTEGER DEFAULT 1,
  mtu INTEGER,
  mac_address TEXT,
  description TEXT,
  mode TEXT CHECK (mode IN ('access', 'tagged', 'tagged-all')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(device_id, name)
);

CREATE INDEX IF NOT EXISTS idx_dcim_interfaces_device ON dcim_interfaces(device_id);

-- DCIM: Cables
CREATE TABLE IF NOT EXISTS dcim_cables (
  id TEXT PRIMARY KEY,
  termination_a_type TEXT NOT NULL,
  termination_a_id TEXT NOT NULL,
  termination_b_type TEXT NOT NULL,
  termination_b_id TEXT NOT NULL,
  type TEXT CHECK (type IN ('cat3', 'cat5', 'cat5e', 'cat6', 'cat6a', 'cat7', 'dac-active', 'dac-passive', 'fiber', 'mmf', 'smf', 'power')),
  status TEXT DEFAULT 'connected' CHECK (status IN ('planned', 'installed', 'connected', 'decommissioning')),
  label TEXT,
  color TEXT,
  length REAL,
  length_unit TEXT DEFAULT 'm' CHECK (length_unit IN ('m', 'ft')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- IPAM: VRFs
CREATE TABLE IF NOT EXISTS ipam_vrfs (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  rd TEXT UNIQUE,
  enforce_unique INTEGER DEFAULT 1,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- IPAM: VLAN Groups
CREATE TABLE IF NOT EXISTS ipam_vlan_groups (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- IPAM: VLANs
CREATE TABLE IF NOT EXISTS ipam_vlans (
  id TEXT PRIMARY KEY,
  site_id TEXT REFERENCES dcim_sites(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES ipam_vlan_groups(id) ON DELETE SET NULL,
  vid INTEGER NOT NULL CHECK (vid >= 1 AND vid <= 4094),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'deprecated')),
  role TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(site_id, vid)
);

CREATE INDEX IF NOT EXISTS idx_ipam_vlans_site ON ipam_vlans(site_id);
CREATE INDEX IF NOT EXISTS idx_ipam_vlans_group ON ipam_vlans(group_id);

-- IPAM: Prefixes
CREATE TABLE IF NOT EXISTS ipam_prefixes (
  id TEXT PRIMARY KEY,
  prefix TEXT UNIQUE NOT NULL,
  vrf_id TEXT REFERENCES ipam_vrfs(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES dcim_sites(id) ON DELETE SET NULL,
  vlan_id TEXT REFERENCES ipam_vlans(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('container', 'active', 'reserved', 'deprecated')),
  is_pool INTEGER DEFAULT 0,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ipam_prefixes_vrf ON ipam_prefixes(vrf_id);
CREATE INDEX IF NOT EXISTS idx_ipam_prefixes_site ON ipam_prefixes(site_id);

-- IPAM: IP Addresses
CREATE TABLE IF NOT EXISTS ipam_ip_addresses (
  id TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  vrf_id TEXT REFERENCES ipam_vrfs(id) ON DELETE CASCADE,
  interface_id TEXT REFERENCES dcim_interfaces(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'deprecated', 'dhcp')),
  role TEXT CHECK (role IN ('loopback', 'secondary', 'anycast', 'vip', 'vrrp', 'hsrp', 'glbp', 'carp')),
  dns_name TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(address, vrf_id)
);

CREATE INDEX IF NOT EXISTS idx_ipam_ip_addresses_interface ON ipam_ip_addresses(interface_id);
CREATE INDEX IF NOT EXISTS idx_ipam_ip_addresses_vrf ON ipam_ip_addresses(vrf_id);

-- Circuits: Providers
CREATE TABLE IF NOT EXISTS circuits_providers (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  asn INTEGER UNIQUE,
  account TEXT,
  portal_url TEXT,
  noc_contact TEXT,
  admin_contact TEXT,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Circuits: Circuit Types
CREATE TABLE IF NOT EXISTS circuits_circuit_types (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Circuits: Circuits
CREATE TABLE IF NOT EXISTS circuits_circuits (
  id TEXT PRIMARY KEY,
  cid TEXT UNIQUE NOT NULL,
  provider_id TEXT REFERENCES circuits_providers(id) ON DELETE CASCADE,
  type_id TEXT REFERENCES circuits_circuit_types(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('planned', 'provisioning', 'active', 'offline', 'deprovisioning', 'decommissioned')),
  install_date TEXT,
  commit_rate INTEGER,
  description TEXT,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_circuits_circuits_provider ON circuits_circuits(provider_id);
CREATE INDEX IF NOT EXISTS idx_circuits_circuits_type ON circuits_circuits(type_id);

-- Tenancy: Tenant Groups
CREATE TABLE IF NOT EXISTS tenancy_tenant_groups (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id TEXT REFERENCES tenancy_tenant_groups(id) ON DELETE SET NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tenancy: Tenants
CREATE TABLE IF NOT EXISTS tenancy_tenants (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  group_id TEXT REFERENCES tenancy_tenant_groups(id) ON DELETE SET NULL,
  description TEXT,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tenancy: Contact Roles
CREATE TABLE IF NOT EXISTS tenancy_contact_roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tenancy: Contact Groups
CREATE TABLE IF NOT EXISTS tenancy_contact_groups (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id TEXT REFERENCES tenancy_contact_groups(id) ON DELETE SET NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tenancy: Contacts
CREATE TABLE IF NOT EXISTS tenancy_contacts (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES tenancy_contact_groups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Virtualization: Cluster Types
CREATE TABLE IF NOT EXISTS virtualization_cluster_types (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Virtualization: Clusters
CREATE TABLE IF NOT EXISTS virtualization_clusters (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  type_id TEXT REFERENCES virtualization_cluster_types(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES dcim_sites(id) ON DELETE SET NULL,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Virtualization: Virtual Machines
CREATE TABLE IF NOT EXISTS virtualization_virtual_machines (
  id TEXT PRIMARY KEY,
  cluster_id TEXT REFERENCES virtualization_clusters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('offline', 'active', 'planned', 'staged', 'failed', 'decommissioning')),
  role_id TEXT REFERENCES dcim_device_roles(id) ON DELETE SET NULL,
  platform_id TEXT REFERENCES dcim_platforms(id) ON DELETE SET NULL,
  vcpus INTEGER,
  memory INTEGER,
  disk INTEGER,
  comments TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_virtualization_vms_cluster ON virtualization_virtual_machines(cluster_id);

-- Network Designer: Diagrams
CREATE TABLE IF NOT EXISTS designer_diagrams (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  nodes TEXT,
  edges TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_designer_diagrams_user ON designer_diagrams(user_id);
