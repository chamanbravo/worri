import Navbar from "@/components/navbar/navbar";
import { fetchCurrentUser, fetchCurrentUserWorkspaces } from "@/lib/api/users";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchCurrentUser();
  const workspaces = await fetchCurrentUserWorkspaces();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <Navbar user={user} workspaces={workspaces} />
      <div className="p-10 px-4 pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
        {children}
      </div>
    </>
  );
}
