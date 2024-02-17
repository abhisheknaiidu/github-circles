"use client";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { toPng } from "html-to-image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import CopyIcon from "@/assets/CopyIcon.svg";
import DownloadIcon from "@/assets/DownloadIcon.svg";
import XIcon from "@/assets/XIcon.svg";
import LinkedInIcon from "@/assets/LinkedInIcon.svg";
import VanillaTilt from "vanilla-tilt";
import ImageWithFade from "@/components/ImageWithFade";
import { useElementSize } from "@/hooks/useElementsSize";
import { cookieSep, userCookieKey } from "@/libs/session";
import { isSafari } from "@/utils";

const sharableContent = {
  twitter: `discover who's in your GitHub circle!
check out this cool tool to visualize your GitHub interactions and here's mine :)
`,
  linkedin: `🚀 Exciting News! Just discovered this amazing tool - GitHub Circle Generator! 🌀✨

Generate your personalized GitHub circle at GitHub Circle and showcase your repositories in a creative way! 🖥️🔗
  
👉 Download Your GitHub Circle Now!
  
Spread the word by sharing this post and let your network experience the fun too! 🌐`,
};

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
  owner: User;
}

const UserImageCard = (props: {
  user: { login: string; avatar_url: string };
  scale: number;
}) => {
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={"relative flex items-center justify-center"}>
      <div
        className="absolute bg-opacity-100 rounded-full"
        style={{
          height: `calc((var(--size) / 100 + .05rem) * ${props.scale} )`,
          width: `calc((var(--size) / 100 + .05rem) * ${props.scale} )`,
          background: "#EDE5FF",
          mixBlendMode: "overlay",
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
          style={{
            height: `calc(var(--size) * ${props.scale} / 100 )`,
            width: `calc(var(--size) * ${props.scale} / 100 )`,
          }}
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
  const [error, setError] = useState("");
  const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();
  const circleRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const dataFetchedRef = useRef(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username;
  const token = searchParams.get("token");
  const [bgColor, setBgColor] = useState("");

  const circleRect = circleRef.current?.getBoundingClientRect();
  const dockRect = dockRef.current?.getBoundingClientRect();
  const dockAdjustmentStyle = {
    transform:
      dockRect && circleRect && dockRect.top - circleRect.bottom > 40
        ? `translateY(${circleRect.bottom - dockRect.top + 30}px)`
        : "translateY(0)",
  };

  useEffect(() => {
    // enable only for desktop
    if (window.innerWidth < 768) return;

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
  }, []);

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

        const stars = starsResponse.data?.map((user: User) => user.owner);

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

        let userData: any;
        if (cookie) {
          userData = JSON.parse(cookie);
          userData.avatar_url = `https://avatars.githubusercontent.com/u/${userData.id}?v=4`;
        }

        if (
          userData?.login?.toLowerCase() !== username.toString().toLowerCase()
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

        // shouldnt contain same users
        const finalUsers = [
          ...shuffleArray(combinedNewUsers),
          ...shuffleArray(stars),
        ]
          // filter out duplicate users and the userData
          .filter(
            (user: User, index: number, self: User[]) =>
              index === self.findIndex((t) => t.login === user.login) &&
              user.login.toLowerCase() !== userData.login.toLowerCase()
          )
          .slice(0, 24);

        setTopFriends([userData, ...finalUsers]);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error.response?.status, error);
        setLoading(false);
        if (error.response?.status === 403) {
          setError(
            "Rate limit exceeded, please login using github to generate the circle"
          );
        } else {
          setError("TRUE");
        }
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateImage = useCallback(() => {
    if (circleRef.current === null) {
      return;
    }

    if (isSafari()) {
      return new Promise((resolve, reject) => {
        if (circleRef.current === null) {
          return;
        }
        toPng(circleRef.current, { cacheBust: true, quality: 4000 / size })
          .then(function (dataURL1) {
            let link: any = document.createElement("a");
            link.download = "github-circle-1.png"; // Corrected file extension
            link.href = dataURL1;
            // link.click();
            if (circleRef.current === null) {
              return;
            }
            return toPng(circleRef.current, { quality: 4000 / size });
          })
          .then(function (dataURL2) {
            let link: any = document.createElement("a");
            link.download = "github-circle-2.png" ?? ""; // Corrected file extension
            link.href = dataURL2;
            // link.click();

            if (circleRef.current === null) {
              return;
            }
            return toPng(circleRef.current, { quality: 4000 / size });
          })
          .then(function (dataURL3) {
            let link: any = document.createElement("a");
            link.download = "github-circle.png"; // Corrected file extension
            link.href = dataURL3;
            link.click();
            resolve(dataURL3); // Resolve the promise with the last image's data URL
          })
          .catch((err) => {
            reject(err); // Reject the promise if there's an error
          });
      });
    } else {
      toPng(circleRef.current, { cacheBust: true, quality: 4000 / size })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "github-circle.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [circleRef]);

  const shareToTwitter = () => {
    const url = `https://githubcircles.xyz/${username}?${Math.floor(
      Math.random() * 1000
    ).toString(16)}=1`;
    // const url = `https://githubcircles.xyz/${username}?${Math.floor(Math.random() * 1000)}`;
    const text = sharableContent.twitter;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${url}`;
    window.open(twitterUrl, "_blank");
  };

  const shareToLinkedin = () => {
    const url = `https://githubcircles.xyz/${username}`;
    const text = sharableContent.linkedin;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encodeURIComponent(
      text
    )}`;
    window.open(linkedinUrl, "_blank");
  };

  const size = Math.min(width, height) ? Math.min(width, height) - 20 : 0;
  return (
    <div
      className="grid items-center w-full h-full gap-6 pt-4 md:px-4"
      style={{
        gridTemplateRows: "1fr auto",
      }}
    >
      <div
        className="flex items-center justify-center w-auto h-full ml-[-1rem] mr-[-1rem]"
        ref={containerRef}
      >
        <div
          className="flex items-center justify-center overflow-hidden rounded-3xl h-[var(--size)] w-[var(--size)]"
          ref={tiltRef}
          style={
            {
              "--background": bgColor,
              "--centerGradient":
                "rgb(42, 159, 109),rgb(169, 238, 201),rgb(36, 103, 72)",
            } as CSSProperties
          }
        >
          {size > 0 &&
            (!loading ? (
              <>
                {circleData && !error && circleData.length != 0 ? (
                  <div
                    className="animate-fade relative flex items-center justify-center overflow-hidden h-[var(--size)] w-[var(--size)]"
                    ref={circleRef}
                    style={
                      {
                        "--size": size + "px",
                        background:
                          "radial-gradient(73.53% 52.65% at 50% 51.96%,var(--centerGradient) 0,rgba(87,205,255,0) 100%) var(--background)",
                        border: `1px solid var(--background)}`,
                        boxShadow:
                          "0px 4px 200px 0px rgba(200, 179, 250, 0.20)",
                      } as CSSProperties
                    }
                  >
                    <div className="absolute flex items-center justify-center w-full h-full">
                      {!bgColor && (
                        <>
                          <ImageWithFade
                            src={"CircleFade.jpg"}
                            alt="Circle Fade"
                            className="absolute"
                            height={size}
                            width={size}
                            style={{
                              filter: "contrast(1.1) brightness(1)",
                            }}
                          />
                          <ImageWithFade
                            src={"CircleBG.webp"}
                            alt="Circle Background"
                            className="absolute opacity-50 blur-md"
                            height={(size * 3.25) / 4}
                            width={(size * 3.25) / 4}
                            style={
                              {
                                // filter: "contrast(1.5) brightness(1)",
                              }
                            }
                          />
                        </>
                      )}

                      {/* outline divs */}
                      {layers.map((layer, layerIndex) => (
                        <div
                          key={layerIndex}
                          className="absolute bg-white rounded-full bg-opacity-60 mix-blend-overlay opacity-60"
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
                    className="relative flex items-center justify-center p-3 px-6 overflow-hidden bg-[#00000033] shadow-2xl animate-fade rounded-3xl"
                    style={{
                      boxShadow: "0px 4px 200px 0px rgba(200, 179, 250, 0.40)",
                    }}
                  >
                    <p>
                      {error === "TRUE"
                        ? "Something went wrong, please try again later"
                        : error}
                    </p>
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
      </div>
      <div
        className="flex items-center justify-center w-full gap-4 animate-fade"
        ref={dockRef}
      >
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={generateImage}
          style={dockAdjustmentStyle}
        >
          <NextImage src={DownloadIcon} alt="Download" width={20} height={20} />
        </button>
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={shareToTwitter}
          style={dockAdjustmentStyle}
        >
          <NextImage src={XIcon} alt="Download" width={20} height={20} />
        </button>
        <button
          className="p-3 transition-all bg-black rounded-full backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onClick={shareToLinkedin}
          style={dockAdjustmentStyle}
        >
          <NextImage src={LinkedInIcon} alt="Download" width={20} height={20} />
        </button>
        <input
          type="color"
          className="w-16 p-3 px-4 transition-all bg-black rounded-full h-11 backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30"
          onChange={(e) => setBgColor(e.target.value)}
          style={dockAdjustmentStyle}
          defaultValue={"#8E7AB5"}
        />
      </div>
    </div>
  );
}

export default Page;
