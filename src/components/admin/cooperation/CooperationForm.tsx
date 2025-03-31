import React, { useState, useEffect } from 'react';
import { CooperationContent, AcademicCollaboration, IndustryPartnership, ResearchNetwork } from '../../../types/contentTypes';
import FormField from '../FormField';
import { Save, X, Plus, Minus } from 'lucide-react';

interface CooperationFormProps {
  cooperationContent?: CooperationContent;
  onSubmit: (cooperationContent: CooperationContent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CooperationForm: React.FC<CooperationFormProps> = ({
  cooperationContent,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CooperationContent>({
    academicCollaborations: [{ institution: '', description: '', contactPerson: '' }],
    industryPartnerships: [{ company: '', description: '', year: '' }],
    researchNetworks: [{ name: '', description: '', members: 0 }],
    collaborationOpportunities: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cooperationContent) {
      setFormData({
        ...cooperationContent,
        academicCollaborations: cooperationContent.academicCollaborations?.length > 0 
          ? cooperationContent.academicCollaborations 
          : [{ institution: '', description: '', contactPerson: '' }],
        industryPartnerships: cooperationContent.industryPartnerships?.length > 0
          ? cooperationContent.industryPartnerships
          : [{ company: '', description: '', year: '' }],
        researchNetworks: cooperationContent.researchNetworks?.length > 0 
          ? cooperationContent.researchNetworks
          : [{ name: '', description: '', members: 0 }],
        collaborationOpportunities: cooperationContent.collaborationOpportunities || ''
      });
    }
  }, [cooperationContent]);

  // Academic collaborations handlers
  const handleCollaborationChange = (index: number, field: keyof AcademicCollaboration, value: string) => {
    setFormData((prev) => {
      const newCollaborations = [...prev.academicCollaborations];
      newCollaborations[index] = { ...newCollaborations[index], [field]: value };
      return { ...prev, academicCollaborations: newCollaborations };
    });
  };

  const addCollaboration = () => {
    setFormData((prev) => ({
      ...prev,
      academicCollaborations: [...prev.academicCollaborations, { institution: '', description: '', contactPerson: '' }]
    }));
  };

  const removeCollaboration = (index: number) => {
    if (formData.academicCollaborations.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      academicCollaborations: prev.academicCollaborations.filter((_, i) => i !== index)
    }));
  };

  // Industry partnerships handlers
  const handlePartnershipChange = (index: number, field: keyof IndustryPartnership, value: string) => {
    setFormData((prev) => {
      const newPartnerships = [...prev.industryPartnerships];
      newPartnerships[index] = { ...newPartnerships[index], [field]: value };
      return { ...prev, industryPartnerships: newPartnerships };
    });
  };

  const addPartnership = () => {
    setFormData((prev) => ({
      ...prev,
      industryPartnerships: [...prev.industryPartnerships, { company: '', description: '', year: '' }]
    }));
  };

