/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "./Layout";
import { useLocation } from "react-router-dom";
import Workspaces from "./Workspaces";
import Websites from "./Websites";
import Members from "./Memebers";

export default function index() {
  const { pathname } = useLocation();
  return (
    <Layout>
      {pathname.includes("/settings/workspaces/") && <Workspaces />}
      {pathname.includes("/settings/websites/") && <Websites />}
      {pathname.includes("/settings/members/") && <Members />}
    </Layout>
  );
}
