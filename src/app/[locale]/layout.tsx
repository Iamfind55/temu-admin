import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ReduxProvider } from "@/redux/provider";
import { ToastContainer } from "react-toastify";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import dynamic from "next/dynamic";
import GlobalNotification from "@/components/notification";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Geist } from 'next/font/google'
const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "temushop.net",
  description: "Temushop shop is the largest and biggest e-commerce platform",
  keywords: ["temushop", "shopping.temushop", "online shopping"],
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale?: string | undefined }>;
}

const DynamicApolloClientWrapper = dynamic(
  () => import("../../components/ApolloClientWrapper"),
  { ssr: true }
);

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <NextIntlClientProvider>
      <DynamicApolloClientWrapper>
        <html lang={locale} className={geist.className}>
          <body className="bg-dark font-sans">
            <div className="text-white h-screen">
              <ReduxProvider>
                <div className="justify-center text-white h-screen">
                  {children}
                </div>
                <GlobalNotification />
              </ReduxProvider>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </body>
        </html>
      </DynamicApolloClientWrapper>
    </NextIntlClientProvider>
  );
}
