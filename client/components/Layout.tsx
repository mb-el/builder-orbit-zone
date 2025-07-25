import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background no-scroll-x">
      <Navigation />

      {/* Main Content with responsive spacing */}
      <div className="md:ml-64 pt-[60px] pb-[calc(70px+env(safe-area-inset-bottom,8px))] md:pt-0 md:pb-0 mobile-nav-spacing overflow-x-hidden">
        <div className="px-2 mobile-sm:px-4 py-2 mobile-sm:py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
