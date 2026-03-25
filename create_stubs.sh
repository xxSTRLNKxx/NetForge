#!/bin/bash

# Create stub pages that don't exist yet
pages=(
  "src/pages/AssetsPage.tsx"
  "src/pages/LocationsPage.tsx"
  "src/pages/InfrastructurePage.tsx"
  "src/pages/DesignerPage.tsx"
)

for page in "${pages[@]}"; do
  name=$(basename "$page" .tsx)
  cat > "$page" << EOFILE
import { PageHeader } from '../components/UI/PageHeader';

export function ${name}() {
  return (
    <div className="p-6">
      <PageHeader
        title="${name/Page/}"
        description="Feature coming soon"
      />
      <div className="mt-6 text-center text-slate-500">
        This feature is under development
      </div>
    </div>
  );
}
EOFILE
done

# Create DCIM pages
mkdir -p src/pages/dcim
dcim_pages=(
  "SitesPage" "RegionsPage" "RacksPage" "ManufacturersPage"
  "DeviceTypesPage" "DeviceRolesPage" "PlatformsPage" "DevicesPage"
  "InterfacesPage" "CablesPage"
)

for page in "${dcim_pages[@]}"; do
  cat > "src/pages/dcim/${page}.tsx" << EOFILE
import { PageHeader } from '../../components/UI/PageHeader';
import { useCrud } from '../../hooks/useCrud';

export function ${page}() {
  const tableName = '${page}' | sed 's/Page$//' | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_/dcim_/'
  const { data, loading } = useCrud({ table: 'dcim_${page,,}' });

  return (
    <div className="p-6">
      <PageHeader
        title="${page/Page/}"
        description="Manage ${page/Page/} resources"
      />
      {loading ? (
        <div className="mt-6 text-center">Loading...</div>
      ) : (
        <div className="mt-6">
          <p className="text-slate-500">Found {data.length} items</p>
        </div>
      )}
    </div>
  );
}
EOFILE
done

# Create IPAM pages
mkdir -p src/pages/ipam
ipam_pages=("VRFsPage" "PrefixesPage" "IPAddressesPage" "VLANsPage" "VLANGroupsPage")

for page in "${ipam_pages[@]}"; do
  cat > "src/pages/ipam/${page}.tsx" << EOFILE
import { PageHeader } from '../../components/UI/PageHeader';
import { useCrud } from '../../hooks/useCrud';

export function ${page}() {
  const { data, loading } = useCrud({ table: 'ipam_${page,,}' });

  return (
    <div className="p-6">
      <PageHeader
        title="${page/Page/}"
        description="Manage ${page/Page/} resources"
      />
      {loading ? (
        <div className="mt-6 text-center">Loading...</div>
      ) : (
        <div className="mt-6">
          <p className="text-slate-500">Found {data.length} items</p>
        </div>
      )}
    </div>
  );
}
EOFILE
done

# Create Circuit pages
mkdir -p src/pages/circuits
circuit_pages=("ProvidersPage" "CircuitTypesPage" "CircuitsPage")

for page in "${circuit_pages[@]}"; do
  cat > "src/pages/circuits/${page}.tsx" << EOFILE
import { PageHeader } from '../../components/UI/PageHeader';
import { useCrud } from '../../hooks/useCrud';

export function ${page}() {
  const { data, loading } = useCrud({ table: 'circuits_${page,,}' });

  return (
    <div className="p-6">
      <PageHeader
        title="${page/Page/}"
        description="Manage ${page/Page/} resources"
      />
      {loading ? (
        <div className="mt-6 text-center">Loading...</div>
      ) : (
        <div className="mt-6">
          <p className="text-slate-500">Found {data.length} items</p>
        </div>
      )}
    </div>
  );
}
EOFILE
done

# Create Tenancy pages
mkdir -p src/pages/tenancy
tenancy_pages=("TenantsPage" "TenantGroupsPage" "ContactsPage" "ContactGroupsPage" "ContactRolesPage")

for page in "${tenancy_pages[@]}"; do
  cat > "src/pages/tenancy/${page}.tsx" << EOFILE
import { PageHeader } from '../../components/UI/PageHeader';
import { useCrud } from '../../hooks/useCrud';

export function ${page}() {
  const { data, loading } = useCrud({ table: 'tenancy_${page,,}' });

  return (
    <div className="p-6">
      <PageHeader
        title="${page/Page/}"
        description="Manage ${page/Page/} resources"
      />
      {loading ? (
        <div className="mt-6 text-center">Loading...</div>
      ) : (
        <div className="mt-6">
          <p className="text-slate-500">Found {data.length} items</p>
        </div>
      )}
    </div>
  );
}
EOFILE
done

# Create Virtualization pages
mkdir -p src/pages/virtualization
virt_pages=("ClustersPage" "ClusterTypesPage" "VirtualMachinesPage")

for page in "${virt_pages[@]}"; do
  cat > "src/pages/virtualization/${page}.tsx" << EOFILE
import { PageHeader } from '../../components/UI/PageHeader';
import { useCrud } from '../../hooks/useCrud';

export function ${page}() {
  const { data, loading } = useCrud({ table: 'virtualization_${page,,}' });

  return (
    <div className="p-6">
      <PageHeader
        title="${page/Page/}"
        description="Manage ${page/Page/} resources"
      />
      {loading ? (
        <div className="mt-6 text-center">Loading...</div>
      ) : (
        <div className="mt-6">
          <p className="text-slate-500">Found {data.length} items</p>
        </div>
      )}
    </div>
  );
}
EOFILE
done

# Create components
mkdir -p src/components/Diagram
cat > src/components/Diagram/DiagramCanvas.tsx << 'EOFILE'
export function DiagramCanvas() {
  return <div>Diagram Canvas</div>;
}
EOFILE

cat > src/components/Diagram/NodePropertiesPanel.tsx << 'EOFILE'
export function NodePropertiesPanel() {
  return <div>Node Properties</div>;
}
EOFILE

echo "Stub pages created"
