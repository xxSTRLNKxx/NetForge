# Testing Checklist

## Installation Test

1. **Start the application:**
   ```bash
   npm start
   ```
   Expected: Server starts on http://localhost:3000

2. **Access setup wizard:**
   - Open browser to http://localhost:3000
   - Expected: Redirected to setup wizard page

3. **Complete Step 1 - System Settings:**
   - Site Name: (enter your organization name)
   - Allow user registration: (check or uncheck)
   - Session timeout: 86400 (default)
   - Click "Continue"

4. **Complete Step 2 - Admin Account:**
   - Full Name: Admin User
   - Email: admin@example.com
   - Password: (min 8 characters)
   - Confirm Password: (same password)
   - Click "Complete Setup"
   - Expected: Setup completes successfully

5. **Login Test:**
   - Use admin credentials from step 4
   - Expected: Dashboard loads successfully

## Feature Tests

### Authentication
- [ ] Login with admin account works
- [ ] Logout works
- [ ] Invalid credentials show error
- [ ] Token persists across page refresh

### Dashboard
- [ ] Dashboard shows statistics
- [ ] All stat cards display correctly
- [ ] No console errors

### Navigation
- [ ] Sidebar shows all modules
- [ ] Admin menu items visible for admin user
- [ ] All navigation links work
- [ ] Sidebar can be collapsed/expanded

### Admin Functions (Admin user only)
- [ ] Users page accessible
- [ ] Activity log page accessible
- [ ] Can view all users
- [ ] Can view activity log

### DCIM Module
- [ ] Sites page loads
- [ ] Can create new site
- [ ] Can edit site
- [ ] Can delete site
- [ ] Data persists across refresh

### IPAM Module
- [ ] VRFs page loads
- [ ] Prefixes page loads
- [ ] IP Addresses page loads
- [ ] VLANs page loads

### Database
- [ ] Check that `config.json` is created in project root
- [ ] Check that `data/netforge.db` is created
- [ ] Verify data persists after server restart

## Files to Verify

Core Backend Files:
- [ ] server/index.ts
- [ ] server/config/index.ts
- [ ] server/database/index.ts
- [ ] server/database/schema.sql
- [ ] server/routes/auth.ts
- [ ] server/routes/setup.ts
- [ ] server/routes/api.ts

Core Frontend Files:
- [ ] src/App.tsx
- [ ] src/pages/SetupPage.tsx
- [ ] src/lib/api.ts
- [ ] src/contexts/AuthContext.tsx
- [ ] src/hooks/useCrud.ts

Configuration:
- [ ] package.json (updated scripts)
- [ ] .gitignore (excludes node_modules, data, config.json)

## Common Issues

### Port Already in Use
If port 3000 is busy:
```bash
PORT=8080 npm start
```

### Database Errors
If you see database errors, ensure:
- The `data/` directory can be created
- You have write permissions

### Reinstall
To reset and reinstall:
1. Stop the server
2. Delete `config.json`
3. Delete `data/` folder
4. Restart the server
5. Complete setup wizard again

## Expected Behavior

✓ First launch shows setup wizard
✓ Setup creates config.json and database
✓ Subsequent launches skip setup (go to login)
✓ All data stored locally in SQLite
✓ No external dependencies required
✓ Admin can manage users
✓ Role-based access control works
