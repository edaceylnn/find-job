import { Link } from "react-router-dom";
import { footerLinks } from "../utils/data";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-primary-hover bg-primary text-white">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-8 md:grid-cols-[1.1fr_2fr]">
          <div>
            <Link to="/find-jobs" className="text-base font-semibold text-white">
              Kariyer<span className="text-blue-100">Bul</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100/90">
              İş arayanlar ve şirketler için sade, hızlı ve modern kariyer
              platformu.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
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
                      className="text-sm text-blue-100/90 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 py-4">
          <p className="text-center text-sm text-blue-100/80 sm:text-left">
            &copy; 2026 KariyerBul. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
