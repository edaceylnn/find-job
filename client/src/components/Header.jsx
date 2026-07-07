import { AiOutlineSearch } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";
import CustomButton from "./CustomButton";
import { HeroImage } from "../assets";

const SearchInput = ({ placeholder, icon, value, setValue, styles = "" }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div
      className={`flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 ${styles}`}
    >
      {icon}

      <input
        value={value}
        onChange={(e) => handleChange(e)}
        type="text"
        className="w-full outline-none bg-transparent text-sm md:text-base text-slate-700 placeholder:text-slate-400"
        placeholder={placeholder}
      />

      {value && (
        <button
          type="button"
          aria-label={`${placeholder} alanını temizle`}
          onClick={() => setValue("")}
          className="text-slate-400 transition hover:text-blue-600"
        >
          <IoCloseCircle className="text-xl" />
        </button>
      )}
    </div>
  );
};

const Header = ({
  title,
  handleClick,
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
}) => {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-5 py-12 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="relative z-10">
            <div className="mb-7 max-w-3xl">
              <span className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                Kariyerini hızlandır
              </span>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                İlanları filtrele, sana uygun şirketleri keşfet ve başvuru
                sürecini tek yerden takip et.
              </p>
            </div>

            <form
              onSubmit={handleClick}
              className="grid w-full gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-blue-900/10 md:grid-cols-[1fr_1fr_auto] md:p-4"
            >
              <SearchInput
                placeholder="Pozisyon veya anahtar kelime"
                icon={<AiOutlineSearch className="text-blue-600 text-xl" />}
                value={searchQuery}
                setValue={setSearchQuery}
              />
              <SearchInput
                placeholder="Ülke veya şehir"
                icon={<CiLocationOn className="text-blue-600 text-xl" />}
                value={location}
                setValue={setLocation}
              />

              <CustomButton
                type="submit"
                title="Ara"
                containerStyles="w-full rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 md:w-auto md:text-base"
              />
            </form>
          </div>

          <div className="hidden lg:flex justify-end">
            <img
              src={HeroImage}
              alt="İş arama platformu"
              className="max-h-[320px] w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
