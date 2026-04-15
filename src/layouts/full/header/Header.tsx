import { useState, useEffect } from "react";
import { Navbar, Drawer } from "flowbite-react";
import { Icon } from "@iconify/react";
import Profile from "./Profile";
import Notification from "./notification";
import MobileSidebar from "../sidebar/MobileSidebar";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  // 1. State untuk dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  // 2. Load preferensi dari local storage saat pertama kali render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 3. Effect untuk update DOM dan localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-[5] ${isSticky ? "bg-lightgray dark:bg-dark_tebel fixed w-full" : "bg-lightgray dark:bg-dark_tebel"}`}>
        <Navbar fluid className="rounded-none bg-transparent dark:bg-transparent py-4 sm:px-30 px-4">
          <div className="flex gap-3 items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <span onClick={() => setIsOpen(true)} className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer">
                <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
              </span>
              <Notification />
            </div>
            <div className="flex gap-4 items-center">
            <h1>{userData.role}</h1>
              {/* 4. Toggle Button */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon 
                    icon={isDarkMode ? "solar:sun-2-bold" : "solar:moon-bold"} 
                    className="text-black dark:text-white"
                    height={21} 
                />
              </button>
              <Profile />
            </div>
          </div>
        </Navbar>
      </header>

      <Drawer open={isOpen} onClose={() => setIsOpen(false)} className="w-130">
        <Drawer.Items>
          <MobileSidebar />
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;