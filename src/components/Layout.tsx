import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';

interface LayoutProps {
  showBreadcrumb?: boolean;
}

const Layout = ({ showBreadcrumb = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {showBreadcrumb && <Breadcrumb />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 