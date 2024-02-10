import GitHubIcon from "@/assets/GitHubIcon.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // const cookieStore = cookies();
  // const userCookie = cookieStore.get(userCookieKey);
  // const user = getUser(userCookie?.value ?? "");
  // console.log("user", user, userCookie);
  // if (user) {
  //   return <a href={``}>user: {user}</a>;
  // }

  return (
    <main className="flex flex-col items-center justify-center h-full gap-6 p-4 pb-12 min-8">
      <div className="text-[4rem] leading-[5.2rem] font-semibold tracking-tighter text-center md:leading-[6.8rem] md:text-[5.75rem] animate-fade">
        Generate
        <br />
        GitHub Circle
      </div>
      <Link
        href="/auth"
        className="flex items-center justify-center gap-4 p-3 px-6 text-lg transition-all bg-black rounded-full opacity-0 backdrop-blur-sm bg-opacity-20 w-fit hover:bg-opacity-30 text-slate-200 animate-fade animation-delay-75"
        style={{
          animationFillMode: "forwards",
        }}
      >
        <Image src={GitHubIcon} alt="GitHub" width={20} height={20} />
        {"Login with Github"}
      </Link>
      <p
        className="text-center text-slate-300 max-w-[34rem] font-light opacity-0 animate-fade animation-delay-200"
        style={{
          animationFillMode: "forwards",
        }}
      >
        Transform your GitHub connections into captivating circle image. Craft a
        unique representation of your coding journey and standout collaborators
        in your projects.
      </p>
    </main>
  );
}
