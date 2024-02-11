"use client";

import CircleBG from "@/assets/CircleBG.png";
import CircleFade from "@/assets/CircleFade.svg";
import CopyIcon from "@/assets/CopyIcon.svg";
import DownloadIcon from "@/assets/DownloadIcon.svg";
import XIcon from "@/assets/XIcon.svg";
import { useElementSize } from "@/hooks/useElementsSize";
import Image from "next/image";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import ImageWithFade from "@/components/ImageWithFade";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import domtoimage from "dom-to-image";
import axios from "axios";

const layerProperties = [
  {
    count: 1,
    avatarScale: 14,
    radius: 0,
  },
  {
    count: 8,
    avatarScale: 9,
    radius: 2.2,
  },
  {
    count: 16,
    avatarScale: 6.5,
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
  user: { name: string; login: string; avatar_url: string };
  scale: number;
}) => {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute rounded-full mix-blend-overlay"
        style={{
          height: `calc((var(--size) / 100 + .05rem) * ${props.scale} )`,
          width: `calc((var(--size) / 100 + .05rem) * ${props.scale} )`,
          background: "#EDE5FF",
        }}
      ></div>
      <div
        className="absolute overflow-hidden bg-white rounded-full"
        style={{
          height: `calc(var(--size) * ${props.scale} / 100 )`,
          width: `calc(var(--size) * ${props.scale} / 100 )`,
          background: "#EDE5FF",
        }}
      >
        <ImageWithFade
          src={props.user.avatar_url}
          alt={props.user.name}
          layout="fill"
        />
      </div>
    </div>
  );
};

function Page() {
  const [topFriends, setTopFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();
  const circleRef = useRef<HTMLButtonElement>(null);
  const dataFetchedRef = useRef(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username;
  const token = searchParams.get("token");
  const router = useRouter();

  console.log({ topFriends });
  // use memo to avoid re-rendering
  const circleData = useMemo(() => {
    return new Array(25).fill(0).map((_, index) => ({
      name: "The Octocat",
      login: "octocat",
      avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(
        Math.random() * 1000000
      )}?v=4`,
    }));
  }, []);

  // define layers based on available no of users
  let layers: {
    name: string;
    login: string;
    avatar_url: string;
  }[][] = [];

  circleData?.forEach((user, index) => {
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

  useEffect(() => {
    async function fetchData() {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      try {
        const headers = {
          headers: {
            Authorization: `bearer ${token}`,
          },
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
        debugger;
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

        setTopFriends(usersWithScores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateImage = async () => {
    if (circleRef.current) {
      const res = await domtoimage.toBlob(circleRef.current, { quality: 1 });
    }
  };

  console.log("topFriends", topFriends);

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
          (circleData ? (
            <div
              className="animate-fade relative flex items-center justify-center overflow-hidden rounded-3xl h-[var(--size)] w-[var(--size)]"
              style={
                {
                  "--size": size + "px",
                  boxShadow: "0px 4px 200px 0px rgba(200, 179, 250, 0.20)",
                } as CSSProperties
              }
            >
              <div className="absolute flex items-center justify-center w-full h-full">
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
                  className="absolute hidden"
                  height={(size * 3.25) / 4}
                  width={(size * 3.25) / 4}
                />

                {/* outline divs */}
                {layers.map((layer, layerIndex) => (
                  <div
                    key={layerIndex}
                    className="absolute rounded-full mix-blend-overlay"
                    style={{
                      height: `calc(var(--size) * ${layerProperties[layerIndex].radius} / 5 - 6px)`,
                      width: `calc(var(--size) * ${layerProperties[layerIndex].radius} / 5 - 6px)`,
                      background: "#EDE5FF88",
                      outline: "6px solid #EDE5FF",
                      boxShadow: "0px 4px 69.8px 5px rgba(237, 229, 255, 0.20)",
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
                      <UserImageCard user={user} scale={layer.avatarScale} />
                    </div>
                  ));
                })}
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

      <div>
        {topFriends.map((friend) => (
          <div key={friend.login}>
            <img src={friend.avatar_url} alt={friend.login} />
            <p>
              {friend.login} - Score: {friend.score}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
