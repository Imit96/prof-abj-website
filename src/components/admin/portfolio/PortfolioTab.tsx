import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getPortfolioItems, updatePortfolioItem, deletePortfolioItem } from '../../../services/contentService';
import { PortfolioItem } from '../../../types/contentTypes';
import { Plus, Edit2 } from 'lucide-react';
import PortfolioForm from './PortfolioForm';

const PortfolioTab: React.FC = () => {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getPortfolioContent();
      setContent(data);
    } catch (error) {
      console.error('Error fetching portfolio content:', error);
      toast.error('Failed to load portfolio content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedContent: PortfolioContent) => {
    try {
      await updatePortfolioContent(updatedContent);
      setContent(updatedContent);
      setIsEditing(false);
      toast.success('Portfolio content updated successfully');
    } catch (error) {
      console.error('Error updating portfolio content:', error);
      toast.error('Failed to update portfolio content');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isEditing) {
    return (
      <PortfolioForm
        content={content}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolio Content</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Content
        </button>
      </div>

      {content?.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
          {section.description && (
            <p className="text-text-light mb-4">{section.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.subsections
              .sort((a, b) => a.order - b.order)
              .map((subsection, subIndex) => (
                <div key={subIndex} className="bg-background-alt p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{subsection.title}</h4>
                  <p className="text-text-light">{subsection.content}</p>
                  {subsection.metadata && (
                    <div className="mt-2 text-sm text-text-light">
                      {subsection.type === 'publication' && (
                        <>
                          <p>Authors: {subsection.metadata.authors}</p>
                          <p>Journal: {subsection.metadata.journal}</p>
                          <p>Year: {subsection.metadata.year}</p>
                          {subsection.metadata.doi && (
                            <p>DOI: {subsection.metadata.doi}</p>
                          )}
                        </>
                      )}
                      {subsection.type === 'project' && (
                        <p>Period: {subsection.metadata.period}</p>
                      )}
                      {subsection.type === 'award' && (
                        <>
                          <p>Organization: {subsection.metadata.organization}</p>
                          <p>Year: {subsection.metadata.year}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioTab; 