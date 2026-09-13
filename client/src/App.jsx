import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Footer, Navbar } from "./components";
import {
  About,
  Applications,
  AuthPage,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetail,
  NotFound,
  ResetPassword,
  SavedJobs,
  UploadJob,
  UserProfile,
} from "./pages";
import { useSelector } from "react-redux";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/user-auth' state={{ from: location }} replace />
  );
}

// Company-only pages: a seeker account should never land here even via a
// direct URL, only the nav links were hiding them before.
function CompanyOnlyLayout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.accountType !== "seeker" ? (
    <Outlet />
  ) : (
    <Navigate to='/find-jobs' state={{ from: location }} replace />
  );
}

// Seeker-only pages: a company account should never land here even via a
// direct URL, only the nav links were hiding them before.
function SeekerOnlyLayout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.accountType === "seeker" ? (
    <Outlet />
  ) : (
    <Navigate to='/find-jobs' state={{ from: location }} replace />
  );
}

function App() {
  const { user } = useSelector((state) => state.user);
  return (
    <main className='app-surface min-h-screen'>
      <Toaster position='top-center' />
      <Navbar />

      <Routes>
        <Route element={<Layout />}>
          <Route
            path='/'
            element={<Navigate to='/find-jobs' replace={true} />}
          />
          <Route path='/find-jobs' element={<FindJobs />} />
          <Route path='/companies' element={<Companies />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
          <Route path={"/job-detail/:id"} element={<JobDetail />} />
          {/* Public read-only view of a company, linked from CompanyCard —
              open to any logged-in user, not company-only. */}
          <Route path={"/company-profile/:id"} element={<CompanyProfile />} />

          <Route element={<CompanyOnlyLayout />}>
            <Route path={"/company-profile"} element={<CompanyProfile />} />
            <Route path={"/upload-job"} element={<UploadJob />} />
            <Route path={"/edit-job/:id"} element={<UploadJob />} />
          </Route>

          <Route element={<SeekerOnlyLayout />}>
            <Route path={"/applications"} element={<Applications />} />
            <Route path={"/saved-jobs"} element={<SavedJobs />} />
          </Route>
        </Route>

        <Route path='/about-us' element={<About />} />
        <Route path='/user-auth' element={<AuthPage />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      {user && <Footer />}
    </main>
  );
}

export default App;
