import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBriefcase, FiMapPin, FiX } from "react-icons/fi";
import {
  Button,
  CompanyCard,
  EmptyState,
  Header,
  ListBox,
  Loading,
  PageContainer,
} from "../components";
import { apiRequest, updateUrl } from "../utils";
import { useDebounce } from "../utils/useDebounce";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const debouncedCmpLocation = useDebounce(cmpLocation, 400);

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
      setData((prev) =>
        page === 1 ? res?.data ?? [] : [...(prev ?? []), ...(res?.data ?? [])]
      );

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
  const activeFilterCount = (searchQuery ? 1 : 0) + (cmpLocation ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setCmpLocation("");
    setPage(1);
    navigate("/companies");
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, sort, debouncedSearchQuery, debouncedCmpLocation]);

  return (
    <div className="w-full">
      <Header
        title="Çalışmak istedigin şirketi bul"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={(value) => {
          setPage(1);
          setSearchQuery(value);
        }}
        location={cmpLocation}
        setLocation={(value) => {
          setPage(1);
          setCmpLocation(value);
        }}
      />

      <PageContainer className="flex flex-col gap-5 2xl:gap-10">
        <div className="grid gap-3 rounded-panel border border-slate-200/80 bg-white/90 p-4 shadow-card md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-textSecondary">
              Şirket keşfi
            </p>
            <p className="mt-1 text-base font-semibold text-textPrimary">
              {recordsCount} şirket bulundu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ListBox
              sort={sort}
              setSort={(value) => {
                setPage(1);
                setSort(value);
              }}
            />
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-2 rounded-control bg-white px-3 py-1.5 text-sm font-medium text-textPrimary shadow-card">
                <FiBriefcase /> {searchQuery}
              </span>
            )}
            {cmpLocation && (
              <span className="inline-flex items-center gap-2 rounded-control bg-white px-3 py-1.5 text-sm font-medium text-textPrimary shadow-card">
                <FiMapPin /> {cmpLocation}
              </span>
            )}
            <Button variant="ghost" size="sm" iconLeft={<FiX />} onClick={clearFilters}>
              Temizle
            </Button>
          </div>
        )}

        <div className="w-full flex flex-col gap-6">
          {!isFetching && data?.length === 0 ? (
            <EmptyState
              title="Şirket bulunamadı"
              description="Arama veya konum filtresini değiştirerek tekrar deneyebilirsin. Yeni şirketler eklendikçe burada listelenecek."
              actionLabel="Filtreleri temizle"
              onAction={() => {
                clearFilters();
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
            <p className="text-right text-sm text-textSecondary">
              {recordsCount} kayıttan {data?.length} tanesi gösteriliyor
            </p>
          )}
        </div>

        {numPage > page && !isFetching && (
          <div className="flex w-full items-center justify-center pt-16">
            <Button variant="secondary" size="lg" onClick={handleShowMore}>
              Daha fazla yükle
            </Button>
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default Companies;
