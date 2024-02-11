"use client";

import BackgroundImage from "@/assets/bg.png";
import StarsImage from "@/assets/stars.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function Background() {
  const pathname = usePathname();

  return (
    <div className="absolute top-0 left-0 z-[-1] w-full h-full overflow-hidden">
      <Image
        className={
          "object-left-top w-full transition-all duration-700" +
          (pathname === "/" ? " -translate-y-[16vw]" : " -translate-y-[33%]")
        }
        style={{
          minHeight:
            pathname === "/" ? "calc(100% + 16vw)" : "calc(200%)",
          transitionTimingFunction: "cubic-bezier(.15,.47,.27,.99)",
        }}
        priority
        src={BackgroundImage}
        alt="background"
      />
      <Image
        className={
          "absolute top-0 left-0 w-full h-fit transition-all ease-slow duration-700" +
          (pathname === "/" ? " -translate-y-[30vw]" : " -translate-y-[25vw]")
        }
        priority
        src={StarsImage}
        alt="stars"
      />
    </div>
  );
}

export default Background;