  const removePartnership = (index: number) => {
    if (formData.industryPartnerships.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      industryPartnerships: prev.industryPartnerships.filter((_, i) => i !== index)
    }));
  };

  // Research networks handlers
  const handleNetworkChange = (index: number, field: keyof ResearchNetwork, value: string | number) => {
    setFormData((prev) => {
      const newNetworks = [...prev.researchNetworks];
      newNetworks[index] = { 
        ...newNetworks[index], 
        [field]: field === 'members' ? Number(value) : value 
      };
      return { ...prev, researchNetworks: newNetworks };
    });
  };

  const addNetwork = () => {
    setFormData((prev) => ({
      ...prev,
      researchNetworks: [...prev.researchNetworks, { name: '', description: '', members: 0 }]
    }));
  };

  const removeNetwork = (index: number) => {
    if (formData.researchNetworks.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      researchNetworks: prev.researchNetworks.filter((_, i) => i !== index)
    }));
  };

  // Collaboration opportunities handler
  const handleOpportunitiesChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      collaborationOpportunities: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate each academic collaboration
    formData.academicCollaborations.forEach((collab, index) => {
      if (!collab.institution.trim()) {
        newErrors[`collab_${index}_institution`] = 'Institution name is required';
      }
      if (!collab.description.trim()) {
        newErrors[`collab_${index}_description`] = 'Description is required';
      }
    });
    
    // Validate each industry partnership
    formData.industryPartnerships.forEach((partner, index) => {
      if (!partner.company.trim()) {
        newErrors[`partner_${index}_company`] = 'Company name is required';
      }
      if (!partner.description.trim()) {
        newErrors[`partner_${index}_description`] = 'Description is required';
      }
      if (!partner.year.trim()) {
        newErrors[`partner_${index}_year`] = 'Year is required';
      }
    });
    
    // Validate each research network
    formData.researchNetworks.forEach((network, index) => {
      if (!network.name.trim()) {
        newErrors[`network_${index}_name`] = 'Network name is required';
      }
      if (!network.description.trim()) {
        newErrors[`network_${index}_description`] = 'Description is required';
      }
    });

    if (!formData.collaborationOpportunities.trim()) {
      newErrors.collaborationOpportunities = 'Collaboration opportunities text is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Cooperation Content</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-light hover:text-text-dark"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Academic Collaborations Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Academic Collaborations</h4>
            <button
              type="button"
              onClick={addCollaboration}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Collaboration
            </button>
          </div>
          
          {formData.academicCollaborations.map((collab, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Collaboration #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeCollaboration(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.academicCollaborations.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`collab-${index}-institution`}
                  label="Institution"
                  value={collab.institution}
                  onChange={(e) => handleCollaborationChange(index, 'institution', e.target.value)}
                  required
                  error={errors[`collab_${index}_institution`]}
                />
                <FormField
                  id={`collab-${index}-description`}
                  label="Description"
                  type="textarea"
                  value={collab.description}
                  onChange={(e) => handleCollaborationChange(index, 'description', e.target.value)}
                  rows={3}
                  required
                  error={errors[`collab_${index}_description`]}
                />
                <FormField
                  id={`collab-${index}-contact`}
                  label="Contact Person (Optional)"
                  value={collab.contactPerson || ''}
                  onChange={(e) => handleCollaborationChange(index, 'contactPerson', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Industry Partnerships Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Industry Partnerships</h4>
            <button
              type="button"
              onClick={addPartnership}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Partnership
            </button>
          </div>
          
          {formData.industryPartnerships.map((partner, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Partnership #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removePartnership(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.industryPartnerships.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`partner-${index}-company`}
                  label="Company"
                  value={partner.company}
                  onChange={(e) => handlePartnershipChange(index, 'company', e.target.value)}
                  required
                  error={errors[`partner_${index}_company`]}
                />
                <FormField
                  id={`partner-${index}-description`}
                  label="Description"
                  type="textarea"
                  value={partner.description}
                  onChange={(e) => handlePartnershipChange(index, 'description', e.target.value)}
                  rows={3}
                  required
                  error={errors[`partner_${index}_description`]}
                />
                <FormField
                  id={`partner-${index}-year`}
                  label="Year Started"
                  value={partner.year}
                  onChange={(e) => handlePartnershipChange(index, 'year', e.target.value)}
                  placeholder="e.g., 2019"
                  required
                  error={errors[`partner_${index}_year`]}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Research Networks Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Research Networks</h4>
            <button
              type="button"
              onClick={addNetwork}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Network
            </button>
          </div>
          
          {formData.researchNetworks.map((network, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Network #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeNetwork(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.researchNetworks.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`network-${index}-name`}
                  label="Network Name"
                  value={network.name}
                  onChange={(e) => handleNetworkChange(index, 'name', e.target.value)}
                  required
                  error={errors[`network_${index}_name`]}
                />
                <FormField
                  id={`network-${index}-description`}
                  label="Description"
                  type="textarea"
                  value={network.description}
                  onChange={(e) => handleNetworkChange(index, 'description', e.target.value)}
                  rows={3}
                  required
                  error={errors[`network_${index}_description`]}
                />
                <FormField
                  id={`network-${index}-members`}
                  label="Number of Members"
                  type="number"
                  value={network.members}
                  onChange={(e) => handleNetworkChange(index, 'members', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Collaboration Opportunities Section */}
        <div>
          <h4 className="text-lg font-medium mb-4">Collaboration Opportunities</h4>
          <FormField
            id="collaboration-opportunities"
            label="Information Text"
            type="textarea"
            value={formData.collaborationOpportunities}
            onChange={(e) => handleOpportunitiesChange(e.target.value)}
            rows={4}
            required
            error={errors.collaborationOpportunities}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <Save size={16} className="mr-2" />
            Save Content
          </button>
        </div>
      </form>
    </div>
  );
};

export default CooperationForm; 