import {
    GoDashboard,
    GoPackage,
    GoGraph,
    GoGear
} from "react-icons/go";

import {IoLogoUsd} from "react-icons/io"
import {BsCartCheck} from "react-icons/bs"
import {TbReportSearch} from "react-icons/tb"
import {MdOutlineAccountCircle} from "react-icons/md"
import { BsBoxArrowRight } from "react-icons/bs";

export const sidebarData = (user) => {
    return user === "Admin" ? 
    [
      {
        icon: GoDashboard,
        heading: "Dashboard",
        path: "/dashboard"
      },
      {
        icon: GoPackage,
        heading: "Product",
        path: "/product",
      },
      {
        icon: BsCartCheck,
        heading: "Purchases",
        path: "/purchase",
      },
      {
        icon: GoGraph,
        heading: "Sales",
        path: "/sales",
      },
      {
        icon: TbReportSearch,
        heading: "Reports",
        path: "/reports",
      },
      {
        icon: MdOutlineAccountCircle,
        heading: "Account",
        path: "/account",
      },
      {
        icon: GoGear,
        heading: "Setting",
        path: "/setting",
      },
      {
        icon: BsBoxArrowRight,
        heading: "Logout",
        path: "/logout",
      },
    ] : 
    [
      {
        icon: GoGraph,
        heading: "Sales",
        path: "/sales",
      },
      {
        icon: GoPackage,
        heading: "Product",
        path: "/product",
      },
      {
        icon: BsCartCheck,
        heading: "Purchases",
        path: "/purchase",
      },
      {
        icon: BsBoxArrowRight,
        heading: "Logout",
        path: "/logout",
      },
    ];
  };
  