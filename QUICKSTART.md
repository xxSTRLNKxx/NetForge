# NetForge - Quick Start Guide

## What Changed

Your application has been converted from a cloud-based Supabase solution to a **fully self-hosted** system:

- ✅ No external dependencies (no Supabase account needed)
- ✅ All data stored locally in SQLite
- ✅ Built-in web setup wizard
- ✅ Local authentication system
- ✅ Easy one-command installation

## Installation (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will start on http://localhost:3000

### 3. Complete Setup Wizard
Open your browser to http://localhost:3000 and you'll see a beautiful setup wizard:

**Step 1 - System Settings:**
- Enter your site/organization name
- Choose whether to allow user registration
- Set session timeout (default: 24 hours)

**Step 2 - Admin Account:**
- Create your first admin user
- Set email and password
- Click "Complete Setup"

That's it! You're ready to use NetForge.

## What Happens During Setup

1. Creates `config.json` with your settings
2. Generates a secure JWT secret
3. Creates SQLite database at `./data/netforge.db`
4. Initializes database schema (30+ tables)
5. Creates your admin account

## Using NetForge

### Login
Use the admin credentials you created during setup.

### Features
All modules work exactly as before:
- **DCIM**: Sites, racks, devices, cables, interfaces
- **IPAM**: IP addresses, prefixes, VLANs, VRFs
- **Circuits**: Providers, circuits, circuit types
- **Virtualization**: Clusters, VMs
- **Tenancy**: Tenants, contacts
- **Admin**: User management, activity logs

### User Roles
- **Admin**: Full access, can manage users
- **User**: Standard access, can create/edit data
- **Read-only**: View-only access

## Development

```bash
npm start          # Start server (development)
npm run build      # Build for production
```

## Production Deployment

See `INSTALL.md` for production deployment with PM2, nginx, etc.

## Backup Your Data

To backup NetForge:
1. Copy `config.json`
2. Copy `data/netforge.db`

Store these files securely to restore your data anytime.

## Troubleshooting

**Setup wizard doesn't appear?**
- Delete `config.json` and restart

**Port 3000 in use?**
- Run: `PORT=8080 npm start`

**Database errors?**
- Ensure write permissions for the `data/` directory

## Next Steps

1. **Push to GitHub** - See `GIT_SETUP.md`
2. **Test features** - See `TESTING.md`
3. **Deploy to production** - See `INSTALL.md`

## Need Help?

- Check `TESTING.md` for detailed testing checklist
- Check `INSTALL.md` for deployment instructions
- Review server logs for error messages

---

**Made the switch from Supabase to self-hosted successfully!** 🎉
