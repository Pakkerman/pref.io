import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { LinksTable } from "./schema";
import { desc, eq } from "drizzle-orm";
import randomShortStrings from "./randomShortStrings";

const sql = neon(process.env.DATABASE_URL);
neonConfig.fetchConnectionCache = true;

const db = drizzle(sql);

export async function helloWorld() {
  const start = new Date();
  const [dbResponse] = await sql`SELECT NOW();`;
  const dbNow = dbResponse && dbResponse.now ? dbResponse.now : "";
  const end = new Date();
  return { dbNow: dbNow, latency: Math.abs(end - start) };
}

async function configureDatabase() {
  const dbResponse = await sql`CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"short" varchar(50),
	"create_at" timestamp DEFAULT now());`;

  await sql`CREATE UNIQUE INDEX IF NOT EXISTS "url_idx" ON "links" ((LOWER(url)));`;
}

configureDatabase().catch((err) => console.log("db configure error", err));

export async function addLink(url) {
  const short = randomShortStrings();
  const newLink = { url, short };

  let response = { message: `${url} is not valid, please try again` };
  let responseStatus = 400;
  try {
    response = await db.insert(LinksTable).values(newLink).returning();
    responseStatus = 201;
  } catch ({ name, message }) {
    console.log(`${name}: ${message}`);
    if (message.includes("duplicate")) {
      response = { message: `${url} has alread been added` };
    }
  }

  return { data: response, status: responseStatus };
}

export async function getLinks(limit, offset) {
  const lookupLimit = limit ? limit : 10;
  const lookupOffset = offset ? offset : 0;
  return await db
    .select()
    .from(LinksTable)
    .limit(lookupLimit)
    .offset(lookupOffset)
    .orderBy(desc(LinksTable.createAt));
}

export async function getShortLinkRecord(shortSlugValue) {
  return await db
    .select()
    .from(LinksTable)
    .where(eq(LinksTable.short, shortSlugValue));
}
