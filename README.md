# NetForge

**Enterprise IT Infrastructure Management Platform**

NetForge is a modern, full-featured IT infrastructure management system that combines the comprehensive data modeling of NetBox with an intuitive visual network designer. Built with React, TypeScript, and Supabase, it provides organizations with a powerful tool to document, manage, and visualize their IT infrastructure.

## Features

### Core Infrastructure Management (DCIM)
- **Sites & Locations**: Manage data centers, offices, and facility hierarchies
- **Racks & Devices**: Track physical hardware placement and organization
- **Device Management**: Comprehensive device inventory with manufacturers, types, roles, and platforms
- **Cabling**: Document physical and logical connections between devices
- **Interfaces**: Track network interfaces and their configurations

### IP Address Management (IPAM)
- **VRFs**: Virtual routing and forwarding instance management
- **Prefixes**: IP prefix allocation and tracking
- **IP Addresses**: Individual IP address assignment and status tracking
- **VLANs**: VLAN management and grouping

### Circuit Management
- **Providers**: Telecom and service provider tracking
- **Circuits**: Circuit inventory with types and terminations
- **Circuit Types**: Categorize circuits by function

### Virtualization
- **Clusters**: Virtual infrastructure cluster management
- **Virtual Machines**: VM inventory and tracking
- **Cluster Types**: Organize virtualization platforms

### Tenancy & Organization
- **Tenants**: Multi-tenant support for service providers
- **Contacts**: Contact and role management
- **Groups**: Organizational hierarchy

### Visual Network Designer
- **Interactive Canvas**: Drag-and-drop network diagram creation
- **Real-time Collaboration**: Live updates across users
- **Device Library**: Pre-configured device templates
- **Port Configuration**: Visual port and connection management
- **Container Support**: Group devices into logical containers
- **Export Capabilities**: Save diagrams for documentation

### User Management & Security
- **Role-Based Access Control**: Admin, User, and Read-Only roles
- **User Profiles**: Avatar support and profile customization
- **Activity Logging**: Comprehensive audit trail of all changes
- **Supabase Authentication**: Secure email/password authentication
- **Row-Level Security**: Data isolation and protection

### Dashboard & Analytics
- **Real-time Statistics**: Live counts across all resource types
- **Category Organization**: NetBox-style grouped metrics
- **Quick Actions**: Fast access to common operations

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with RLS
- **Database**: PostgreSQL with full schema migrations

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd netforge
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run database migrations:
All migrations are located in `supabase/migrations/` and will be automatically applied to your Supabase project.

5. Start the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Database Schema

NetForge uses a comprehensive PostgreSQL schema with the following major table groups:

### DCIM Tables
- `dcim_sites`, `dcim_regions`, `dcim_racks`
- `dcim_manufacturers`, `dcim_device_types`, `dcim_device_roles`
- `dcim_devices`, `dcim_interfaces`, `dcim_cables`
- `dcim_platforms`

### IPAM Tables
- `ipam_vrfs`, `ipam_prefixes`, `ipam_ip_addresses`
- `ipam_vlans`, `ipam_vlan_groups`

### Circuits Tables
- `circuits_providers`, `circuits_circuit_types`, `circuits_circuits`

### Virtualization Tables
- `virtualization_cluster_types`, `virtualization_clusters`
- `virtualization_virtual_machines`

### Tenancy Tables
- `tenancy_tenant_groups`, `tenancy_tenants`
- `tenancy_contact_groups`, `tenancy_contact_roles`, `tenancy_contacts`

### Designer Tables
- `network_diagrams`, `diagram_nodes`, `diagram_connections`
- `node_ports`

### User Management
- `user_profiles` (roles, avatars, status)
- `activity_log` (audit trail)

All tables implement Row-Level Security (RLS) policies for data protection.

## User Roles

- **Admin**: Full system access, user management, activity log access
- **User**: Standard access to create and manage infrastructure resources
- **Read Only**: View-only access to all resources

## Security

NetForge implements enterprise-grade security:
- Row-Level Security (RLS) on all tables
- Secure authentication with Supabase Auth
- Password hashing and secure session management
- Activity logging for compliance and auditing
- Role-based access control
- Data isolation between tenants

## Project Structure

```
netforge/
├── src/
│   ├── components/
│   │   ├── Auth/          # Authentication forms
│   │   ├── Diagram/       # Visual designer components
│   │   ├── Layout/        # App layout and sidebar
│   │   └── UI/            # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries (Supabase client)
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages (users, activity log)
│   │   ├── circuits/      # Circuit management pages
│   │   ├── dcim/          # DCIM pages
│   │   ├── ipam/          # IPAM pages
│   │   ├── tenancy/       # Tenancy pages
│   │   └── virtualization/# Virtualization pages
│   └── main.tsx           # Application entry point
├── supabase/
│   └── migrations/        # Database migration files
└── public/                # Static assets
```

## Contributing

This is a commercial product. Contributions are managed by the core team.

## License

Copyright (c) 2026. All rights reserved.

This is proprietary software. Unauthorized copying, modification, or distribution is prohibited.

## Support

For support inquiries, please contact the development team.

## Roadmap

Future enhancements planned:
- Advanced reporting and analytics
- REST API for external integrations
- Mobile application
- Advanced diagram features (auto-layout, templates)
- Asset lifecycle management
- Integration with monitoring tools
- Advanced search and filtering
- Bulk operations
- Data import/export tools

## Acknowledgments

Inspired by NetBox, the leading open-source IPAM and DCIM solution, NetForge extends the concept with modern UI/UX and visual network design capabilities.
