/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import lightRay from "@/assets/light-ray.png";
import { client } from "@/lib/utils";

const { GET } = client;

export default function index() {
  const [needSetup, setNeedSetup] = useState<boolean | undefined>(undefined);

  const fetchNeedSetup = async () => {
    try {
      const { response, data } = await GET("/api/users/setup/");
      if (response.ok) {
        setNeedSetup(data?.need_setup);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchNeedSetup();
  }, []);

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
        {needSetup === undefined ? null : needSetup ? (
          <RegisterForm />
        ) : (
          <LoginForm />
        )}
      </div>
    </>
  );
}
