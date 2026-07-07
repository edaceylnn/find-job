import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Office } from "../assets";
import { SignUp } from "../components";

const Auth = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);
  const location = useLocation();

  let from = location?.state?.from?.pathname || "/";

  if (user.token) {
    return window.location.replace(from);
  }
  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden bg-slate-950">
      <img
        src={Office}
        alt="Ofis"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-slate-950/60 to-blue-700/40" />
      <div className="relative container mx-auto flex min-h-[calc(100vh-73px)] items-center px-5 py-12">
        <div className="max-w-xl text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
            KariyerBul
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            İş arama ve işe alım sürecini tek yerde buluştur.
          </h1>
          <p className="mt-5 text-base leading-7 text-blue-50">
            Adaylar ilanlara hızlıca başvurabilir, şirketler başvuruları düzenli
            bir panel üzerinden takip edebilir.
          </p>
        </div>
      </div>

      <SignUp open={open} setOpen={setOpen} />
    </div>
  );
};

export default Auth;
