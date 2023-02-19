import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Breadcrumb from "@components/systems/Breadcrumb";
import Navbar from "./Navbar";
import Menu from './Menu';
import clsx from 'clsx';
import nookies from "nookies";
import HeadSeo from "./HeadSeo";

export default function Layout({ children, title, description }) {
  const admin = nookies.get(null, "name")
  const [mounted, setMounted] = useState(false)
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <HeadSeo title={title} description={description} />

      <div className="min-h-screen w-screen lg:grid text-sm font-inter bg-white dark:bg-neutral-900"
        style={{ gridTemplateColumns: "auto 1fr" }}>

        <Sidebar />

        <div className="relative">

          <Navbar />

          {/* Show on Mobile */}
          <div className={clsx("lg:hidden flex gap-x-4 items-center justify-between border-b dark:border-neutral-800 px-2 sm:px-3 py-3",
            "bg-white/95 dark:bg-neutral-900/90 overflow-x-auto",
            "scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-800")}>
            <Breadcrumb />
          </div>

          {/* Show on Desktop */}
          <div className={clsx("hidden lg:flex gap-x-4 items-center justify-between border-b dark:border-neutral-800 px-2 sm:px-3 py-3",
            "z-40 sticky top-0 bg-white/95 dark:bg-neutral-900/90 supports-[backdrop-filter]:backdrop-blur-sm")}>
            <Breadcrumb />

            {mounted &&
              admin.name ?
              <Menu />
              :
              null
            }
          </div>

          <div className="px-4 sm:px-5 py-4">
            {children}
          </div>

        </div>
      </div>
    </>
  );
}
