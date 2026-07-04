import { PrismaClient } from './src/generated/prisma/index.js';
import * as fs from 'fs';

const prisma = new PrismaClient({});

async function main() {
  console.log("Reading MySQL dump...");
  const sql = fs.readFileSync('database/cnmarkethub (6).sql', 'utf8');

  // Extract category insert block
  const categoryMatch = sql.match(/INSERT INTO `category`[\s\S]*?;/);
  if (categoryMatch) {
    let pgStmt = categoryMatch[0].replace(/`/g, '"').replace(/\\'/g, "''");
    // Replace boolean 1/0 before CreatedAt timestamp
    pgStmt = pgStmt.replace(/, 1, '202/g, ", true, '202");
    pgStmt = pgStmt.replace(/, 0, '202/g, ", false, '202");
    console.log("Found category insert, length:", pgStmt.length);
    try {
      await prisma.$executeRawUnsafe(pgStmt);
      console.log("Successfully inserted category data!");
    } catch (err) {
      console.error("Failed to execute category insert:", err.message);
    }
  } else {
    console.log("No category insert found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
