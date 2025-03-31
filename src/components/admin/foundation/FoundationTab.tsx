import React, { useState, useEffect } from 'react';
import { getFoundationContent, updateFoundationContent } from '../../../services/contentService';
import Spinner from '../../ui/Spinner';
import { Heart, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import FoundationForm from './FoundationForm';
import { FoundationContent } from '../../../types/contentTypes';

const FoundationTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [foundationContent, setFoundationContent] = useState<FoundationContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<FoundationContent>({
    mission: '',
    programs: [],
    impactStats: [],
    upcomingEvents: []
  });

  useEffect(() => {
    fetchFoundationContent();
  }, []);

  const fetchFoundationContent = async () => {
    setLoading(true);
    try {
      const content = await getFoundationContent();
      setFoundationContent(content);
      setFormData(content);
    } catch (error) {
      console.error('Error fetching foundation content:', error);
      toast.error('Failed to load foundation content');
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

  const handleSubmit = async (updatedContent: FoundationContent) => {
    setUpdating(true);
    try {
      await updateFoundationContent(updatedContent);
      setFoundationContent(updatedContent);
      setFormData(updatedContent);
      toast.success('Foundation content updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating foundation content:', error);
      toast.error('Failed to update foundation content');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddProgram = () => {
    setFormData(prev => ({
      ...prev,
      programs: [
        ...prev.programs,
        {
          title: '',
          description: '',
          beneficiaries: '',
          iconName: 'Heart'
        }
      ]
    }));
  };

  // Function to render the appropriate icon based on iconName
  const renderProgramIcon = (iconName: string) => {
    // This is a simplified approach. In a real implementation, you'd import and use all the icons
    return <Heart className="text-primary" size={24} />;
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
      <FoundationForm
        foundationContent={formData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updating}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Foundation Content</h3>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Edit Content
        </button>
      </div>

      {foundationContent ? (
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-medium mb-2">Mission Statement</h4>
            <p className="text-sm p-4 border rounded-md bg-gray-50">{foundationContent.mission}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Heart className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Foundation Programs</h4>
            </div>
            <div className="border p-4 rounded-md">
              {foundationContent.programs && foundationContent.programs.length > 0 ? (
                <div className="space-y-4">
                  {foundationContent.programs.map((program, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{renderProgramIcon(program.iconName)}</div>
                        <div>
                          <h5 className="font-medium">{program.title}</h5>
                          <p className="text-sm mt-1">{program.description}</p>
                          <p className="text-xs text-text-light mt-1">Beneficiaries: {program.beneficiaries}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No programs added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <TrendingUp className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Impact Statistics</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foundationContent.impactStats && foundationContent.impactStats.length > 0 ? (
                foundationContent.impactStats.map((stat, index) => (
                  <div key={index} className="border p-4 rounded-md text-center">
                    <div className="text-xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm">{stat.description}</div>
                  </div>
                ))
              ) : (
                <p className="text-text-light text-sm col-span-3">No impact statistics added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Upcoming Events</h4>
            </div>
            <div className="border p-4 rounded-md">
              {foundationContent.upcomingEvents && foundationContent.upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {foundationContent.upcomingEvents.map((event, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <h5 className="font-medium">{event.title}</h5>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-text-light">{event.date}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No upcoming events added yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-text-light mb-4">No foundation content has been added yet</p>
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

export default FoundationTab; 