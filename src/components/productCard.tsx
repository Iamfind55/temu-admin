import React from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

// icons and untils
import { CartIcon } from "@/icons/page";
import { ProductData } from "@/types/product";
import { truncateText } from "@/utils/letterLimitation";

// images
import { useRouter } from "@/i18n/navigation";
import { stripHtml } from "@/utils/stripHtml";
import { addToCart } from "@/redux/slice/cartSlice";

export default function ProductCard(props: ProductData) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies?.get("auth_token");
  const handleAddToCart = () => {
    if (!token) {
      router.push("/cus-signin");
    } else {
      dispatch(
        addToCart({
          product_id: props?.id,
          discount: 0,
          name: props?.name.name_en,
          price: props.price,
          quantity: 1,
        })
      );
    }
  };
  return (
    <div className="cursor-pointer flex items-start justify-start flex-col select-none gap-2 w-auto rounded border hover:shadow-lg transition-all duration-300">
      <div className="max-w-sm bg-white rounded">
        <Image
          className="rounded"
          src={
            props.cover_image ||
            "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
          }
          alt="product"
          width={500}
          height={300}
          quality={100}
        />
        <div className="p-3 flex items-start justify-start flex-col gap-2">
          <div className="w-full flex items-center justify-start flex-col gap-2">
            <i className="text-xs sm:text-md text-second_black font-normal tracking-tight">
              {truncateText(props.name?.name_en || "", 20)}
            </i>
          </div>
          <strong className="text-second_black">$&nbsp;{props.price}</strong>
          <p className="text-second_black font-normal text-xs text-b_text">
            {truncateText(stripHtml(props?.description?.name_en ?? ""), 60)}
          </p>
          <div className="w-full flex flex-col sm:flex-row md:flex-row items-center justify-around gap-2">
            <button
              onClick={() => handleAddToCart()}
              className="w-full text-second_black border border-neon_blue rounded flex items-center justify-center px-3 py-1 mt-0 text-xs text-center text-base rounded focus:outline-none"
            >
              Add to cart
              <CartIcon
                size={16}
                className="text-second_black animate-bounce"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
