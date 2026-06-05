const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Ensure database directory exists
const dbDir = path.resolve("./database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = createClient({
  url: process.env.DB_PATH || "file:./database/vehicles.db",
});

console.log("✅ SQLite (libsql) database connected!");

const run = async (sql, params = []) => {
  const result = await db.execute({ sql, args: params });
  return { lastID: result.lastInsertRowid, changes: result.rowsAffected };
};

const get = async (sql, params = []) => {
  const result = await db.execute({ sql, args: params });
  return result.rows[0] || null;
};

const all = async (sql, params = []) => {
  const result = await db.execute({ sql, args: params });
  return result.rows;
};

module.exports = { run, get, all };
