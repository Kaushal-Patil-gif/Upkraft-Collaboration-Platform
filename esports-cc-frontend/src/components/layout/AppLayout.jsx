import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}
