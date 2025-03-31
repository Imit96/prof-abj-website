import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Don't show breadcrumbs on homepage
  if (pathnames.length === 0) {
    return null;
  }
  
  return (
    <nav className="container mx-auto py-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            to="/" 
            className="flex items-center text-primary hover:text-primary-dark"
          >
            <Home size={16} />
            <span className="ml-1">Home</span>
          </Link>
        </li>
        
        {pathnames.map((name, index) => {
          // Build the path up to this point
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Format the name to be more readable
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
          
          return (
            <li key={name} className="flex items-center">
              <ChevronRight size={14} className="text-text-light" />
              {isLast ? (
                <span className="ml-2 text-text-light font-medium">
                  {formattedName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="ml-2 text-primary hover:text-primary-dark"
                >
                  {formattedName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 