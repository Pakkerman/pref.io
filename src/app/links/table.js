import { getLinks } from "@/app/lib/db";

export default async function LinksHTMLTable() {
  const linksResponse = await getLinks();
  return (
    <div>
      <h1>Links List</h1>
      <ul>
        {linksResponse &&
          linksResponse.map((item, idx) => (
            <li key={`link-${idx}`}>
              <p>{item.id}</p>
              <p>{item.url}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
