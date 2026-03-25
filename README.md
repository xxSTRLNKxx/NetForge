# NetForge - IT Infrastructure Management System

A modern IT infrastructure management platform built with React, TypeScript, Vite, and Supabase.

## Quick Start

### Running in Development Mode

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Environment Variables

The `.env` file is already configured with Supabase credentials.

## Troubleshooting

If you see "Cannot GET /", try:
1. Stopping the preview
2. Running `npm run build`
3. Restarting the preview

The app requires the dev server to be running (`npm run dev`).
