import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";
import { footerLinks } from "../utils/data";

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: <FaFacebookF /> },
  { label: "Twitter", href: "https://twitter.com", icon: <FaTwitter /> },
  { label: "Instagram", href: "https://instagram.com", icon: <FiInstagram /> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedinIn /> },
];

const Footer = () => {
  return (
    <footer className="mt-12 text-white">
      <div className="overflow-x-hidden -mb-0.5">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-[125%] rotate-180 fill-blue-600 md:h-16"
        >
          <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z" />
        </svg>
      </div>

      <div className="border-t border-white/30 bg-blue-600">
        <div className="container mx-auto grid gap-8 px-5 py-8 md:grid-cols-[1.1fr_2fr]">
          <div>
            <Link to="/find-jobs" className="text-2xl font-bold">
              KariyerBul
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
              İş arayanlar ve şirketler için sade, hızlı ve modern kariyer
              platformu.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {footerLinks.map(({ id, title, links }) => (
              <div key={id}>
                <h2 className="mb-3 text-sm font-semibold text-white">
                  {title}
                </h2>

                <div className="flex flex-col gap-2">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-sm text-blue-100 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600">
          <div className="container mx-auto flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-gray-300 sm:text-left">
              &copy; 2026 KariyerBul
            </p>

            <div className="flex justify-center gap-3 sm:justify-end">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-white transition hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
