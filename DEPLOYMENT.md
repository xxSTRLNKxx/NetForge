# NetForge Deployment Guide

This guide covers deploying NetForge to production environments.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase project (production instance)
- Domain name (optional but recommended)
- SSL certificate (handled by most hosting providers)

## Environment Setup

### 1. Supabase Project Setup

1. Create a new Supabase project at https://supabase.com
2. Note your project URL and anon key from Project Settings > API
3. Apply all database migrations from `supabase/migrations/`
4. Verify Row-Level Security is enabled on all tables

### 2. Environment Variables

Create a `.env.production` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Security Note**: Never commit real credentials to version control.

## Database Migrations

All migrations in `supabase/migrations/` must be applied in order:

1. `20260321001749_create_it_management_schema.sql` - Core tables
2. `20260322114825_add_netbox_full_schema.sql` - Full NetBox schema
3. `20260322234200_add_node_properties_and_ports.sql` - Designer features
4. `20260323001751_add_node_nesting_and_resize.sql` - Advanced designer
5. `20260325010624_add_user_roles_and_profiles.sql` - User management

### Applying Migrations

Use the Supabase CLI or dashboard SQL editor to run migrations in order.

## Build Process

### Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output will be in ./dist directory
```

The build process:
- Compiles TypeScript to JavaScript
- Bundles React application
- Minifies and optimizes assets
- Generates source maps
- Outputs to `dist/` directory

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Add environment variables in Vercel dashboard

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Option 2: Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod --dir=dist`

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Traditional Web Server (Nginx)

1. Build the application: `npm run build`
2. Copy `dist/` contents to your web server
3. Configure Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/netforge;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Option 4: Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run**:
```bash
docker build -t netforge .
docker run -p 80:80 netforge
```

## Post-Deployment Configuration

### 1. Create First Admin User

After deployment:
1. Sign up through the application
2. Access your Supabase database
3. Update the user's role:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'user-id-here';
```

### 2. Configure Supabase Auth Settings

In Supabase Dashboard > Authentication > Settings:
- Set Site URL to your production domain
- Configure email templates
- Set up email rate limiting
- Configure password requirements
- Enable/disable email confirmations

### 3. Security Checklist

- [ ] Environment variables properly set
- [ ] RLS enabled on all tables
- [ ] Admin user created
- [ ] SSL/TLS certificate installed
- [ ] Security headers configured
- [ ] CORS settings verified
- [ ] Database backups configured
- [ ] Monitoring set up

## Performance Optimization

### CDN Configuration

Serve static assets through a CDN:
- CSS files (`/assets/*.css`)
- JavaScript files (`/assets/*.js`)
- Images and icons

### Caching Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Performance

- Ensure all indexes are created (done by migrations)
- Monitor query performance in Supabase dashboard
- Set up connection pooling if needed
- Consider read replicas for high traffic

## Monitoring and Maintenance

### Application Monitoring

Consider setting up:
- Error tracking (Sentry, LogRocket)
- Performance monitoring
- Uptime monitoring
- User analytics

### Database Monitoring

- Monitor Supabase dashboard for:
  - Database size and growth
  - Query performance
  - Connection pool usage
  - API request rates

### Backup Strategy

1. **Database Backups**:
   - Supabase Pro: Automatic daily backups
   - Manual backups via Supabase CLI or pg_dump

2. **Application Backups**:
   - Keep your code in version control (Git)
   - Tag releases
   - Document configuration changes

## Troubleshooting

### Build Failures

```bash
# Clear node_modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Authentication Issues

- Verify Supabase URL and anon key
- Check Site URL in Supabase settings
- Verify RLS policies are correct
- Check browser console for errors

### Database Connection Issues

- Verify environment variables
- Check Supabase project status
- Verify network connectivity
- Check rate limits

## Scaling Considerations

### Vertical Scaling
- Upgrade Supabase plan for more resources
- Optimize database queries
- Add database indexes where needed

### Horizontal Scaling
- Deploy to multiple regions
- Use CDN for static assets
- Implement caching layer
- Consider database read replicas

## Support and Updates

### Applying Updates

1. Pull latest code
2. Review CHANGELOG.md
3. Apply any new migrations
4. Test in staging environment
5. Build and deploy to production

### Rollback Procedure

1. Revert to previous Git tag
2. Rebuild application
3. Restore database from backup (if needed)
4. Deploy previous version

## Security Updates

- Monitor dependencies for vulnerabilities: `npm audit`
- Update packages regularly
- Apply Supabase security patches
- Review and update RLS policies as needed

## Compliance Considerations

- **Data Privacy**: Configure data retention policies
- **GDPR**: Implement user data export/deletion
- **Audit Logs**: Activity log tracks all changes
- **Access Control**: Use role-based permissions
- **Encryption**: Data encrypted in transit and at rest by Supabase
