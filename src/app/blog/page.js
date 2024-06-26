import getDomain from "@/app/lib/getDomain";
import Card from "@/app/blog/card";
import { helloWorld } from "@/app/lib/db";

async function getData() {
  // 1 endpoint - API?
  const domain = getDomain();
  const endpoint = `${domain}/api/posts`; // -> third party api request??
  // const res = await fetch(endpoint, {next: {revalidate: 10 }}) // HTTP GET
  const res = await fetch(endpoint, { cache: "no-store" }); // HTTP GET

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  if (res.headers.get("content-type") !== "application/json") {
    return { items: [] };
  }
  return res.json();
}

export default async function BlogPage() {
  // const data = await getData();
  // const items = data && data.items ? [...data.items] : [];

  const dbHello = await helloWorld();
  return (
    <main>
      <h1>Hello World</h1>
      <p>DB Response : {JSON.stringify(dbHello)}</p>
      <p>Posts:</p>
      {/* {items && */}
      {/*   items.map((item, idx) => { */}
      {/*     return ( */}
      {/*       <Card key={`post-${idx} `} title={item.title}> */}
      {/*         {item.title} */}
      {/*       </Card> */}
      {/*     ); */}
      {/*   })} */}
    </main>
  );
}

export const runtime = "edge";
export const preferredRegion = "sin1";
