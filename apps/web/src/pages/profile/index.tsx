/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "./Layout";
import { useLocation } from "react-router-dom";
import Profile from "./Profile";
import PasswordSecurity from "./PasswordSecurity";

export default function index() {
  const { pathname } = useLocation();

  return (
    <Layout>
      {!pathname.includes(`/password-security/`) && <Profile />}
      {pathname.includes(`/profile/password-security/`) && <PasswordSecurity />}
    </Layout>
  );
}
