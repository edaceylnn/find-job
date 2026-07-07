import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../redux/userSlice";

function MenuList({ user, onClick }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <div>
      <Menu as="div" className="inline-block text-left">
        <div className="flex">
          <Menu.Button className="inline-flex gap-2 w-full  md:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-opacity-20 ">
            <div className="leading[80px] flex flex-col items-start">
              <p className="text-sm font-semibold ">
                {user?.firstName ?? user?.name}
              </p>
              <span className="text-sm text-blue-600 ">
                {user?.jobTitle ?? user?.email}
              </span>
            </div>

            <img
              src={user?.profileUrl}
              alt="user profile"
              className="w-10 h-10 rounded-full object-cover "
            />
            <BiChevronDown
              className="h-8 w-8 text-slate-600"
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
          <Menu.Items className="absolute z-50 right-2 mt-2 w-56 origin-top-right divide-y dividfe-gray-100 rounded-md bg-white shadow-lg focus:outline-none ">
            <div className="p-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`${
                      user?.accountType ? "user-profile" : "company-profile"
                    }`}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md p-2 text-sm`}
                    onClick={onClick}
                  >
                    <CgProfile
                      className={`${
                        active ? "text-white" : "text-gray-600"
                      } mr-2 h-5 w-5  `}
                      aria-hidden="true"
                    />
                    {user?.accountType ? "Profilim" : "Şirket Profili"}
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleLogout()}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
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
      <div className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <nav className="container mx-auto flex items-center justify-between px-5 py-4">
          <div>
            <Link to="/" className="text-blue-600 font-bold text-2xl">
              Kariyer<span className="text-blue-300">Bul</span>{" "}
            </Link>
          </div>

          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
            <li>
              <Link className="hover:text-blue-600" to="/">
                İş Bul
              </Link>
            </li>
            <li>
              <Link className="hover:text-blue-600" to="/companies">
                Şirketler
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-blue-600"
                to={
                  user?.accountType === "seeker"
                    ? "/applications"
                    : "/upload-job"
                }
              >
                {user?.accountType === "seeker"
                  ? "Başvurularım"
                  : "İlan Yayınla"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-blue-600" to="/about-us">
                Hakkımızda
              </Link>
            </li>
          </ul>

          <div className="hidden lg:block">
            {!user?.token ? (
              <Link to="/user-auth">
                <CustomButton
                  title="Giriş Yap"
                  containerStyles="text-blue-600 py-2 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-sm font-semibold border border-blue-600 transition"
                />
              </Link>
            ) : (
              <div>
                <MenuList user={user} />
              </div>
            )}
          </div>

          <button
            className="block lg:hidden text-slate-900"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        <div
          className={`${
            isOpen
              ? "absolute left-0 right-0 flex bg-white shadow-xl"
              : "hidden"
          } container mx-auto lg:hidden flex-col gap-4 px-8 py-6 text-sm font-medium text-slate-700`}
        >
          <Link to="/" onClick={handleCloseNavbar}>
            İş Bul
          </Link>
          <Link to="/companies" onClick={handleCloseNavbar}>
            Şirketler
          </Link>
          <Link
            onClick={handleCloseNavbar}
            to={
              user?.accountType === "seeker" ? "/applications" : "/upload-job"
            }
          >
            {user?.accountType === "seeker" ? "Başvurularım" : "İlan Yayınla"}
          </Link>
          <Link to="/about-us" onClick={handleCloseNavbar}>
            Hakkımızda
          </Link>

          <div className="w-full pt-4">
            {!user?.token ? (
              <a href="/user-auth">
                <CustomButton
                  title="Giriş Yap"
                  containerStyles="text-blue-600 py-2 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-sm font-semibold border border-blue-600 transition"
                />
              </a>
            ) : (
              <div>
                <MenuList user={user} onClick={handleCloseNavbar} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
