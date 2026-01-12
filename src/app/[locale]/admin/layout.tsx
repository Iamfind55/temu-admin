"use client";

import { logout } from "@/redux/slice/authSlice";
import Cookies from "js-cookie";
import Image from "next/image";
import {
  usePathname,
  useRouter
} from "next/navigation";
import React, { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// components
import {
  AppleIcon,
  ArrowDownIcon,
  BannerIcon,
  BrandingIcon,
  CartIcon,
  CategoryIcon,
  CircleIcon,
  CustomerIcon,
  DepositIcon,
  EmployeeIcon,
  LogoutIcon,
  NextIcon,
  OutlineHomeIcon,
  ShopIcon
} from "@/icons/page";
import "../globals.css";

import { RootState } from "@/redux/store";

import { NEW_MESSAGE, QUERY_COUNT_NEW_TRANSACTION, QUERY_COUNT_NO_PICK_UP_ORDER, QUERY_COUNT_VIP_REQUEST, SUBSCRIBE_SENDMESSAGE, SUBSCRIPTION_ORDER, SUBSCRIPTION_UPDATE_ORDER, TRANSACTION_SUBSCRIPTION, VIP_REQUEST_SUBSCRIPTION } from "@/api/subscription";
import { Link } from "@/i18n/navigation";
import { addOrderAmount, addTransactionAmount, addVipAmount } from "@/redux/slice/amountSlice";
import { showNotification } from "@/redux/slice/notificationSlice";
import { useToast } from "@/utils/toast";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { FaRocketchat } from "react-icons/fa";
import { GET_UNREDMESSAGE } from "@/api/message";
import { IoCloseOutline, IoMenuOutline } from "react-icons/io5";


type MenuItem = {
  icon: ReactNode;
  menu: string;
  route: string;
  children?: MenuItem[]; // Optional child menus
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { errorMessage } = useToast();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const { admin } = useSelector((state: any) => state.auth);
  const { orderAmount, vipAmount, transactionAmount } = useSelector(
    (state: RootState) => state.amounts
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle the dropdown menu
  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu]
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: <OutlineHomeIcon size={16} />,
      menu: "Dashboard",
      route: "/admin",
    },
    {
      icon: <AppleIcon size={16} />,
      menu: "Product Management",
      route: "/admin/product",
    },

    {
      icon: <CategoryIcon size={16} />,
      menu: "Category Management",
      route: "/admin/category",
    },
    {
      icon: <BrandingIcon size={16} />,
      menu: "Brand Management",
      route: "/admin/brand",
    },
    // {
    //   icon: <BannerIcon size={16} />,
    //   menu: "Banner Management",
    //   route: "/admin/banner",
    // },
    {
      icon: <CartIcon size={16} />,
      menu: "Order Management",
      route: "/admin/order",
    },
    {
      icon: <DepositIcon size={16} />,
      menu: "Manage transaction",
      route: "/admin/transaction",
    },
    {
      icon: <ShopIcon size={16} />,
      menu: "Shop Management",
      route: "/admin/shop",
    },
    {
      icon: <CustomerIcon size={16} />,
      menu: "Customer Management",
      route: "/admin/customer",
    },
    {
      icon: <EmployeeIcon size={16} />,
      menu: "Employee Management",
      route: "/admin/staff",
    },
    {
      icon: <FaRocketchat size={16} />,
      menu: "Message Center",
      route: "/admin/message",
    },
    // {
    //   icon: <MdLocalShipping size={16} />,
    //   menu: "Logistics",
    //   route: "/admin/logistics",
    // },
  ];

  const handleLogout = async () => {
    Cookies.remove("auth_token");
    dispatch(logout());
    router.push("/signin");
  };

  const [unreadMessageCount, setUndreadMessageCount] = useState(0)
  const { data: transactionData, error: transactionError } = useSubscription(TRANSACTION_SUBSCRIPTION);
  const { data: vipData, error: vipError } = useSubscription(VIP_REQUEST_SUBSCRIPTION);
  const { data: orderData, error: orderError } = useSubscription(SUBSCRIPTION_ORDER);
  const { data: updateOrderData, error: updateOrderError } = useSubscription(SUBSCRIPTION_UPDATE_ORDER);
  const { data: newMessage, error: newMessageError } = useSubscription(NEW_MESSAGE);
  const [unreadMessage] = useLazyQuery(GET_UNREDMESSAGE, {
    fetchPolicy: "cache-and-network",
  });
  const [queryCountTrans] = useLazyQuery(QUERY_COUNT_NEW_TRANSACTION, {
    fetchPolicy: "cache-and-network",
  });

  const [queryVipRequest] = useLazyQuery(QUERY_COUNT_VIP_REQUEST, {
    fetchPolicy: "cache-and-network",
  });

  const [queryCountNopickUpOrder] = useLazyQuery(QUERY_COUNT_NO_PICK_UP_ORDER, {
    fetchPolicy: "cache-and-network",
  });


  const playSound = () => {
    if (typeof window !== "undefined") {
      // const audio = new Audio("https://res.cloudinary.com/dvh8zf1nm/video/upload/v1743312798/notification_u9xtjc.mp3");
      const audio = new Audio("https://res.cloudinary.com/dwzjfryoh/video/upload/v1767540851/messeger_v6i5vf.mp3");
      audio.load();
      audio.play().catch((error) => console.error("Audio playback failed:", error));
    }
  };

  React.useEffect(() => {
    if (pathname === "/la/admin/message" || pathname === "/en/admin/message") {
      setUndreadMessageCount(0)
    }
  }, [pathname]);

  React.useEffect(() => {
    if (!newMessage) return;

    fetchNewMessage();
    // Play sound
    const audio = new Audio("/sound/messenger.mp3");
    audio.play().catch(err => {
      console.warn("Audio play blocked:", err);
    });
    playSound()
  }, [newMessage]);

  const fetchNewMessage = async () => {
    try {
      const result = await unreadMessage();
      const total = result?.data?.getUnreadMessage?.total || 0;

      if (total > 0) {
        setUndreadMessageCount(total)
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };
  React.useEffect(() => {
    fetchNewMessage();
  }, []);

  // count transaction amount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await queryCountTrans();
        const totalTransactions = result?.data?.countNewTransaction?.total || 0;

        if (totalTransactions > 0) {
          dispatch(addTransactionAmount(totalTransactions));
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };
    fetchData();
  }, [transactionData, dispatch]);

  // count order amount
  React.useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const result = await queryCountNopickUpOrder({
          variables: {
            "orderStatus": "NO_PICKUP"
          }
        });
        const totalNopickupOrders = result?.data?.countNewOrder?.total || 0;
        if (totalNopickupOrders > 0) {
          dispatch(addOrderAmount(totalNopickupOrders));
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };
    fetchOrderData();
  }, [orderData, dispatch]);

  // count vip amount
  React.useEffect(() => {
    const fetchVipData = async () => {
      try {
        const result = await queryVipRequest();
        const totalVipRequest = result?.data?.countShopRequestVIP?.total || 0;

        if (totalVipRequest > 0) {
          dispatch(addVipAmount(totalVipRequest));
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };
    fetchVipData();
  }, [vipData, dispatch]);

  // Transaction subscription
  React.useEffect(() => {
    if (transactionData) {
      dispatch(showNotification(transactionData?.transactionSubscribe?.notification_type));
    }
    if (transactionError) {
      errorMessage({
        message: "Transaction socket error!",
        duration: 2000,
      });
    }
  }, [transactionData, transactionError]);

  // VIP subscription
  React.useEffect(() => {
    if (vipData) {
      dispatch(showNotification(vipData?.subscribeNewRequestVIP?.notification_type));
    }
    if (vipError) {
      errorMessage({
        message: "VIP socket error!",
        duration: 2000,
      });
    }
  }, [vipData, vipError]);

  // Order subscription
  React.useEffect(() => {
    if (orderData) {
      dispatch(showNotification(orderData?.subscribeNewOrder?.notification_type));
    }
    if (transactionError) {
      errorMessage({
        message: "Order socket error!",
        duration: 2000,
      });
    }
  }, [orderData, orderError]);

  // Update order subscription
  React.useEffect(() => {
    if (updateOrderData) {
      dispatch(showNotification("Shop has accepted order!"));
    }
    if (updateOrderError) {
      errorMessage({
        message: "Order socket error!",
        duration: 2000,
      });
    }
  }, [updateOrderData, updateOrderError]);


  return (
    <div className="h-screen overflow-hidden">
      <div className="flex items-center justify-between">
        {/* Desktop Sidebar */}
        <div className="hidden sm:block h-screen w-1/5">
          <div className="h-[10vh] flex items-center justify-center bg-base">
            <Image
              src="https://res.cloudinary.com/dwzjfryoh/image/upload/v1760459478/Temu_logo_icon_h3c98r.png"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-between flex-col h-[90vh] bg-gray-200">
            <div className="w-full flex flex-col gap-2 mt-4">
              {menuItems.map((item, index) => {
                const languagePrefix = pathname?.split("/")[1];
                const routePath = item.route.startsWith("/")
                  ? item.route
                  : `/${item.route}`;

                const fullRoute = routePath.startsWith(`/${languagePrefix}`)
                  ? routePath
                  : `/${languagePrefix}${routePath}`.replace(/\/{2,}/g, "/");

                const isActive =
                  pathname === fullRoute ||
                  (item.children &&
                    item.children.some(
                      (child) =>
                        pathname ===
                        `/${languagePrefix}${child.route.replace(/^\/+/, "")}`
                    ));
                const isMenuOpen = openMenus.includes(item.menu);

                return (
                  <div key={index} className="px-4">
                    <div
                      onClick={() =>
                        item.children
                          ? toggleMenu(item.menu)
                          : router.push(item.route)
                      }
                      className={`flex items-center justify-between cursor-pointer py-2 px-4 ${isActive
                        ? "bg-base text-white rounded-md"
                        : "text-black hover:bg-orange-300 rounded-md hover:text-black"
                        }`}
                    >
                      <div className={`flex items-center gap-2 text-sm`}>
                        <span>{item.icon}</span>
                        <span className="text-nowrap">
                          {item.menu}
                        </span>
                        <span>
                          {item.menu === "Manage Transection" ? (
                            <span className="ml-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {transactionAmount}
                            </span>
                          ) : item.menu === "Order Management" ? (
                            <span className="ml-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {orderAmount}
                            </span>
                          ) : item.menu === "Shop Management" ? (
                            <span className="ml-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {vipAmount}
                            </span>
                          ) : item.menu === "Message Center" && unreadMessageCount !== 0 ? (
                            <span className="ml-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadMessageCount}
                            </span>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                      {item.children && (
                        <span className="text-gray-400">
                          {isMenuOpen ? (
                            <ArrowDownIcon size={18} />
                          ) : (
                            <NextIcon size={16} />
                          )}
                        </span>
                      )}
                    </div>

                    {item.children && isMenuOpen && (
                      <div className="ml-10">
                        {item.children.map((child, idx) => {
                          const languagePrefix = pathname?.split("/")[1];
                          const childRoutePath = child.route.startsWith("/")
                            ? child.route
                            : `/${child.route}`;

                          const fullChildRoute = childRoutePath.startsWith(
                            `/${languagePrefix}`
                          )
                            ? childRoutePath
                            : `/${languagePrefix}${childRoutePath}`.replace(
                              /\/{2,}/g,
                              "/"
                            );

                          const isChildActive = pathname === fullChildRoute;

                          return (
                            <Link
                              href={child.route}
                              key={idx}
                              className={`flex items-center justify-start gap-2 py-2 text-sm text-white ${isChildActive
                                ? "bg-gray-200 text-neon_pink"
                                : "text-neon_pink hover:bg-gray-500"
                                }`}
                            >
                              <CircleIcon size={10} />
                              <span>{child.menu}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div onClick={handleLogout}
              className="w-full text-white cursor-pointer flex items-center justify-center gap-2 text-sm bg-primary py-4 px-2"
            >
              Logout
              <LogoutIcon
                size={24}
              />
            </div>

          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-screen w-4/5 max-w-xs bg-white z-50 transform transition-transform duration-300 sm:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-[10vh] flex items-center justify-between px-4 bg-base">
            <Image
              src="https://res.cloudinary.com/dwzjfryoh/image/upload/v1760459478/Temu_logo_icon_h3c98r.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <button onClick={toggleMobileMenu} className="text-white">
              <IoCloseOutline size={32} />
            </button>
          </div>

          <div className="flex items-center justify-between flex-col h-[90vh] bg-gray-200 overflow-y-auto">
            <div className="w-full flex flex-col gap-2 mt-4">
              {menuItems.map((item, index) => {
                const languagePrefix = pathname?.split("/")[1];
                const routePath = item.route.startsWith("/")
                  ? item.route
                  : `/${item.route}`;

                const fullRoute = routePath.startsWith(`/${languagePrefix}`)
                  ? routePath
                  : `/${languagePrefix}${routePath}`.replace(/\/{2,}/g, "/");

                const isActive =
                  pathname === fullRoute ||
                  (item.children &&
                    item.children.some(
                      (child) =>
                        pathname ===
                        `/${languagePrefix}${child.route.replace(/^\/+/, "")}`
                    ));
                const isMenuOpen = openMenus.includes(item.menu);

                return (
                  <div key={index} className="px-4">
                    <div
                      onClick={() => {
                        if (item.children) {
                          toggleMenu(item.menu);
                        } else {
                          router.push(item.route);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between cursor-pointer py-2 px-4 ${
                        isActive
                          ? "bg-base text-white rounded-md"
                          : "text-black hover:bg-orange-300 rounded-md hover:text-black"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span>{item.icon}</span>
                        <span className="text-nowrap">{item.menu}</span>
                        <span>
                          {item.menu === "Manage transaction" ? (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {transactionAmount}
                            </span>
                          ) : item.menu === "Order Management" ? (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {orderAmount}
                            </span>
                          ) : item.menu === "Shop Management" ? (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {vipAmount}
                            </span>
                          ) : item.menu === "Message Center" &&
                            unreadMessageCount !== 0 ? (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadMessageCount}
                            </span>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                      {item.children && (
                        <span className="text-gray-400">
                          {isMenuOpen ? (
                            <ArrowDownIcon size={18} />
                          ) : (
                            <NextIcon size={16} />
                          )}
                        </span>
                      )}
                    </div>

                    {item.children && isMenuOpen && (
                      <div className="ml-10">
                        {item.children.map((child, idx) => {
                          const languagePrefix = pathname?.split("/")[1];
                          const childRoutePath = child.route.startsWith("/")
                            ? child.route
                            : `/${child.route}`;

                          const fullChildRoute = childRoutePath.startsWith(
                            `/${languagePrefix}`
                          )
                            ? childRoutePath
                            : `/${languagePrefix}${childRoutePath}`.replace(
                                /\/{2,}/g,
                                "/"
                              );

                          const isChildActive = pathname === fullChildRoute;

                          return (
                            <Link
                              href={child.route}
                              key={idx}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center justify-start gap-2 py-2 text-sm ${
                                isChildActive
                                  ? "bg-gray-200 text-neon_pink"
                                  : "text-black hover:bg-gray-300"
                              }`}
                            >
                              <CircleIcon size={10} />
                              <span>{child.menu}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-white cursor-pointer flex items-center justify-center gap-2 text-sm bg-primary py-4 px-2"
            >
              Logout
              <LogoutIcon size={24} />
            </div>
          </div>
        </div>

        <div className="w-full sm:w-4/5">
          <div className="w-full h-[10vh] flex border-b items-center justify-between px-4 bg-base">
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden text-white p-2 hover:bg-opacity-80 rounded"
            >
              <IoMenuOutline size={32} />
            </button>

            {/* <div className="sm:hidden flex-1 flex justify-center">
              <Image
                src="https://res.cloudinary.com/dwzjfryoh/image/upload/v1760459478/Temu_logo_icon_h3c98r.png"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div> */}

            <div className="hidden sm:flex items-center">
            </div>
            <div className="flex items-center">
              <div
                onClick={() => router.push("/admin/profile")}
                className="w-full flex items-center justify-start gap-2 text-sm px-2 cursor-pointer"
              >
                <div className="relative cursor-pointer">
                  <Image
                    className="shadow-md object-cover size-16 rounded-full"
                    src={
                      admin.image ||
                      "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                    }
                    alt="default"
                    width={80}
                    height={80}
                  />
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border rounded-full"></div>
                </div>
                <div className="sm:block hidden text-sm">
                  <p>{admin.email}</p>
                  <p className="text-sm">{admin.username}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[90vh] w-full p-4 bg-bg_color overflow-auto pb-20 sm:pb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
