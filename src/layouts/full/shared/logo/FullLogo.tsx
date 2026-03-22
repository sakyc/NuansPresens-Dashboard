

import Logo from "/src/assets/logo.svg";
import darkLogo from "/src/assets/logo-dark.svg";

import { Link } from "react-router";
const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img src={Logo} alt="logo" className="block" />
    </Link>
  );
};

export default FullLogo;
