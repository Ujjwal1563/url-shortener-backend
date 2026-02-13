import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { eq, and } from "drizzle-orm";

export async function shortenUrl({ url, shortCode, userId }) {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetURL: url,
      userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return result;
}
export async function getAllCodes(userId){
  const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, userId));
  return codes;
}

export async function redirectToUrl(code){
  const [result] = await db
    .select({ targetURL: urlsTable.targetURL })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));
  if (!result) {
    return null;
  }
  return result.targetURL;
}
export async function deleteUrl(id, userId){
   const result = await db.delete(urlsTable).where(and(
      eq(urlsTable.id , id ),
      eq(urlsTable.userId, userId)
    ));
   return result;
}

export async function updateCode(id, userId, code ){
  const result = await db
    .update(urlsTable)
    .set({ shortCode: code })
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)));
  return result
}