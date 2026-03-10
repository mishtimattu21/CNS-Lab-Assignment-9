// Supabase (PostgreSQL) database config
// Use DATABASE_URL from Supabase: Project Settings → Database → Connection string (URI)
// Or set individual values (e.g. for local Postgres)

module.exports = {
  // Full connection URL from Supabase dashboard (recommended)
  DATABASE_URL: process.env.DATABASE_URL,

  // Or use these when DATABASE_URL is not set
  HOST: process.env.DB_HOST || "db.xxxxxxxxxxxx.supabase.co",
  PORT: process.env.DB_PORT || 5432,
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "postgres",
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.DB_SSL !== "false" ? { require: true, rejectUnauthorized: false } : false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
