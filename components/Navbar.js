import { userContext } from "@/pages/_app";
import { Bell, User, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const Navbar = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#e0f349",
      customClass: {
        confirmButton: "px-12 rounded-xl",
        title: "text-[20px] text-black",
        actions: "swal2-actions-no-hover",
        popup: "rounded-[15px] shadow-lg",
      },
      buttonsStyling: true,
      reverseButtons: true,
      width: "350px",
    }).then((result) => {
      if (result.isConfirmed) logOut();
    });
  };

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
  };

  return (
    <nav className="w-full bg-black/95 border-b border-gray-800 sticky top-0 z-20 shadow-lg backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between md:h-20 h-16">

          {/* Logo Section */}
          <p
            className="text-2xl text-white font-bold md:hidden flex"
            onClick={() => router.push("/")}
          >
           Find My Stay
          </p>

          {/* Desktop Section */}
          {user?._id && (
            <div className="hidden md:flex items-center justify-end space-x-5 flex-1">

              {/* Search Box */}
              <div className="relative w-[22rem]">
                <input
                  className="ps-11 w-full bg-gray-800/70 text-white border border-gray-700 focus:border-gray-500 rounded-3xl px-4 py-2 placeholder-gray-400 outline-none transition-all"
                  placeholder="Search..."
                />
                <Search size={18} className="absolute top-2.5 left-4 text-gray-400" />
              </div>

              {/* Notification */}
              <div className="p-2 rounded-full bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
                <Bell className="text-custom-yellow" />
              </div>

              {/* Profile + Dropdown */}
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-custom-yellow cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={"/office-man.png"}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-gray-900 text-white rounded-lg shadow-2xl py-2 border border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm hover:bg-gray-800"
                    >
                      <PiSignOutFill size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* User Role */}
              <div className="flex flex-col text-left">
                <p className="text-custom-yellow font-medium">{user?.role}</p>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpenTab(!openTab)}
              className="p-2 rounded-md text-white"
            >
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
