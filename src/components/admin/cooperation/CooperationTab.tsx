import React, { useState, useEffect } from 'react';
import { getCooperationContent, updateCooperationContent } from '../../../services/contentService';
import Spinner from '../../ui/Spinner';
import { Users, Building2, Network, Users2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CooperationForm from './CooperationForm';
import { CooperationContent } from '../../../types/contentTypes';

const CooperationTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cooperationContent, setCooperationContent] = useState<CooperationContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCooperationContent();
  }, []);

  const fetchCooperationContent = async () => {
    setLoading(true);
    try {
      const content = await getCooperationContent();
      setCooperationContent(content);
    } catch (error) {
      console.error('Error fetching cooperation content:', error);
      toast.error('Failed to load cooperation content');
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

  const handleSubmit = async (updatedContent: CooperationContent) => {
    setUpdating(true);
    try {
      await updateCooperationContent(updatedContent);
      setCooperationContent(updatedContent);
      toast.success('Cooperation content updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating cooperation content:', error);
      toast.error('Failed to update cooperation content');
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
      <CooperationForm
        cooperationContent={cooperationContent || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updating}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Cooperation Content</h3>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Edit Content
        </button>
      </div>

      {cooperationContent ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Users className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Academic Collaborations</h4>
            </div>
            <div className="border p-4 rounded-md">
              {cooperationContent.academicCollaborations && cooperationContent.academicCollaborations.length > 0 ? (
                <div className="space-y-4">
                  {cooperationContent.academicCollaborations.map((collab, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <h5 className="font-medium">{collab.institution}</h5>
                      <p className="text-sm mt-1">{collab.description}</p>
                      {collab.contactPerson && (
                        <p className="text-xs text-text-light mt-1">Contact: {collab.contactPerson}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No academic collaborations added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Building2 className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Industry Partnerships</h4>
            </div>
            <div className="border p-4 rounded-md">
              {cooperationContent.industryPartnerships && cooperationContent.industryPartnerships.length > 0 ? (
                <div className="space-y-4">
                  {cooperationContent.industryPartnerships.map((partner, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{partner.company}</h5>
                        <span className="text-sm text-text-light">Since {partner.year}</span>
                      </div>
                      <p className="text-sm mt-1">{partner.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No industry partnerships added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Network className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Research Networks</h4>
            </div>
            <div className="border p-4 rounded-md">
              {cooperationContent.researchNetworks && cooperationContent.researchNetworks.length > 0 ? (
                <div className="space-y-4">
                  {cooperationContent.researchNetworks.map((network, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{network.name}</h5>
                        <span className="text-sm text-text-light">{network.members} members</span>
                      </div>
                      <p className="text-sm mt-1">{network.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No research networks added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Users2 className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Collaboration Opportunities</h4>
            </div>
            <div className="border p-4 rounded-md">
              {cooperationContent.collaborationOpportunities ? (
                <p className="text-sm">{cooperationContent.collaborationOpportunities}</p>
              ) : (
                <p className="text-text-light text-sm">No collaboration opportunities text added yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-text-light mb-4">No cooperation content has been added yet</p>
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

export default CooperationTab; 