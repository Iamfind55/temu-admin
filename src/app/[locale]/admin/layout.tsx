"use client";

import Image from "next/image";
import Cookies from "js-cookie";
import React, { ReactNode } from "react";
import { logout } from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  usePathname,
  useRouter,
  usePathname as useNextPathName,
} from "next/navigation";

// components
import {
  AppleIcon,
  ArrowDownIcon,
  ArrowNextIcon,
  BannerIcon,
  BrandingIcon,
  CartIcon,
  CategoryIcon,
  CircleIcon,
  CustomerIcon,
  DepositIcon,
  EmployeeIcon,
  LogoutIcon,
  MenuIcon,
  NextIcon,
  OutlineHomeIcon,
  ShopIcon,
} from "@/icons/page";
import "../globals.css";

import { RootState } from "@/redux/store";

import { showNotification } from "@/redux/slice/notificationSlice";
import { QUERY_COUNT_NEW_TRANSACTION, QUERY_COUNT_NO_PICK_UP_ORDER, QUERY_COUNT_VIP_REQUEST, SUBSCRIPTION_ORDER, SUBSCRIPTION_UPDATE_ORDER, TRANSACTION_SUBSCRIPTION, VIP_REQUEST_SUBSCRIPTION } from "@/api/subscription";
import { addOrderAmount, addTransactionAmount, addVipAmount, clearAllAmounts } from "@/redux/slice/amountSlice";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { useToast } from "@/utils/toast";
import { Link } from "@/i18n/navigation";
import { MdLocalShipping } from "react-icons/md";


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
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const { admin } = useSelector((state: any) => state.auth);
  const { orderAmount, vipAmount, transactionAmount } = useSelector(
    (state: RootState) => state.amounts
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
    {
      icon: <BannerIcon size={16} />,
      menu: "Banner Management",
      route: "/admin/banner",
    },
    {
      icon: <CartIcon size={16} />,
      menu: "Order Management",
      route: "/admin/order",
    },
    {
      icon: <DepositIcon size={16} />,
      menu: "Manage Transection",
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
      icon: <MdLocalShipping size={16} />,
      menu: "Logistics",
      route: "/admin/logistics",
    },
  ];

  const handleLogout = async () => {
    Cookies.remove("auth_token");
    dispatch(logout());
    router.push("/signin");
  };

  const { data: transactionData, error: transactionError } = useSubscription(TRANSACTION_SUBSCRIPTION);
  const { data: vipData, error: vipError } = useSubscription(VIP_REQUEST_SUBSCRIPTION);
  const { data: orderData, error: orderError } = useSubscription(SUBSCRIPTION_ORDER);
  const { data: updateOrderData, error: updateOrderError } = useSubscription(SUBSCRIPTION_UPDATE_ORDER);

  const [queryCountTrans] = useLazyQuery(QUERY_COUNT_NEW_TRANSACTION, {
    fetchPolicy: "cache-and-network",
  });

  const [queryVipRequest] = useLazyQuery(QUERY_COUNT_VIP_REQUEST, {
    fetchPolicy: "cache-and-network",
  });

  const [queryCountNopickUpOrder] = useLazyQuery(QUERY_COUNT_NO_PICK_UP_ORDER, {
    fetchPolicy: "cache-and-network",
  });

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
      <div className="flex items-center justify-start">
        <div className="hidden sm:block h-screen w-1/5">
          <div className="h-[10vh] flex items-center justify-around bg-base">
            <Image
              src={
                "https://res.cloudinary.com/dwzjfryoh/image/upload/v1760459478/Temu_logo_icon_h3c98r.png"
              }
              alt="Logo"
              width={isCollapsed ? 150 : 80}
              height={isCollapsed ? 100 : 100}
            />
          </div>
          <div className="flex items-center justify-between flex-col h-[90vh] bg-gray-200">
            <div className="w-full flex flex-col gap-2 mt-4">
              {menuItems.map((item, index) => {
                const languagePrefix = pathname?.split("/")[1];
                const routePath = item.route.startsWith("/")
                  ? item.route
                  : `/${item.route}`;

                // Ensure languagePrefix does not duplicate in `item.route`
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
                    {/* Parent Menu */}
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

                    {/* Child Menus */}
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
        <div className="w-full">
          <div className="w-full h-[10vh] flex border-b items-cente justify-end px-4 bg-base">
            <div className="flex items-center mr-10">
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

                <div className="text-sm">
                  <p>{admin.email}</p>
                  <p className="text-sm">{admin.username}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[90vh] w-full p-4 bg-bg_color overflow-x-scroll pb-20 sm:pb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
