"use client";

import Link from "next/link";
import { useState } from "react";
const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_DEFAULT_TOKEN;

function UsernameInput() {
  const [username, setUsername] = useState("");
  return (
    <div
      className="flex items-center w-full gap-4 p-3 text-lg transition-all bg-black rounded-full opacity-0 max-w-[30rem] wfiflex backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 text-slate-200 animate-fade animation-delay-75"
      style={{
        animationFillMode: "forwards",
      }}
    >
      <input
        type="text"
        placeholder="enter your GitHub username "
        className="w-full mx-3 bg-transparent border-none outline-none"
        name="gh-username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Link
        className="px-5 py-2 text-black rounded-full bg-slate-200 hover:bg-slate-300"
        href={{
          pathname: `/${username}`,
          query: {
            token: DEFAULT_TOKEN,
          },
        }}
      >
        Generate
      </Link>
    </div>
  );
}

export default UsernameInput;
