import lightRay from "@/public/light-ray.png";
import Image from "next/image";
import { fetchNeedSetup } from "@/lib/api/users";
import RegisterForm from "@/components/auth/register-form";
import LoginForm from "@/components/auth/login-form";

export default async function Auth() {
  const needSetup = await fetchNeedSetup();

  if (needSetup === undefined) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-muted-foreground">
          Serverside error! Make sure application is configured properly.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="-translate-x-1/2 absolute justify-center left-1/2 top-0 w-[1000px] overflow-hidden -z-10 hidden lg:flex">
        <Image
          width="1000"
          height="1000"
          className="relative left-[100px]"
          src={lightRay}
          alt="worri authentication"
          priority={true}
        />
      </div>

      <div className="mt-4 px-4 flex justify-center items-center md:h-[100vh] md:mt-0 md:px-0 overflow-hidden">
        {needSetup?.need_setup ? <RegisterForm /> : <LoginForm />}
      </div>
    </>
  );
}
