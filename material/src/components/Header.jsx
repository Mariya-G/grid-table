import { NavLink, Link } from "react-router-dom";
function Header() {
  return (
    <div className="header">
      <nav className="header__menu">
        <Link to="#" className="header__link-admin">
          Панель администратора
        </Link>
        <NavLink
          to="/"
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
      <Link className="header__link-out" to={"/login"}>
        Выйти
      </Link>
    </div>
  );
}

export default Header;
