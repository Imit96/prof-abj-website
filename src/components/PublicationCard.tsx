import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';

interface PublicationCardProps {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  link?: string;
  index: number;
}

const PublicationCard = ({ 
  title, 
  authors, 
  journal, 
  year, 
  doi, 
  link,
  index 
}: PublicationCardProps) => {
  return (
    <motion.div
      className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="font-serif text-lg font-medium mb-2">{title}</h4>
            <p className="text-sm text-text-light mb-2">{authors}</p>
            <p className="text-sm font-medium">
              {journal}, {year}
            </p>
            
            {(doi || link) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {doi && (
                  <a 
                    href={`https://doi.org/${doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    <span>DOI: {doi}</span>
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                )}
                
                {link && (
                  <a 
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    <span>View Publication</span>
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicationCard; 