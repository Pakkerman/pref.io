import { getSessionUser } from "@/app/lib/session";

export default async function Home() {
  const user = await getSessionUser(1);
  console.log(user);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <pre>{user || "no user"}</pre>
      <h1>pref.io is coming soon!</h1>
    </main>
  );
}
