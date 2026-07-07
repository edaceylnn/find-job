import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
          <FiSearch />
        </div>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Aradığın sayfa bulunamadı
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Bağlantı değişmiş veya sayfa kaldırılmış olabilir. İş ilanlarına geri
          dönüp aramaya devam edebilirsin.
        </p>
        <Link
          to="/find-jobs"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiArrowLeft />
          İlanlara dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
