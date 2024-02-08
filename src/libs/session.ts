export const userCookieKey = "_un";
export const cookieSep = "^)&_*($";

export function getSession(userCookie: string) {
  const none = [null, null];
  const value = decodeURIComponent(userCookie);
  if (!value) return none;
  const index = value.indexOf(cookieSep);
  if (index === -1) return none;
  const user = value.slice(0, index);
  const session = value.slice(index + cookieSep.length);
  return [user, session];
}

export function getUser(userCookie: string) {
  return getSession(userCookie)[0];
}
