import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <div className="md:ml-64 pt-16 pb-20 md:pt-0 md:pb-0">
        {children}
      </div>
    </div>
  );
};

export default Layout;
