export const metadata = {
  title: "Temustores Online",
  description:
    "Temustores is a leading e-commerce platform offering a seamless shopping experience with a wide range of products.",
};

import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-transparent">{children}</div>;
}
