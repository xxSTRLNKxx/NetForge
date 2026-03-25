# NetForge Installation Guide

NetForge is a self-hosted IT infrastructure management system with an easy web-based setup wizard.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd netforge
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the application**
```bash
npm start
```

4. **Complete setup**
- Open your browser to `http://localhost:3000`
- You'll automatically be redirected to the setup wizard
- Follow the on-screen instructions to:
  - Set your site name
  - Configure user registration settings
  - Create your admin account
  - Set session timeout preferences

5. **Start using NetForge!**
- After setup, you'll be able to log in with your admin account
- Begin managing your IT infrastructure

## Configuration

After installation, your configuration is stored in `config.json` at the project root. You can modify settings like:

- `siteName`: Your organization name
- `allowSignup`: Whether to allow new user registration
- `sessionTimeout`: Session duration in seconds
- `databasePath`: Location of your SQLite database

## Database

NetForge uses SQLite for data storage. The database file is created automatically during setup and stored at the path specified in your configuration (default: `./data/netforge.db`).

## Running in Production

For production deployments:

1. Build the application:
```bash
npm run build
```

2. Set up a process manager like PM2:
```bash
npm install -g pm2
pm2 start npm --name "netforge" -- start
pm2 save
pm2 startup
```

3. Configure a reverse proxy (nginx, Apache, etc.) to serve the application

## Backup

To backup your NetForge installation:

1. Copy `config.json`
2. Copy the SQLite database file (default: `./data/netforge.db`)

Store these files securely and restore them to recover your data.

## Updating

To update NetForge:

1. Backup your data (config.json and database)
2. Pull the latest changes
3. Install updated dependencies: `npm install`
4. Restart the application

## Troubleshooting

### Port already in use
If port 3000 is already in use, set the PORT environment variable:
```bash
PORT=8080 npm start
```

### Database locked
If you encounter database lock errors, ensure only one instance of NetForge is running.

### Reset installation
To reset and run the setup wizard again:
1. Stop the application
2. Delete `config.json`
3. Start the application again

## Support

For issues and questions, please visit the GitHub repository.
