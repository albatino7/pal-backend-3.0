import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";
import UrlQrModal from "../../urls/components/UrlQrModal";

export const RootLayout = () => {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-100/90 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      {/* Persistent Global Modals and Toasts */}
      <UrlQrModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RootLayout;
