/* eslint-disable react-hooks/rules-of-hooks */
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import lightRay from "@/assets/light-ray.png";
import { useNeedSetup } from "@/hooks/queries/useNeedSetup";

export default function index() {
  const { data } = useNeedSetup();

  return (
    <>
      <div className="-translate-x-1/2 absolute justify-center left-1/2 top-0 w-[1000px] overflow-hidden -z-10 hidden lg:flex">
        <img
          width="1000"
          height="1000"
          className="relative left-[100px]"
          src={lightRay}
        />
      </div>

      <div className="mt-4 px-4 flex justify-center items-center md:h-[100vh] md:mt-0 md:px-0 overflow-hidden">
        {data?.need_setup === undefined ? null : data?.need_setup ? (
          <RegisterForm />
        ) : (
          <LoginForm />
        )}
      </div>
    </>
  );
}
