import "../globals.css";

export const metadata = {
  title: "Temustores Online",
  description:
    "Temustores is a leading e-commerce platform offering a seamless shopping experience with a wide range of products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
