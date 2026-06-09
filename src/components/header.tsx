import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="grid grid-cols-4 w-full rounded-lg bg-amber-50/30 rounded-b-none border-2 border-b-0 border-pink-300  shadow-xl shadow-green-100 ">
      <div className="">
        <Image
          src={"/img/logo.png"}
          width={1000}
          height={1000}
          className="w-full px-10 py-3"
          alt="header"
        />
      </div>
      <div className="col-span-3 text-amber-400 flex w-full justify-center items-center flex-col">
        <h2 className="font-bold text-5xl">Sunita Tandulwadkar</h2>
        <h3 className="font-bold text-3xl">Academy of Reproduction</h3>
      </div>
    </div>
  );
};

export default Header;
