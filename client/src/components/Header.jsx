import { AiOutlineSearch } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { FiBriefcase, FiMapPin, FiTarget } from "react-icons/fi";
import { HeroSearchWorkspace } from "../assets";
import SearchInput from "./SearchInput";

const Header = ({
  title,
  handleClick,
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
}) => {
  return (
    <section className="border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto max-w-container px-4 py-5 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-panel border border-slate-200 bg-white shadow-panel"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(239,246,255,0.96) 52%, rgba(241,245,249,0.94) 100%)",
          }}
        >
          <div className="absolute inset-y-0 right-0 hidden w-[38%] lg:block">
            <img
              src={HeroSearchWorkspace}
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#f8fafc_0%,rgba(248,250,252,0.74)_28%,rgba(248,250,252,0.06)_100%)]" />
          </div>

          <div className="relative grid gap-6 px-5 py-7 sm:px-7 md:py-9 lg:px-9">
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-control border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                  <FiBriefcase />
                  Yeni roller
                </span>
                <span className="inline-flex items-center gap-2 rounded-control border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                  <FiMapPin />
                  Şehir ve uzaktan
                </span>
                <span className="inline-flex items-center gap-2 rounded-control border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                  <FiTarget />
                  Uyum odaklı
                </span>
              </div>

              <h1 className="max-w-2xl text-2xl font-semibold leading-tight text-textPrimary md:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-textSecondary md:text-base">
                Yeteneklerini, konumunu ve çalışma beklentini aynı anda düşünerek
                daha isabetli fırsatlara odaklan.
              </p>
            </div>

            <form
              onSubmit={handleClick}
              className="grid w-full gap-3 rounded-panel border border-slate-200 bg-white p-2 shadow-panel md:grid-cols-2"
            >
              <SearchInput
                placeholder="Pozisyon, teknoloji veya şirket"
                icon={<AiOutlineSearch className="text-base text-primary" />}
                value={searchQuery}
                setValue={setSearchQuery}
                className="border-slate-100 bg-surface-subtle"
              />
              <SearchInput
                placeholder="Şehir, ülke veya remote"
                icon={<CiLocationOn className="text-base text-primary" />}
                value={location}
                setValue={setLocation}
                className="border-slate-100 bg-surface-subtle"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
