import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'News and Events', path: '/news' },
        { name: 'Curriculum Vitae', path: '/about#cv' },
        { name: 'Cooperation', path: '/cooperation' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Useful Link', path: '/resources' },
        { name: 'Foundation', path: '/foundation' },
        { name: 'About me', path: '/about' },
      ]
    },
    {
      title: 'Publications',
      links: [
        { name: 'Papers and Articles', path: '/portfolio#publications' },
        { name: 'Gallery', path: '/gallery' },
      ]
    }
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-xl font-serif text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path}
                      className="text-white/80 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/80">
            Copywriter © {currentYear}. All right reserved<br />
            Prof. Amos Olalekan Abolaji
          </p>
          <p className="text-sm text-white/60 mt-4 md:mt-0">
            designed by imit-celsius
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 