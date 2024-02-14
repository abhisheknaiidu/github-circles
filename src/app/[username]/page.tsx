"use client";

import CircleBG from "@/assets/CircleBG.png";
import CircleFade from "@/assets/CircleFade.svg";
import CopyIcon from "@/assets/CopyIcon.svg";
import DownloadIcon from "@/assets/DownloadIcon.svg";
import VanillaTilt from "vanilla-tilt";
import XIcon from "@/assets/XIcon.svg";
import ImageWithFade from "@/components/ImageWithFade";
import { useElementSize } from "@/hooks/useElementsSize";
import { cookieSep, userCookieKey } from "@/libs/session";
import axios from "axios";
import html2canvas from "html2canvas";
// import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { colord, extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import mixPlugin from "colord/plugins/mix";
import domtoimage from "dom-to-image";

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
  owner: User;
}

const UserImageCard = (props: {
  user: { login: string; avatar_url: string };
  scale: number;
}) => {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute rounded-full opacity-80"
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
          alt={props.user.login}
          layout="fill"
        />
      </div>
    </div>
  );
};

function Page() {
  const [circleData, setTopFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();
  const circleRef = useRef<HTMLDivElement>(null);
  const dataFetchedRef = useRef(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username;
  const token = searchParams.get("token");
  const tiltRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState("");

  const divRef = useRef(null);

  const convertToImage = () => {
    const node = divRef.current;

    domtoimage
      .toPng(node)
      .then((dataUrl) => {
        // Create a new image element
        const img = new Image();
        img.src = dataUrl;

        // Append the image to the document, or handle it as needed
        document.body.appendChild(img);
      })
      .catch((error) => {
        console.error("Error converting div to image:", error);
      });
  };
  extend([harmoniesPlugin]);
  extend([mixPlugin]);
  useEffect(() => {
    if (circleRef.current) {
      domtoimage
        .toPng(circleRef.current, { quality: 1 })
        .then((dataUrl) => {
          var img = new Image();
          img.src = dataUrl;

          document.body.appendChild(img);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }
    VanillaTilt.init(tiltRef.current!, {
      easing: "cubic-bezier(.17,.67,.83,.67)",
      glare: true,
      "glare-prerender": false,
      max: 10,
      "max-glare": 0.5,
      reset: true,
      scale: 1.1,
      speed: 300,
      transition: true,
    });
  }, [circleRef]);

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

  const seededRandom = (seed: number) => {
    return function () {
      // A simple LCG algorithm parameters
      const a = 1664525;
      const c = 1013904223;
      const m = 4294967296; // 2^32
      seed = (a * seed + c) % m;
      return seed / m;
    };
  };

  const shuffleArray = (array: any) => {
    const random = seededRandom(123456);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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

        const starsResponse = await axios.get(
          `https://api.github.com/users/${username}/starred`,
          headers
        );

        const stars = starsResponse.data
          ?.map((user: User) => user.owner)
          ?.slice(0, 12);

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

        const usersWithScores = Object.values(combinedUsers).map(
          (user: any) => ({
            ...user,
            score: Math.min(user.score, user.score > 3 ? 3 : user.score),
          })
        );

        const sortedUsers = usersWithScores.sort(
          (a, b) => b.score - a.score || b.followers - a.followers
        );

        const combinedNewUsers = sortedUsers?.slice(0, 12);
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

        const finalUsers = [
          ...shuffleArray(combinedNewUsers),
          ...shuffleArray(stars),
        ].slice(0, 24);

        setTopFriends([userData, ...finalUsers]);
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
      // // const res = await domtoimage.toBlob(circleRef.current, { quality: 1 });
      // const canvas = await html2canvas(circleRef.current);
      // const img = canvas.toDataURL("image/png");
      // const a = document.createElement("a");
      // a.href = img;
      // a.download = "github-circle.png";
      // a.click();
      if (circleRef.current) {
        domtoimage
          .toPng(circleRef.current, { quality: 0.95 })
          .then(function (dataUrl) {
            var link = document.createElement("a");
            link.download = "my-image-name.jpeg";
            link.href = dataUrl;
            link.click();
          });
      }
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
      const url = `https://twitter.com/intent/tweet?text=Check`;
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    const [e, a] = colord(bgColor).harmonies("double-split-complementary");
    const o = [e, a].map((i) => {
      const l = i.shades(9),
        b = i.tints(3);
      return [l[2], b[1], l[4]].map((q) => q.toRgbString());
    });

    console.log(o);
    const generatedColors = {
      alphaVersion: e.alpha(0.5).toRgbString(),
      baseColor: bgColor,
      baseWithAlpha: colord(bgColor).alpha(0.8).toRgbString(),
      harmony1: o[0],
      harmony2: o[1],
    };

    console.log(tiltRef);

    // [e,a] = c(r).harmonies("double-split-complementary")
    // , o = [e, a].map(i=>{
    //   const l = i.shades(9)
    //     , b = i.tints(3);
    //   return [l[2], b[1], l[4]].map(q=>q.toRgbString())

    // tiltRef.current.style.setProperty(
    //   "--highlight",
    //   generatedColors.harmony2[2]
    // );
    // tiltRef.current.style.setProperty("--text", generatedColors.harmony2[2]);
  }, [bgColor]);

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
        <div
          className="flex items-center justify-center overflow-hidden rounded-3xl h-[var(--size)] w-[var(--size)]"
          ref={tiltRef}
          style={{
            "--background": bgColor,
            "--centerGradient":
              "rgb(42, 159, 109),rgb(169, 238, 201),rgb(36, 103, 72)",
          }}
        >
          {size > 0 &&
            (!loading && circleData ? (
              <div
                className="animate-fade relative flex items-center justify-center overflow-hidden rounded-3xl h-[var(--size)] w-[var(--size)]"
                ref={tiltRef}
                style={
                  {
                    "--size": size + "px",
                    background:
                      "radial-gradient(73.53% 52.65% at 50% 51.96%,var(--centerGradient) 0,rgba(87,205,255,0) 100%) var(--background)",
                    border: `1px solid var(--background)}`,

                    boxShadow: "0px 4px 200px 0px rgba(200, 179, 250, 0.20)",
                  } as CSSProperties
                }
              >
                <div
                  className="absolute flex items-center justify-center w-full h-full"
                  ref={circleRef}
                >
                  {/* outline divs */}
                  {layers.map((layer, layerIndex) => (
                    <div
                      key={layerIndex}
                      className="absolute rounded-full opacity-60"
                      style={{
                        height: `calc(var(--size) * ${layerProperties[layerIndex].radius} / 5 + 6px)`,
                        width: `calc(var(--size) * ${layerProperties[layerIndex].radius} / 5 + 6px)`,
                        border: "6px solid #fff",
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
      </div>
      <div className="flex items-center justify-center w-full gap-4 animate-fade">
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={generateImage}
        >
          <img src={DownloadIcon} alt="Download" width={20} height={20} />
        </button>
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={copyImage}
        >
          <img src={CopyIcon} alt="Download" width={20} height={20} />
        </button>
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={shareToTwitter}
        >
          <img src={XIcon} alt="Download" width={20} height={20} />
        </button>
        <input type="color" onChange={(e) => setBgColor(e.target.value)} />
      </div>

      <div>
        <div
          ref={divRef}
          style={{
            border: "1px solid #000",
            padding: "20px",
            margin: "20px 0",
          }}
        >
          This div will be converted to an image.
        </div>
        <button onClick={convertToImage}>Convert to Image</button>
      </div>
    </div>
  );
}

export default Page;
