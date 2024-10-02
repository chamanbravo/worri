import Navbar from "@/components/navbar/navbar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="p-10 px-4 pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
        {children}
      </div>
    </>
  );
}
