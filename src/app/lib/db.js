import { neon, neonConfig } from "@neondatabase/serverless";
import { desc, eq, sql as sqld } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { getSessionUser } from "@/app/lib/session";
import randomShortStrings from "./randomShortStrings";
import * as schema from "./schema";
import { LinksTable, VisitsTable } from "./schema";

const sql = neon(process.env.DATABASE_URL);
neonConfig.fetchConnectionCache = true;

const db = drizzle(sql, { schema });

export async function helloWorld() {
  const start = new Date();
  const [dbResponse] = await sql`SELECT NOW();`;
  const dbNow = dbResponse && dbResponse.now ? dbResponse.now : "";
  const end = new Date();
  return { dbNow: dbNow, latency: Math.abs(end - start) };
}

async function configureDatabase() {
  sql`CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"short" varchar(50),
	"user_id" integer,
	"created_at" timestamp DEFAULT now());`;

  sql`CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(75) NOT NULL,
	"password" text NOT NULL,
	"email" text,
	"created_at" timestamp DEFAULT now());`;

  sql`CREATE TABLE IF NOT EXISTS "visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"link_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now());`;

  sql`CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" ("username");--> statement-breakpoint
      DO $$ BEGIN
      ALTER TABLE "links" ADD CONSTRAINT "links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
      WHEN duplicate_object THEN null;
      END $$;`;

  sql`DO $$ BEGIN
      ALTER TABLE "visits" ADD CONSTRAINT "visits_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
      WHEN duplicate_object THEN null;
      END $$;`;
}

configureDatabase().catch((err) => console.log("db configure error", err));

export async function addLink(url) {
  const short = randomShortStrings();
  const user = await getSessionUser();
  const newLink = { url, short };

  if (user) {
    newLink["userId"] = user;
  }

  console.log(newLink);

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
    .orderBy(desc(LinksTable.createdAt));
}

export async function getShortLinkRecord(shortSlugValue) {
  return await db
    .select()
    .from(LinksTable)
    .where(eq(LinksTable.short, shortSlugValue));
}

export async function saveLinkVisit(linkIdValue) {
  return await db.insert(VisitsTable).values({ linkId: linkIdValue });
}

export async function getMinLinksVisits(limit = 10, offset = 0) {
  return await db.query.LinksTable.findMany({
    limit,
    offset,
    orderBy: [desc(LinksTable.createdAt)],
    columns: {
      userId: true,
      url: true,
      short: true,
      createAt: true,
    },
    with: {
      visits: {
        columns: {
          createAt: true,
        },
      },
    },
    extras: {
      count: sqld`count(${VisitsTable.id})`.as("count"),
    },
  });
}
