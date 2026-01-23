import { useEffect, useRef, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logos.png";
import $ from "jquery";
import noProfile from "../assets/images/noProfile.svg";
import slideToggle from "../assets/images/slideToggle.svg";
import Swal from "sweetalert2";
import {
  Bell,
  CalendarDays,
  HomeIcon,
  LogOut,
  LogOutIcon,
  ScrollText,
  TrendingUp,
  UsersRound,
  Vote,
  Wallet,
  Power,
  Building,
  Building2,
  Settings,
  FileText,
  Video,
  HelpCircle,
} from "lucide-react";
import Notification from "./Notification";

const Headers = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const headerRef = useRef(null);

  // Fake static values instead of API
  const userName = "Admin";
  const userImage = noProfile;
  const headerNotifications = []; // no API → empty notifications

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sidebar toggles & menu highlighting
  useEffect(() => {
    const treeviewMenu = $(".app-menu");

    $("[data-toggle='treeview']").click(function (event) {
      event.preventDefault();
      const $parent = $(this).parent();
      treeviewMenu.find(".is-expanded").not($parent).removeClass("is-expanded");
      $parent.toggleClass("is-expanded");
    });

    const currentPathname = window.location.pathname;
    treeviewMenu.find(".is-expanded").removeClass("is-expanded");

    $(".treeview-menu a").each(function () {
      const linkPathname = new URL(this.href).pathname;
      if (linkPathname === currentPathname) {
        $(this).addClass("active");
        $(this).closest(".treeview").addClass("is-expanded");
      }
    });

    $('[data-toggle="sidebar"]').click(function (event) {
      event.preventDefault();
      $(".app").toggleClass("sidenav-toggled");
    });

    return () => {
      $("[data-toggle='treeview']").off("click");
      $('[data-toggle="sidebar"]').off("click");
    };
  }, []);

  const handleToggle = () => {
    setIsSideBarOpen((prev) => !prev);
  };

  // Close sidebar when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       sidebarRef.current &&
  //       !sidebarRef.current.contains(event.target) &&
  //       headerRef.current &&
  //       !headerRef.current.contains(event.target)
  //     ) {
  //       setIsSideBarOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // Logout
  const handleLogoutClick = useCallback(
    (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#166fff",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          sessionStorage.clear();
          Swal.fire({
            title: "Logged out!",
            icon: "success",
            confirmButtonColor: "#166fff",
          }).then(() => {
            navigate("/");
            window.location.reload();
          });
        }
      });
    },
    [navigate],
  );

  return (
    <>
      <header className="app-header" ref={headerRef}>
        <Link
          className={
            !isSideBarOpen ? "app-header__logo" : "app-header__logo_close"
          }
          to="/dashboard"
        >
          {!isSideBarOpen ? (
            <div className="d-flex flex-column gap-2 align-items-center">
              <img style={{ height: "46px" }} src={logo} alt="Logo" />
              <div className="d-flex flex-column">
                <span className="text-16-700" style={{ fontSize: "20px" }}>
                  Admin Panel
                </span>
              </div>
            </div>
          ) : (
            <img src={logo} alt="Logo" style={{ height: "46px" }} />
          )}
        </Link>

        <ul className="app-nav col-12 justify-content-between">
          <li
            className="col-1 w-max "
            style={{ cursor: "pointer" }}
            onClick={handleToggle}
          >
            <img src={slideToggle} />
          </li>

          {/* USER DROPDOWN */}
          <div className="header d-flex justify-content-end align-items-center p-3 bg-white position-fixed ">
            {/* <Notification /> */}
            {/* // notifications={headerNotifications} */}
            <div
              className="d-flex align-items-center gap-2 position-relative "
              // onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              <img
                src={userImage}
                className="rounded-circle ms-2"
                alt="Merchant"
                style={{ objectFit: "cover" }}
              />
              <div>
                <p className="me-2 mb-0">Welcome back</p>
                <p className="mb-0">{userName}</p>
              </div>

              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <p
                    onClick={handleLogoutClick}
                    className="mb-0"
                    style={{ cursor: "pointer" }}
                  >
                    <LogOut size={16} /> Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </ul>
      </header>

      {/* SIDEBAR */}
      <aside ref={sidebarRef} className="app-sidebar">
        <hr className="sidebar-divider" />
        <ul className="app-menu">
          <li>
            <NavLink className="app-menu__item" to="/dashboard">
              <HomeIcon size={20} />{" "}
              <span className="app-menu__label">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="app-menu__item" to="/user-management">
              <UsersRound size={20} />
              <span className="app-menu__label">User Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="app-menu__item" to="/property-management">
              <Building2 size={20} />
              <span className="app-menu__label">Property Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="app-menu__item" to="/voting-management">
              <Vote size={20} />
              <span className="app-menu__label">Voting Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="app-menu__item" to="/monetization">
              <Wallet size={20} />
              <span className="app-menu__label">Manage Monetization</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="app-menu__item" to="/announcements">
              <Bell size={20} />
              <span className="app-menu__label"> Announcements </span>
            </NavLink>
          </li>
          <li>
            <NavLink className="app-menu__item" to="/analytics">
              <TrendingUp size={20} />
              <span className="app-menu__label">Analytics</span>
            </NavLink>
          </li>

          {/* CONTENT MANAGEMENT */} 
          <li className="treeview">
            <div
              className="app-menu__item"
              data-toggle="treeview"
              style={{ cursor: "pointer", color: "" }}
            >
              <FileText size={20} />
              <span className="app-menu__label">Content Management</span>
            </div>

            <ul className="treeview-menu mt-2">
              <li>
                <NavLink to="/cms" className="treeview-item">
                  <span className="app-menu__label">Legal</span> 
                </NavLink>
              </li>
              <li>
                <NavLink to="/blogs" className="treeview-item">
                  <span className="app-menu__label">Blogs</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/vlogs" className="treeview-item">
                  <span className="app-menu__label">Vlogs</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className="treeview-item">
                  <span className="app-menu__label">FAQs</span>
                </NavLink>
              </li>
            </ul>
          </li>
          {/* End CONTENT MANAGEMENT */}

          <li>
            <NavLink className="app-menu__item" to="/settings">
              <Settings size={20} />
              <span className="app-menu__label">Settings</span>
            </NavLink>
          </li>

          {/* LOGOUT BUTTON */}
          <li className="sidebar-button mt-4">
            <div
              className="app-menu__item sidebar-logout cursor-pointer"
              onClick={handleLogoutClick}
            >
              <Power />
              <span className="app-menu__label">Signout</span>
            </div>
          </li>
        </ul>
      </aside>

      {/* <footer className="app-footer d-flex justify-content-between align-items-center px-4 py-3">
        <div className="footer-text">
          © 2025 Make It Happen | All rights reserved.
        </div>
        <div className="d-flex gap-3">
          <Link to={"/legal"} className="footer-text">
            Privacy Policy
          </Link>
          <Link to={"/legal"} className="footer-text">
            Terms and Conditions
          </Link>
        </div>
      </footer> */}
    </>
  );
};

export default Headers;
