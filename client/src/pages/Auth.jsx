import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SignUp } from "../components";

const Auth = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);
  const location = useLocation();

  let from = location?.state?.from?.pathname || "/";

  if (user?.token) {
    return window.location.replace(from);
  }
  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden bg-slate-100">
      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-container items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="hidden max-w-md lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            KariyerBul
          </p>
          <h1 className="mt-4 text-lg font-semibold leading-tight text-textPrimary">
            İş arama ve işe alım sürecini tek yerde buluştur.
          </h1>
          <p className="mt-5 text-sm leading-6 text-textSecondary">
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
