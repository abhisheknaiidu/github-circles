"use client";

import CopyIcon from "@/assets/CopyIcon.svg";
import DownloadIcon from "@/assets/DownloadIcon.svg";
import XIcon from "@/assets/XIcon.svg";
import { useElementSize } from "@/hooks/useElementsSize";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const params = useParams();
  const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();

  const circleData = [
    {
      name: "The Octocat",
      login: "octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
    {
      name: "John Doe",
      login: "johndoe",
      avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
    },
    {
      name: "Jane Smith",
      login: "janesmith",
      avatar_url: "https://avatars.githubusercontent.com/u/789012?v=4",
    },
    {
      name: "Alice Johnson",
      login: "alicej",
      avatar_url: "https://avatars.githubusercontent.com/u/345678?v=4",
    },
    {
      name: "Bob Williams",
      login: "bobw",
      avatar_url: "https://avatars.githubusercontent.com/u/901234?v=4",
    },
    {
      name: "Charlie Brown",
      login: "charlieb",
      avatar_url: "https://avatars.githubusercontent.com/u/567890?v=4",
    },
    {
      name: "Eva Davis",
      login: "evad",
      avatar_url: "https://avatars.githubusercontent.com/u/112233?v=4",
    },
    {
      name: "Frank Martin",
      login: "frankm",
      avatar_url: "https://avatars.githubusercontent.com/u/445566?v=4",
    },
    {
      name: "Grace Taylor",
      login: "gracet",
      avatar_url: "https://avatars.githubusercontent.com/u/778899?v=4",
    },
    {
      name: "Henry Wilson",
      login: "henryw",
      avatar_url: "https://avatars.githubusercontent.com/u/990011?v=4",
    },
    {
      name: "Ivy White",
      login: "ivyw",
      avatar_url: "https://avatars.githubusercontent.com/u/223344?v=4",
    },
    {
      name: "Jack Harris",
      login: "jackh",
      avatar_url: "https://avatars.githubusercontent.com/u/556677?v=4",
    },
    {
      name: "Karen Miller",
      login: "karenm",
      avatar_url: "https://avatars.githubusercontent.com/u/112233?v=4",
    },
    {
      name: "Leo Thompson",
      login: "leot",
      avatar_url: "https://avatars.githubusercontent.com/u/334455?v=4",
    },
    {
      name: "Mia Garcia",
      login: "miag",
      avatar_url: "https://avatars.githubusercontent.com/u/667788?v=4",
    },
    {
      name: "Nathan Turner",
      login: "natet",
      avatar_url: "https://avatars.githubusercontent.com/u/112233?v=4",
    },
    {
      name: "Olivia Clark",
      login: "oliviac",
      avatar_url: "https://avatars.githubusercontent.com/u/112233?v=4",
    },
    {
      name: "Paul Reed",
      login: "paulr",
      avatar_url: "https://avatars.githubusercontent.com/u/112233?v=4",
    },
  ];

  console.log({ params });
  console.log({ circle: circleData });

  useEffect(() => {
    console.log({ width, height, min: Math.min(width, height) });
  }, [width, height]);
  return (
    <div
      className="grid items-center w-full h-full gap-4 px-4 "
      style={{
        gridTemplateRows: "1fr auto",
      }}
    >
      <div
        className="flex items-center justify-center w-full h-full "
        ref={containerRef}
      >
        {width &&
          height &&
          (circleData ? (
            <div className="relative flex items-center justify-center">
              <div className="opacity-20">
                <div
                  className="bg-black rounded-full animate-pulse bg-blend-overlay"
                  style={{
                    height: height + "px",
                    width: height + "px",
                  }}
                ></div>
              </div>
              <div className="absolute opacity-20">
                <div
                  className="bg-black rounded-full animate-pulse bg-blend-overlay"
                  style={{
                    animationDelay: ".5s",
                    height: height / 1.3 + "px",
                    width: height / 1.3 + "px",
                  }}
                />
              </div>
              <div className="absolute opacity-20">
                <div
                  className="bg-black rounded-full animate-pulse bg-blend-overlay"
                  style={{
                    animationDelay: ".7s",
                    height: height / 2 + "px",
                    width: height / 2 + "px",
                  }}
                />
              </div>
            </div>
          ) : (
            <>Draw Here</>
          ))}
      </div>
      <div className="flex items-center justify-center w-full gap-4">
        <button className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30">
          <Image src={DownloadIcon} alt="Download" width={20} height={20} />
        </button>
        <button className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30">
          <Image src={CopyIcon} alt="Download" width={20} height={20} />
        </button>
        <button className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30">
          <Image src={XIcon} alt="Download" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}

export default Page;
