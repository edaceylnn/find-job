import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CompanyCard,
  CustomButton,
  EmptyState,
  Header,
  ListBox,
  Loading,
} from "../components";
import { apiRequest, updateUrl } from "../utils";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setIsFetching(true);

    const newURL = updateUrl({
      pageNum: page,
      query: searchQuery,
      cmpLoc: cmpLocation,
      sort: sort,
      navigate: navigate,
      location: location,
    });

    try {
      const res = await apiRequest({
        url: newURL,
        method: "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordsCount(res?.total);
      setData(res?.data);

      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    await fetchCompanies();
  };

  const handleShowMore = () => setPage((prev) => prev + 1);

  useEffect(() => {
    fetchCompanies();
  }, [page, sort, searchQuery, cmpLocation]);

  return (
    <div className="w-full">
      <Header
        title="Çalışmak istedigin şirketi bul"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={cmpLocation}
        setLocation={setCmpLocation}
      />

      <div className="container mx-auto flex flex-col gap-5 bg-white px-5 py-8 2xl:gap-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm md:text-base text-slate-600">
            <span className="font-semibold text-slate-900">{recordsCount}</span>{" "}
            şirket bulundu
          </p>

          <div className="flex items-center gap-2">
            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          {!isFetching && data?.length === 0 ? (
            <EmptyState
              title="Şirket bulunamadı"
              description="Arama veya konum filtresini değiştirerek tekrar deneyebilirsin. Yeni şirketler eklendikçe burada listelenecek."
              actionLabel="Filtreleri temizle"
              onAction={() => {
                setSearchQuery("");
                setCmpLocation("");
                setPage(1);
                navigate("/companies");
              }}
            />
          ) : (
            data?.map((cmp, index) => <CompanyCard cmp={cmp} key={index} />)
          )}

          {isFetching && (
            <div className="mt-10">
              <Loading />
            </div>
          )}

          {data?.length > 0 && (
            <p className="text-sm text-right">
              {recordsCount} kayıttan {data?.length} tanesi gösteriliyor
            </p>
          )}
        </div>

        {numPage > page && !isFetching && (
          <div className="w-full flex items-center justify-center pt-16">
            <CustomButton
              onClick={handleShowMore}
              title="Daha fazla yükle"
              containerStyles="text-blue-600 py-2 px-6 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600 transition"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
