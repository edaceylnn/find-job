import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { Button, Card, PageContainer } from "../components";

const NotFound = () => {
  return (
    <PageContainer className="flex min-h-[60vh] items-center justify-center">
      <Card radius="panel" className="w-full max-w-2xl px-6 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-panel bg-primary-subtle text-xl text-primary">
          <FiSearch />
        </div>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          404
        </p>
        <h1 className="mt-3 text-xl font-semibold text-textPrimary">
          Aradığın sayfa bulunamadı
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-textSecondary">
          Bağlantı değişmiş veya sayfa kaldırılmış olabilir. İş ilanlarına geri
          dönüp aramaya devam edebilirsin.
        </p>
        <Link to="/find-jobs" className="mt-8 inline-block">
          <Button iconLeft={<FiArrowLeft />}>İlanlara dön</Button>
        </Link>
      </Card>
    </PageContainer>
  );
};

export default NotFound;
