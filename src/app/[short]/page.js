import { notFound, redirect } from "next/navigation";
import { getShortLinkRecord } from "@/app/lib/db";
import getDomain from "../lib/getDomain";

async function triggleVisit(linkId) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ linkId: linkId }),
  };

  const domain = getDomain();
  const endpoint = `${domain}/api/visits/`;

  return await fetch(endpoint, options);
}

export default async function ShortPage({ params }) {
  const { short } = params;
  if (!short) notfound();

  const [record] = await getShortLinkRecord(short);
  if (!record) notFound();

  const { url, id } = record;
  if (!url) notFound();

  if (id) await triggleVisit(id);

  return <h1>redirecting... {url}</h1>;
  // redirect(url, "push");
}
