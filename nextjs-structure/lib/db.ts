import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { createClient } from '@libsql/client/web';
import * as schema from './schema';

// For server-side rendering & API routes
let db: ReturnType<typeof drizzle>;

if (process.env.DATABASE_URL) {
  // When running on the server, we want to use the Neon connection
  if (typeof window === 'undefined') {
    try {
      // In production or non-WebSocket environments (like Vercel serverless)
      // we use the HTTP connection
      if (process.env.NODE_ENV === 'production') {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        db = drizzle(pool, { schema });
      } 
      // For development, we use WebSockets
      else {
        // This is a dynamic import which works better in Next.js
        const ws = require('ws');
        neonConfig.webSocketConstructor = ws;
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        db = drizzle(pool, { schema });
      }
    } catch (e) {
      console.error('Error initializing database connection:', e);
      throw new Error('Failed to initialize database connection');
    }
  }
}

export { db };