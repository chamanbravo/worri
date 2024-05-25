/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "./Layout";
import { useLocation } from "react-router-dom";
import Workspaces from "./workspaces";
import Websites from "./websites";
import Members from "./memebers";

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
