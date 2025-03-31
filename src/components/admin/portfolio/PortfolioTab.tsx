import React, { useState, useEffect } from 'react';
import { getPortfolioContent, updatePortfolioContent } from '../../../services/contentService';
import Spinner from '../../ui/Spinner';
import { File, Award, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';
import PortfolioForm from './PortfolioForm';
import { PortfolioContent } from '../../../types/contentTypes';

const PortfolioTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPortfolioContent();
  }, []);

  const fetchPortfolioContent = async () => {
    setLoading(true);
    try {
      const content = await getPortfolioContent();
      setPortfolioContent(content);
    } catch (error) {
      console.error('Error fetching portfolio content:', error);
      toast.error('Failed to load portfolio content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (updatedContent: PortfolioContent) => {
    setUpdating(true);
    try {
      await updatePortfolioContent(updatedContent);
      setPortfolioContent(updatedContent);
      toast.success('Portfolio content updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating portfolio content:', error);
      toast.error('Failed to update portfolio content');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <PortfolioForm
        portfolioContent={portfolioContent || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updating}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Portfolio Content</h3>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Edit Content
        </button>
      </div>

      {portfolioContent ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <File className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Publications</h4>
            </div>
            <div className="border p-4 rounded-md">
              {portfolioContent.publications && portfolioContent.publications.length > 0 ? (
                <div className="space-y-4">
                  {portfolioContent.publications.map((pub, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <h5 className="font-medium">{pub.title}</h5>
                      <p className="text-sm text-text-light">
                        {pub.authors} ({pub.year})
                      </p>
                      <p className="text-sm italic">{pub.journal}</p>
                      {pub.doi && (
                        <p className="text-xs text-primary mt-1">DOI: {pub.doi}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No publications added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <FlaskConical className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Research Projects</h4>
            </div>
            <div className="border p-4 rounded-md">
              {portfolioContent.researchProjects && portfolioContent.researchProjects.length > 0 ? (
                <div className="space-y-4">
                  {portfolioContent.researchProjects.map((project, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{project.title}</h5>
                        <span className="text-sm text-text-light">{project.period}</span>
                      </div>
                      <p className="text-sm mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No research projects added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Award className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Awards & Recognition</h4>
            </div>
            <div className="border p-4 rounded-md">
              {portfolioContent.awards && portfolioContent.awards.length > 0 ? (
                <div className="space-y-4">
                  {portfolioContent.awards.map((award, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <h5 className="font-medium">{award.title}</h5>
                      <p className="text-sm">
                        {award.organization}, {award.year}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No awards added yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-text-light mb-4">No portfolio content has been added yet</p>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Add Content
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioTab; 