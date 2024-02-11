"use client";

import Image from "next/image";
import React, { useState } from "react";

function ImageWithFade(props: React.ComponentProps<typeof Image>) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
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
