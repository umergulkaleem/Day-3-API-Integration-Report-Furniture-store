import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-[100px] p-4 bg-white text-gray-800 shadow-md">
      {/* Left Section - Logo/Home Link */}
      <div className="flex items-center justify-between w-full lg:w-[430px] h-auto">
        <Link href="/">
          <h1 className="text-[20px] lg:text-[24px] font-semibold text-gray-800 hover:text-yellow-500 transition-colors duration-300">
            Home
          </h1>
        </Link>
      </div>

      {/* Right Section - Icons */}
      <div className="flex items-center justify-end w-full mt-4 lg:mt-0 lg:w-[450px] space-x-6">
        <Link href="/">
          <Image
            src="/mdi_account-alert-outline@2x.svg"
            width={28}
            height={28}
            alt="Account"
            className="text-black hover:scale-110 transition-transform duration-200"
          />
        </Link>
        <Image
          src="/akar-icons_search.svg"
          width={28}
          height={28}
          alt="Search"
          className="text-black hover:scale-110 transition-transform duration-200"
        />
        <Link href="/">
          <Image
            src="/akar-icons_heart.svg"
            width={28}
            height={28}
            alt="Wishlist"
            className="text-black hover:scale-110 transition-transform duration-200"
          />
        </Link>
        <Link href="/checkout">
          <Image
            src="/ant-design_shopping-cart-outlined.svg"
            width={28}
            height={28}
            alt="Cart"
            className="text-black hover:scale-110 transition-transform duration-200"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
