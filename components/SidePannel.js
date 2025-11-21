import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { userContext } from "@/pages/_app";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Building, Handshake, LayoutDashboard, Settings, MoveLeft, X, MapPinHouse, ContactRound } from "lucide-react";

const SidePannel = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null);

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    { href: "/", title: "Dashboard", img: <LayoutDashboard />, access: ["Admin"] },
    { href: "/AddProperty", title: "Add Property", img: <Building />, access: ["Admin"] },
    { href: "/AllProperty", title: "All Property", img: <MapPinHouse />, access: ["Admin"] },
    { href: "/Booking", title: "Booking", img: <Handshake />, access: ["Admin"] },
    { href: "/Contact", title: "Contact", img: <ContactRound />, access: ["Admin"] },
    { href: "/settings", title: "Settings", img: <Settings />, access: ["Admin"] },
  ];

  return (
    <>

      <div className="xl:w-[280px] fixed top-0 left-0 z-20 hidden sm:grid bg-black h-screen">
        <div className="pt-5 h-full">
          <div className="flex justify-center pb-6 cursor-pointer" onClick={() => router.push("/")}>
            <p className="text-3xl font-bold text-orange-500">Find My Stay</p>
          </div>

          <ul className="flex flex-col px-3">
            {menuItems.map((item, i) =>
              item.access.includes(user?.role) ? (
                <li key={i} className="w-full">
                  <div
                    className={`flex justify-between items-center px-5 py-3 cursor-pointer rounded-lg transition 
                    ${router.pathname === item.href
                        ? "bg-orange-500 text-black"
                        : "text-white hover:bg-orange-500/20"
                      }`}
                    onClick={() =>
                      item.children
                        ? setOpenMenu(openMenu === i ? null : i)
                        : router.push(item.href)
                    }
                  >
                    <span className="flex gap-3 items-center font-semibold">
                      <span className="">{item.img}</span> {item.title}
                    </span>

                    {item.children &&
                      (openMenu === i ? <IoIosArrowDown /> : <IoIosArrowForward />)}
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>


      <div
        className={`w-full absolute top-0 left-0 sm:hidden bg-black z-40 h-screen transition-all duration-300 ${openTab ? "scale-x-100" : "scale-x-0"
          } origin-left`}
      >
        <X
          className="absolute text-white top-4 right-4 text-3xl"
          onClick={() => setOpenTab(false)}
        />

        <div className="p-4">
          <p className="text-3xl font-bold text-orange-500 mb-5">Find My Stay</p>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-orange-500">
              <img src="/office-man.png" className="w-full h-full object-cover" />
            </div>

            <p className="text-lg text-white font-bold">{user?.name}</p>
          </div>

          <div
            className="flex gap-2 items-center text-white cursor-pointer mb-5"
            onClick={() =>
              Swal.fire({
                text: "Are you sure you want to logout?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                confirmButtonColor: "#f97316",
              }).then((result) => result.isConfirmed && logOut())
            }
          >
            <span>Sign Out</span>
            <PiSignOutFill className="text-2xl" />
          </div>

          <ul className="border-t border-orange-500 mt-4">
            {menuItems.map((item, i) =>
              item.access.includes(user?.role) ? (
                <li key={i} className="border-b border-orange-500/40">
                  <div
                    className="flex justify-between items-center px-6 py-3 text-white hover:bg-orange-500/20"
                    onClick={() =>
                      item.children
                        ? setMobileOpenMenu(mobileOpenMenu === i ? null : i)
                        : (setOpenTab(false), router.push(item.href))
                    }
                  >
                    <div className="flex gap-3 items-center">
                      <span className="text-orange-500">{item.img}</span> {item.title}
                    </div>

                    {item.children &&
                      (mobileOpenMenu === i ? <IoIosArrowDown /> : <IoIosArrowForward />)}
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidePannel;
