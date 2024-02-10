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
    <div className="flex items-center justify-between w-full pr-1">
      <Link href="/">
        <Image priority src={Logo} alt="Github Circle Logo" />
      </Link>
      <div className="flex items-center gap-8">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} target="_blank">
            <p className="text-slate-300">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header;
