import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Install better-sqlite3 then run a small script to create DB and migrate db.json
console.log("Installing better-sqlite3...");
execSync("npm install better-sqlite3@^8.4.0 --no-audit --no-fund", { stdio: "inherit" });

const { default: db } = await import("./db.js");
// db.js auto-initializes and will migrate data from db.json if present
console.log("Migration complete. SQLite DB created as data.sqlite");
