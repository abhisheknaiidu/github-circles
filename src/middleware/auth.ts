import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { cookieSep, userCookieKey } from "../libs/session";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GITHUB_SECRET;

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { searchParams } = nextUrl;
  const query = Object.fromEntries(searchParams);
  const { code } = query;

  // When there's no `code` param specified,
  // it's a GET from the client side.
  // We go with the login flow.
  if (!code) {
    // Login with GitHub
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&allow_signup=false`;
    return NextResponse.redirect(redirectUrl);
  }

  let token = "";
  let accessToken;
  try {
    const data = await (
      await fetch("https://github.com/login/oauth/access_token", {
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();

    accessToken = data.access_token;

    // Let's also fetch the user info and store it in the session.
    if (accessToken) {
      const userInfo = await (
        await fetch("https://api.github.com/user", {
          headers: {
            Accept: "application/json",
            Authorization: `token ${accessToken}`,
          },
          method: "GET",
        })
      ).json();

      token = userInfo.login;
    }
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { message: err.toString() },
      {
        status: 500,
      }
    );
  }

  if (!token) {
    return NextResponse.json(
      { message: "Github authorization failed" },
      {
        status: 400,
      }
    );
  }

  const user = {
    name: token,
  };

  const url = req.nextUrl.clone();
  url.searchParams.delete("code");
  url.pathname = `/${user.name}`;
  url.searchParams.append("token", accessToken);

  const res = NextResponse.redirect(url);

  res.cookies.set(userCookieKey, `${user.name}${cookieSep}; Secure; HttpOnly`);

  return res;
}
