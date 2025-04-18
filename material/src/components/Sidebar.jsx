import { NavLink } from "react-router-dom";
import homePage from "/src/images/house.png";
import card from "/src/images/card.png";
import list from "/src/images/list.png";
import sales from "/src/images/sales.png";
import remains from "/src/images/product.png";

// eslint-disable-next-line react/prop-types
function Sidebar({ sidebarOpen }) {
  const toogleSidebar = `sidebar ${sidebarOpen ? "" : "sidebar_close "} `;
  return (
    <section className={toogleSidebar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `sidebar__link ${isActive ? "sidebar__link_active" : ""}`
        }
      >
        <img className="sidebar__link-icon" src={homePage} />
        Главная
      </NavLink>
      <NavLink
        to="/remains"
        className={({ isActive }) =>
          `sidebar__link ${isActive ? "sidebar__link_active" : ""}`
        }
      >
        <img className="sidebar__link-icon" src={remains} />
        Остатки
      </NavLink>
      <NavLink
        to="/sales"
        className={({ isActive }) =>
          `sidebar__link ${isActive ? "sidebar__link_active" : ""}`
        }
      >
        <img className="sidebar__link-icon" src={sales} />
        Продажи
      </NavLink>
      <NavLink
        to="/cards"
        className={({ isActive }) =>
          `sidebar__link ${isActive ? "sidebar__link_active" : ""}`
        }
      >
        <img className="sidebar__link-icon" src={card} />
        Карты
      </NavLink>
      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `sidebar__link ${isActive ? "sidebar__link_active" : ""}`
        }
      >
        <img className="sidebar__link-icon" src={list} />
        Отчеты
      </NavLink>
    </section>
  );
}
export default Sidebar;
