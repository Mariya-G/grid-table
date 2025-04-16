import { NavLink, Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuth } from "./AuthContext";

function Header() {
  const { signOut } = useAuth();
  return (
    <div className="header">
      <nav className="header__menu">
        <Link to="#" className="header__link-admin">
          Панель администратора
        </Link>
        <NavLink
          to="/remains"
          className={({ isActive }) =>
            `header__link ${isActive ? "header__link_active" : ""}`
          }
        >
          Остатки
        </NavLink>
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `header__link ${isActive ? "header__link_active" : ""}`
          }
        >
          Продажи
        </NavLink>
        <NavLink
          to="/cards"
          className={({ isActive }) =>
            `header__link ${isActive ? "header__link_active" : ""}`
          }
        >
          Карты
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `header__link ${isActive ? "header__link_active" : ""}`
          }
        >
          Отчеты
        </NavLink>
      </nav>

      <Link className="header__link-out" onClick={signOut} to={"/login"}>
        <Button variant="outlined" endIcon={<Logout />}>
          Выйти
        </Button>
      </Link>
    </div>
  );
}

export default Header;
