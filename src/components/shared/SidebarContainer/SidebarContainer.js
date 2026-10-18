"use client";
import { logout } from "@/redux/features/authSlice";
import "./Sidebar.css";
import logo from "@/assets/images/logo.png";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  House,
  CalendarCheck,
  Layers,
  Newspaper,
  Images,
  Settings,
  Shield,
  FileText,
  LogOut,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const SidebarContainer = ({ collapsed }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState([]);

  // Logout handler
  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      dispatch(logout());
      toast.success("Logout Successfully");
      router.push("/login");
      router.refresh();
    }
  };

  const navLinks = [
    {
      key: "dashboard",
      icon: <House size={20} strokeWidth={2} />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "booking-management",
      icon: <CalendarCheck size={20} strokeWidth={2} />,
      label: <Link href="/admin/booking-management">Booking Management</Link>,
    },
    {
      key: "service",
      icon: <Layers size={20} strokeWidth={2} />,
      label: <Link href="/admin/service">Services</Link>,
    },
    {
      key: "blogs",
      icon: <Newspaper size={20} strokeWidth={2} />,
      label: <Link href="/admin/blogs">Blogs</Link>,
    },
    {
      key: "gellery", // note: keep same as your route
      icon: <Images size={20} strokeWidth={2} />,
      label: <Link href="/admin/gellery">Gallery Management</Link>,
    },
    {
      key: "seo",
      icon: <Search size={20} strokeWidth={2} />,
      label: <Link href="/admin/seoMetaPage">SEO Meta</Link>,
    },
    {
      key: "settings",
      icon: <Settings size={20} strokeWidth={2} />,
      label: "Settings",
      children: [
        {
          key: "privacy-policy",
          icon: <Shield size={18} strokeWidth={2} />,
          label: <Link href="/admin/privacy-policy">Privacy Policy</Link>,
        },
        {
          key: "terms-conditions",
          icon: <FileText size={18} strokeWidth={2} />,
          label: <Link href="/admin/terms-conditions">Terms & Conditions</Link>,
        },
      ],
    },
    {
      key: "logout",
      icon: <LogOut size={20} strokeWidth={2} />,
      label: "Logout",
    },
  ];

  // Get current selected key
  const getSelectedKey = () => {
    if (!pathname) return ["dashboard"];

    // Handle nested routes under settings
    if (pathname.includes("privacy-policy")) return ["privacy-policy"];
    if (pathname.includes("terms-conditions")) return ["terms-conditions"];

    const path = pathname.replace("/admin/", "").split("/")[0];
    return [path || "dashboard"];
  };

  // Keep Settings submenu open when on its children
  useEffect(() => {
    if (
      pathname?.includes("privacy-policy") ||
      pathname?.includes("terms-conditions")
    ) {
      setOpenKeys(["settings"]);
    } else {
      setOpenKeys([]);
    }
  }, [pathname]);

  return (
    <Sider
      width={280}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        paddingInline: collapsed ? "6px" : "12px",
        paddingBlock: "24px",
        backgroundColor: "#F0FBFF",
        maxHeight: "100vh",
        overflow: "auto",
      }}
      className="scroll-hide"
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center justify-center">
        <Link href="/admin/dashboard">
          <Image
            src={logo}
            alt="Logo"
            width={collapsed ? 40 : 180}
            height={collapsed ? 40 : 80}
            className={`object-contain transition-all duration-300 ${
              collapsed ? "h-8 w-auto" : "h-16 w-auto"
            }`}
            priority
          />
        </Link>
      </div>

      {/* Menu */}
      <Menu
        onClick={handleMenuClick}
        selectedKeys={getSelectedKey()}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        mode="inline"
        className="sidebar-menu space-y-1 !border-none !bg-transparent"
        items={navLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
