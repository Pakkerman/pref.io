import { getShortLinkRecord } from "@/app/lib/db";

export default async function ShortPage({ params }) {
  const { short } = params;
  const [record] = await getShortLinkRecord(short);

  if (!record) {
    return <h1>NOTHING</h1>;
  }

  return (
    <>
      <pre>{JSON.stringify(record, null, 4)}</pre>
    </>
  );
}
