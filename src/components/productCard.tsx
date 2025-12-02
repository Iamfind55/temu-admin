import React from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

// icons and untils
import { CartIcon } from "@/icons/page";
import { GetShopProductData, ProductData } from "@/types/product";
import { truncateText } from "@/utils/letterLimitation";

// images
import { useRouter } from "@/i18n/navigation";
import { stripHtml } from "@/utils/stripHtml";
import { addToCart } from "@/redux/slice/cartSlice";

export default function ProductCard(data: GetShopProductData) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies?.get("auth_token");
  const handleAddToCart = () => {
    if (!token) {
      router.push("/cus-signin");
    } else {
      dispatch(
        addToCart({
          product_id: data?.id,
          discount: 0,
          name: data.productData.name,
          price: data.productData.price,
          quantity: 1,
        })
      );
    }
  };

  const marketPrice = parseFloat(data.productData.market_price);
  const showMarketPrice = !isNaN(marketPrice) && marketPrice > 0;
  const displayMarketPrice = (marketPrice / 100).toFixed(2);
  const displayPrice = (Number(data.productData.price) / 100).toFixed(2);

  return (
    <div className="cursor-pointer flex items-start justify-start flex-col select-none gap-2 w-full min-w-0 rounded-md border hover:shadow-lg transition-all duration-300">
      <div className="w-full bg-white rounded-md">
        <div className="w-full h-48 overflow-hidden rounded-md">
          <Image
            className="w-full h-full object-cover"
            src={
              data?.productData?.origin_image_url ||
              "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
            }
            alt="product"
            width={500}
            height={300}
            quality={100}
          />
        </div>
        <div className="p-3 flex items-start justify-start flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {showMarketPrice && (
              <span className="text-gray-500 text-sm line-through">
                $&nbsp;{displayMarketPrice}
              </span>
            )}
            <strong className="text-second_black">$&nbsp;{data.productData.price}</strong>
          </div>
          <p className="text-second_black font-normal text-xs text-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {data.productData?.name}
          </p>
          <div className="w-full flex flex-col sm:flex-row md:flex-row items-center justify-around gap-2">
            <button
              onClick={() => handleAddToCart()}
              className="w-full text-second_black border border-primary flex items-center justify-center px-3 py-1 mt-0 text-xs text-center text-base rounded-md focus:outline-none"
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
