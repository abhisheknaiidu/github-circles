"use client";

// import Image from "next/image";
import React, { useState } from "react";

function ImageWithFade(
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) {
  const [loaded, setLoaded] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={props.src}
      onLoad={(event) => {
        setLoaded(true);
        if (props.onLoad) {
          props.onLoad(event);
        }
      }}
      className={
        `transition-opacity duration-300 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }` + (props.className ? ` ${props.className}` : "")
      }
      alt={props.alt}
    />
  );
}

export default ImageWithFade;
