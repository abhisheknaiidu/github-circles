import Logo from "@/assets/Logo.svg";
import Image from "next/image";
import Link from "next/link";

const LINKS = [
  {
    href: "https://github.com/abhisheknaiidu/github-circles",
    label: "Contribute",
  },
  {
    href: "https://github.com/abhisheknaiidu/github-circles#getting-started",
    label: "About",
  },
];

function Header() {
  return (
    <div className="flex items-center justify-between w-full md:pr-1">
      <Link href="/">
        <Image
          priority
          src={Logo}
          alt="Github Circle Logo"
          className="h-10 md:h-12 w-fit"
        />
      </Link>
      <div className="flex items-center gap-8 ">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} target="_blank">
            <p className="text-sm text-slate-300 md:text-base">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header;
