import { cookies } from "next/headers";
import Link from "next/link";

import { getUser, userCookieKey } from "../libs/session";

export default function Home() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get(userCookieKey);
  const user = getUser(userCookie?.value ?? "");
  console.log("user", user, userCookie);
  if (user) {
    return <a href={``}>user: {user}</a>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {<div className="text-3xl font-bold underline">github circles</div>}
      <Link href="/auth">
        <button className={""}>Login to Add</button>
      </Link>
    </main>
  );
}
