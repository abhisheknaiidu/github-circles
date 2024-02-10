import BackgroundImage from "@/assets/bg.png";
import StarsImage from "@/assets/stars.png";
import Image from "next/image";

function Background() {
  return (
    <div className="absolute top-0 left-0 z-[-1] w-full h-full overflow-hidden">
      <Image
        className="w-full -translate-y-[16vw] object-left-top"
        style={{
          minHeight: "calc(100% + 16vw)",
        }}
        priority
        src={BackgroundImage}
        alt="background"
      />
      <Image
        className="absolute h-fit top-0 left-0 w-full -translate-y-[30vw]"
        priority
        src={StarsImage}
        alt="stars"
      />
    </div>
  );
}

export default Background;
