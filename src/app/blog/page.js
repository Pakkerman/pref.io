async function getData() {
  // endpoint
  // const endpoint = "http://localhosts:3000/api/posts";
  // const res = await fetch(endpoint);
  //
  // if (!res.ok) {
  //   throw new Error("Failed to fetch data");
  // }
  //
  // return res.json();
  return { items: [] };
}
export default async function BlogPage() {
  const data = await getData();
  const items = data && data.items ? [...data.items] : [];

  return (
    <main>
      <h1> Hello Blog</h1>

      {data &&
        items.map((item, idx) => {
          return <li key={`post-${idx}`}>{item.title}</li>;
        })}
    </main>
  );
}
