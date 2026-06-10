import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div
      style={{
        backgroundImage: 'url("/img/header_footer.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
      className="flex  justify-center items-center  w-full rounded-lg bg-amber-50/30 rounded-b-none    "
    >
      <div className="">
        <Image
          src={"/img/logo.png"}
          width={1000}
          height={1000}
          className="  py-3 md:w-72 w-30"
          alt="header"
        />
      </div>
      <div className="  text-amber-400 flex  justify-start items-start flex-col">
        <h2 className="font-bold md:text-5xl text-lg font-display mt-1">
          Sunita Tandulwadkar
        </h2>
        <h3 className="font-bold md:text-3xl text-[12px] font-mono uppercase">
          Academy of Reproduction
        </h3>
      </div>
    </div>
  );
};

export default Header;
