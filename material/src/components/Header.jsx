import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuth } from "./AuthContext";

// eslint-disable-next-line react/prop-types
function Header({ handleToggleSidebar, sidebarOpen }) {
  const { signOut } = useAuth();
  return (
    <div className="header">
      <div className="header-column header-column_left">
        <button
          className={`header__button-open-menu ${
            !sidebarOpen ? "" : "header__button-open-menu_close-sidebar"
          }`}
          onClick={() => {
            handleToggleSidebar();
          }}
        ></button>
      </div>
      <button className="header__out-link" onClick={signOut}>
        <span className="header__out-title">Выйти</span>
        <span className="header__out-icon"></span>
      </button>
    </div>
  );
}

export default Header;
