"use client";

import CircleBG from "@/assets/CircleBG.png";
import CircleFade from "@/assets/CircleFade.svg";
import CopyIcon from "@/assets/CopyIcon.svg";
import DownloadIcon from "@/assets/DownloadIcon.svg";
import XIcon from "@/assets/XIcon.svg";
import ImageWithFade from "@/components/ImageWithFade";
import { useElementSize } from "@/hooks/useElementsSize";
import { cookieSep, userCookieKey } from "@/libs/session";
import axios from "axios";
import html2canvas from "html2canvas";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const layerProperties = [
  {
    count: 1,
    avatarScale: 14,
    radius: 0,
  },
  {
    count: 8,
    avatarScale: 10,
    radius: 2.2,
  },
  {
    count: 16,
    avatarScale: 8,
    radius: 3.75,
  },
  // {
  //   count: 20,
  //   avatarScale: 5.5,
  //   radius: 4,
  // },
];

const cumulativeLayersCount = layerProperties.reduce<number[]>((acc, layer) => {
  if (acc.length > 0) {
    acc.push(acc[acc.length - 1] + layer.count);
  } else {
    acc = [layer.count];
  }
  return acc;
}, []);

interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
}

const UserImageCard = (props: {
  user: { login: string; avatar_url: string };
  scale: number;
}) => {
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={"relative flex items-center justify-center bg-white"}>
      <div
        className="absolute rounded-full opacity-80"
        style={{
          height: `calc((var(--size) / 100 + .05rem) * ${props.scale} )`,
          width: `calc((var(--size) / 100 + .05rem) * ${props.scale} )`,
          background: "#EDE5FF",
        }}
      ></div>
      <Link
        href={{
          pathname: `/${props.user.login}`,
          query: {
            token: searchParams.get("token"),
          },
        }}
        className="absolute overflow-hidden transition-all bg-white rounded-full cursor-pointer hover:opacity-80"
        style={{
          height: `calc(var(--size) * ${props.scale} / 100 )`,
          width: `calc(var(--size) * ${props.scale} / 100 )`,
          background: "#EDE5FF",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ImageWithFade
          src={props.user.avatar_url}
          alt={props.user.login}
          layout="fill"
        />
      </Link>
      {isHovered && (
        <div
          className={
            "absolute flex flex-col items-center break-words w-max animate-fade text-sm duration-75 bg-white bg-opacity-10 rounded-full p-0.5 px-2 z-10"
          }
          style={{
            top: `calc(var(--size) * ${props.scale} / 200 + .7rem)`,
          }}
        >
          <p>{props.user.login}</p>
        </div>
      )}
    </div>
  );
};

function Page() {
  const [circleData, setTopFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();
  const circleRef = useRef<HTMLDivElement>(null);
  const dataFetchedRef = useRef(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username;
  const token = searchParams.get("token");

  // define layers based on available no of users
  const layers = useMemo(() => {
    let layers: {
      login: string;
      avatar_url: string;
    }[][] = [];
    circleData
      ?.slice(0, cumulativeLayersCount[cumulativeLayersCount.length - 1])
      .forEach((user, index) => {
        // check for cumulative layers index
        let layerIndex = 0;
        for (let i = 0; i < cumulativeLayersCount.length; i++) {
          if (index < cumulativeLayersCount[i]) {
            layerIndex = i;
            break;
          }
        }
        if (!layers[layerIndex]) {
          layers[layerIndex] = [];
        }
        layers[layerIndex].push(user);
      });
    return layers;
  }, [circleData]);

  useEffect(() => {
    async function fetchData() {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      try {
        const headers = {
          headers: token
            ? {
                Authorization: `bearer ${token}`,
              }
            : {},
        };
        const followersResponse = await axios.get(
          `https://api.github.com/users/${username}/followers`,
          headers
        );
        const followingResponse = await axios.get(
          `https://api.github.com/users/${username}/following`,
          headers
        );
        const followers = followersResponse.data;
        const following = followingResponse.data;

        const followingSet = new Set(
          following.map((user: { login: string }) => user.login)
        );

        const prsResponse = await axios.get(
          `https://api.github.com/search/issues?q=type:pr+author:${username}`,
          headers
        );
        const issuesResponse = await axios.get(
          `https://api.github.com/search/issues?q=type:issue+author:${username}`,
          headers
        );
        const prs = prsResponse.data.items;
        const issues = issuesResponse.data.items;

        const starsResponse = await axios.get(
          `https://api.github.com/users/${username}/starred`,
          headers
        );
        const stars = starsResponse.data;

        const combinedUsers: any = {};
        following.forEach((user: { login: string }) => {
          combinedUsers[user.login] = { ...user, score: 1 };
        });
        followers.forEach((user: { login: string }) => {
          if (followingSet.has(user.login)) {
            combinedUsers[user.login].score += 2;
          } else {
            combinedUsers[user.login] = { ...user, score: 1 };
          }
        });

        prs.forEach((pr: { user: { login: string } }) => {
          if (combinedUsers[pr.user.login]) {
            combinedUsers[pr.user.login].score += 0.5;
          }
        });
        issues.forEach((issue: { user: { login: string } }) => {
          if (combinedUsers[issue.user.login]) {
            combinedUsers[issue.user.login].score += 0.5;
          }
        });
        stars.forEach((star: { owner: { login: string } }) => {
          if (combinedUsers[star.owner.login]) {
            combinedUsers[star.owner.login].score += 0.5;
          }
        });

        const usersWithScores = Object.values(combinedUsers).map(
          (user: any) => ({
            ...user,
            score: Math.min(user.score, user.score > 3 ? 3 : user.score),
          })
        );

        const sortedUsers = usersWithScores
          .sort((a, b) => b.score - a.score || b.followers - a.followers)
          .slice(0, 49);

        const cookie = decodeURIComponent(
          document.cookie
            .split("; ")
            .find((row) => row.startsWith(userCookieKey + "="))!
        )
          ?.split(cookieSep)[0]
          .split("=")[1];

        let userData = JSON.parse(cookie);
        userData.avatar_url = `https://avatars.githubusercontent.com/u/${userData.id}?v=4`;

        if (
          userData.login.toLowerCase() !== username.toString().toLowerCase()
        ) {
          // fetch userdata of the current user
          const userResponse = await axios.get(
            `https://api.github.com/users/${username}`,
            headers
          );

          const user = userResponse.data;
          userData = {
            login: user.login,
            avatar_url: user.avatar_url,
            score: 3,
          };
        }

        setTopFriends([userData, ...sortedUsers]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError(true);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateImage = async () => {
    if (circleRef.current) {
      // const res = await domtoimage.toBlob(circleRef.current, { quality: 1 });
      const canvas = await html2canvas(circleRef.current);
      const img = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = img;
      a.download = "github-circle.png";
      a.click();
    }
  };

  const copyImage = async () => {
    if (circleRef.current) {
      const canvas = await html2canvas(circleRef.current);
      const img = canvas.toDataURL("image/png");
      navigator.clipboard.writeText(img);
    }
  };

  const shareToTwitter = async () => {
    if (circleRef.current) {
      const canvas = await html2canvas(circleRef.current);
      const img = canvas.toDataURL("image/png");
      // https://twitter.com/intent/tweet/?text=&url=https%3A%2F%2Fcred.club%2Farticles%2Fbanking-is-now-open
      const url = `https://twitter.com/intent/tweet?text=Check out my GitHub Circle www.github-circle.xyz&url=${img}`;
      window.open(url, "_blank");
    }
  };

  const size = Math.min(width, height);
  return (
    <div
      className="grid items-center w-full h-full gap-6 px-4 pt-4"
      style={{
        gridTemplateRows: "1fr auto",
      }}
    >
      <div
        className="flex items-center justify-center w-full h-full"
        ref={containerRef}
      >
        {size > 0 &&
          (!loading ? (
            <>
              {circleData && !error && circleData.length != 0 ? (
                <div
                  className="animate-fade relative flex items-center justify-center overflow-hidden rounded-3xl h-[var(--size)] w-[var(--size)]"
                  style={
                    {
                      "--size": size + "px",
                      boxShadow: "0px 4px 200px 0px rgba(200, 179, 250, 0.20)",
                    } as CSSProperties
                  }
                >
                  <div
                    className="absolute flex items-center justify-center w-full h-full"
                    ref={circleRef}
                  >
                    <ImageWithFade
                      src={CircleFade}
                      alt="Circle Fade"
                      objectFit="cover"
                      className="absolute"
                      height={size}
                      width={size}
                    />
                    <ImageWithFade
                      src={CircleBG}
                      alt="Circle Background"
                      className="absolute"
                      height={(size * 3.25) / 4}
                      width={(size * 3.25) / 4}
                    />

                    {/* outline divs */}
                    {layers.map((layer, layerIndex) => (
                      <div
                        key={layerIndex}
                        className="absolute rounded-full opacity-60"
                        style={{
                          height: `calc(var(--size) * ${layerProperties[layerIndex].radius} / 5 + 6px)`,
                          width: `calc(var(--size) * ${layerProperties[layerIndex].radius} / 5 + 6px)`,
                          // background: "#EDE5FF88",
                          border: "6px solid #EDE5FF",
                          // boxShadow: "0px 4px 69.8px 5px rgba(237, 229, 255, 0.20)",
                        }}
                      />
                    ))}

                    {/* user cards */}
                    {layers.map((users, layerIndex) => {
                      const layer = layerProperties[layerIndex];
                      const count = users.length;
                      return users.map((user, index) => (
                        <div
                          key={index}
                          className="absolute"
                          style={{
                            transform: `rotate(${
                              (360 / count) * index
                            }deg) translate(0, calc(var(--size) * ${
                              layer.radius
                            } / 10)) rotate(${(360 / count) * -index}deg)`,
                            top: "50%",
                          }}
                        >
                          <UserImageCard
                            user={user}
                            scale={layer.avatarScale}
                          />
                        </div>
                      ));
                    })}
                  </div>
                </div>
              ) : (
                <div
                  className="relative flex items-center justify-center p-4 px-6 overflow-hidden animate-fade rounded-3xl"
                  style={
                    {
                      "--size": size + "px",
                      boxShadow: "0px 4px 200px 0px rgba(200, 179, 250, 0.40)",
                    } as CSSProperties
                  }
                >
                  Something went wrong, please try again later
                </div>
              )}
            </>
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
        >
          <Image src={DownloadIcon} alt="Download" width={20} height={20} />
        </button>
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={copyImage}
        >
          <Image src={CopyIcon} alt="Download" width={20} height={20} />
        </button>
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={shareToTwitter}
        >
          <Image src={XIcon} alt="Download" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}

export default Page;
