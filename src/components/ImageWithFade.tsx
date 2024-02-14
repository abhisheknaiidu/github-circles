"use client";

// import Image from "next/image";
import React, { useState } from "react";

function ImageWithFade(props: React.ComponentProps<any>) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      {...props}
      src={props.src}
      // onLoad={(event) => {
      //   setLoaded(true);
      //   if (props.onLoad) {
      //     props.onLoad(event);
      //   }
      // }}
      // className={
      //   `transition-opacity duration-300 ease-out ${
      //     loaded ? "opacity-100" : "opacity-0"
      //   }` + (props.className ? ` ${props.className}` : "")
      // }
      alt={props.alt}
    />
  );
}

export default ImageWithFade;
