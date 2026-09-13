import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FiBookmark, FiBriefcase, FiFileText, FiPlusCircle } from "react-icons/fi";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import Button from "./Button";
import IconButton from "./IconButton";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../redux/userSlice";

function MenuList({ user, onClick }) {
  const dispatch = useDispatch();
  const isSeeker = user?.accountType === "seeker";
  const menuItems = isSeeker
    ? [
        {
          label: "Profilim",
          to: "/user-profile",
          icon: <CgProfile />,
        },
        {
          label: "Başvurularım",
          to: "/applications",
          icon: <FiFileText />,
        },
        {
          label: "Kaydedilen ilanlar",
          to: "/saved-jobs",
          icon: <FiBookmark />,
        },
      ]
    : [
        {
          label: "Şirket profili",
          to: "/company-profile",
          icon: <CgProfile />,
        },
        {
          label: "İlan yayınla",
          to: "/upload-job",
          icon: <FiPlusCircle />,
        },
      ];

  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex">
          <Menu.Button className="inline-flex h-12 min-w-0 items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-2 text-left text-sm shadow-sm transition hover:border-slate-300 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2">
            <div className="hidden min-w-0 flex-col md:flex">
              <p className="max-w-[9rem] truncate text-sm font-semibold leading-5 text-textPrimary">
                {user?.firstName ?? user?.name}
              </p>
              <span className="max-w-[9rem] truncate text-xs leading-4 text-textSecondary">
                {user?.jobTitle ?? user?.email}
              </span>
            </div>

            <Avatar
              src={user?.profileUrl}
              alt="user profile"
              size="sm"
              className="h-8 w-8 ring-1 ring-slate-200"
            />
            <BiChevronDown
              className="h-4 w-4 shrink-0 text-slate-500"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-card border border-slate-200 bg-white p-2 shadow-panel focus:outline-none">
            <div className="border-b border-slate-100 px-2 py-2">
              <p className="truncate text-sm font-semibold text-textPrimary">
                {user?.firstName ?? user?.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-textSecondary">
                {user?.jobTitle ?? user?.email}
              </p>
            </div>
            <div className="p-1 ">
              {menuItems.map((item) => (
                <Menu.Item key={item.to}>
                  {({ active }) => (
                    <Link
                      to={item.to}
                      className={`${
                        active ? "bg-primary text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-card p-2 text-sm`}
                      onClick={onClick}
                    >
                      <span
                        className={`${
                          active ? "text-white" : "text-gray-600"
                        } mr-2 h-5 w-5 text-lg`}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  )}
                </Menu.Item>
              ))}

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleLogout()}
                    className={`${
                      active ? "bg-primary text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-card px-2 py-2 text-sm`}
                  >
                    <AiOutlineLogout
                      className={`${
                        active ? "text-white" : "text-gray-600"
                      } mr-2 h-5 w-5  `}
                      aria-hidden="true"
                    />
                    Çıkış Yap
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-[72px] max-w-container items-center justify-between px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <IconButton
              className="border-slate-200 bg-white"
              icon={isOpen ? <AiOutlineClose size={20} /> : <FiBriefcase size={19} />}
              label={isOpen ? "Menüyü kapat" : "Kısayollar"}
              onClick={() => setIsOpen((prev) => !prev)}
            />
            <Link to="/" className="text-xl font-semibold text-primary">
              Kariyer<span className="text-blue-300">Bul</span>{" "}
            </Link>
          </div>

          <div>
            {!user?.token ? (
              <Link to="/user-auth">
                <Button variant="secondary">Giriş Yap</Button>
              </Link>
            ) : (
              <div>
                <MenuList user={user} />
              </div>
            )}
          </div>
        </nav>

        <div
          className={`${
            isOpen
              ? "absolute left-0 right-0 flex bg-white shadow-xl"
              : "hidden"
          } mx-auto max-w-container flex-col gap-3 px-8 py-5 text-sm font-medium text-textPrimary`}
        >
          <Link to="/find-jobs" onClick={handleCloseNavbar}>
            İş Bul
          </Link>
          <Link to="/companies" onClick={handleCloseNavbar}>
            Şirketler
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
