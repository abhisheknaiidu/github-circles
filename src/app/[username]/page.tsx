"use client";

import CircleBG from "@/assets/CircleBG.png";
import CircleFade from "@/assets/CircleFade.svg";
import CopyIcon from "@/assets/CopyIcon.svg";
import DownloadIcon from "@/assets/DownloadIcon.svg";
import XIcon from "@/assets/XIcon.svg";
import { useElementSize } from "@/hooks/useElementsSize";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CSSProperties, useEffect, useRef } from "react";
import domtoimage from "dom-to-image";

const UserImageCard = (props: {
  user: { name: string; login: string; avatar_url: string };
  scale: number;
}) => {
  return (
    <div
      className="absolute p-2 rounded-full"
      style={{
        height: `calc(var(--size) * ${props.scale} / 100)`,
        width: `calc(var(--size) * ${props.scale} / 100)`,
        background: "#EDE5FF",
      }}
    >
      <div className="absolute w-full h-full overflow-hidden">
        <Image
          src={props.user.avatar_url}
          alt={props.user.name}
          // width={props.size}
          // height={props.size}
          layout="fill"
          className="rounded-full"
        />
      </div>
    </div>
  );
};

function Page() {
  const params = useParams();
  const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();
  const circleRef = useRef<HTMLButtonElement>(null);

  const circleData = {
    user: {
      name: "Frank Martin",
      login: "frankm",
      avatar_url: "https://avatars.githubusercontent.com/u/445567?v=4",
    },
    connections: [
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
    ],
  };

  const generateImage = async () => {
    if (circleRef.current) {
      console.log(circleRef.current);
      const res = await domtoimage.toBlob(circleRef.current, { quality: 1 });
      console.log(res);
    }
  };

  const size = Math.min(width, height);
  return (
    <div
      className="grid items-center w-full h-full gap-6 px-4"
      style={{
        gridTemplateRows: "1fr auto",
      }}
    >
      <div
        className="flex items-center justify-center w-full h-full animate-fade"
        ref={containerRef}
      >
        {size &&
          (circleData ? (
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-3xl h-[var(--size)] w-[var(--size)]"
              style={
                {
                  "--size": size + "px",
                  boxShadow: "0px 4px 200px 0px rgba(200, 179, 250, 0.20)",
                } as CSSProperties
              }
            >
              <div className="absolute flex items-center justify-center w-full h-full">
                <Image
                  src={CircleFade}
                  alt="Circle Fade"
                  objectFit="cover"
                  className="absolute"
                  height={size}
                  width={size}
                />
                <Image
                  src={CircleBG}
                  alt="Circle Background"
                  className="absolute"
                  height={(size * 3.25) / 4}
                  width={(size * 3.25) / 4}
                />
                <div
                  className="absolute rounded-full mix-blend-overlay"
                  style={{
                    height: "calc(var(--size) * 3 / 4)",
                    width: "calc(var(--size) * 3 / 4)",
                    background: "#EDE5FF88",
                    outline: "6px solid #EDE5FF",
                    boxShadow: "0px 4px 69.8px 5px rgba(237, 229, 255, 0.20)",
                  }}
                />
                <div
                  className="absolute rounded-full mix-blend-overlay"
                  style={{
                    height: "calc(var(--size) * 2 / 5)",
                    width: "calc(var(--size) * 2 / 5)",
                    background: "gba(237, 229, 255, 0.30)",
                    outline: "6px solid #EDE5FF",
                    boxShadow: "0px 4px 69.8px 5px rgba(237, 229, 255, 0.20)",
                  }}
                />
                <UserImageCard user={circleData.user} scale={12} />
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="opacity-20">
                <div
                  className="bg-black rounded-full animate-pulse bg-blend-overlay"
                  style={{
                    height: size + "px",
                    width: size + "px",
                  }}
                ></div>
              </div>
              <div className="absolute opacity-20">
                <div
                  className="bg-black rounded-full animate-pulse bg-blend-overlay"
                  style={{
                    animationDelay: ".5s",
                    height: size / 1.3 + "px",
                    width: size / 1.3 + "px",
                  }}
                />
              </div>
              <div className="absolute opacity-20">
                <div
                  className="bg-black rounded-full animate-pulse bg-blend-overlay"
                  style={{
                    animationDelay: ".7s",
                    height: size / 2 + "px",
                    width: size / 2 + "px",
                  }}
                />
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center justify-center w-full gap-4 animate-fade">
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={generateImage}
          ref={circleRef}
        >
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
