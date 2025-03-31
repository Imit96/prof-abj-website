import React, { useState, useEffect } from 'react';
import { ContactContent, ContactInfo, OfficeLocation } from '../../../types/contentTypes';
import FormField from '../FormField';
import { Save, X, Plus, Minus } from 'lucide-react';

interface ContactFormProps {
  contactContent?: ContactContent;
  onSubmit: (contactContent: ContactContent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contactContent,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ContactContent>({
    contactInfo: [{ title: 'Email', iconName: 'Mail', details: [''] }],
    officeLocations: [{ name: '', address: '', hours: '' }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contactContent) {
      setFormData({
        ...contactContent,
        contactInfo: contactContent.contactInfo?.length > 0 
          ? contactContent.contactInfo 
          : [{ title: 'Email', iconName: 'Mail', details: [''] }],
        officeLocations: contactContent.officeLocations?.length > 0
          ? contactContent.officeLocations
          : [{ name: '', address: '', hours: '' }]
      });
    }
  }, [contactContent]);

  // Contact info handlers
  const handleInfoChange = (index: number, field: keyof ContactInfo, value: string | string[]) => {
    setFormData((prev) => {
      const newInfo = [...prev.contactInfo];
      if (field === 'details' && typeof value === 'string') {
        // If details field is being set as a string, convert it to an array
        return prev;
      }
      newInfo[index] = { ...newInfo[index], [field]: value };
      return { ...prev, contactInfo: newInfo };
    });
  };

  const handleInfoDetailChange = (infoIndex: number, detailIndex: number, value: string) => {
    setFormData((prev) => {
      const newInfo = [...prev.contactInfo];
      const details = [...newInfo[infoIndex].details];
      details[detailIndex] = value;
      newInfo[infoIndex] = { ...newInfo[infoIndex], details };
      return { ...prev, contactInfo: newInfo };
    });
  };

  const addInfoDetail = (infoIndex: number) => {
    setFormData((prev) => {
      const newInfo = [...prev.contactInfo];
      const details = [...newInfo[infoIndex].details, ''];
      newInfo[infoIndex] = { ...newInfo[infoIndex], details };
      return { ...prev, contactInfo: newInfo };
    });
  };

  const removeInfoDetail = (infoIndex: number, detailIndex: number) => {
    if (formData.contactInfo[infoIndex].details.length === 1) return;
    setFormData((prev) => {
      const newInfo = [...prev.contactInfo];
      const details = newInfo[infoIndex].details.filter((_, i) => i !== detailIndex);
      newInfo[infoIndex] = { ...newInfo[infoIndex], details };
      return { ...prev, contactInfo: newInfo };
    });
  };

  const addInfo = () => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: [...prev.contactInfo, { title: '', iconName: 'Info', details: [''] }]
    }));
  };

  const removeInfo = (index: number) => {
    if (formData.contactInfo.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== index)
    }));
  };

  // Office locations handlers
  const handleLocationChange = (index: number, field: keyof OfficeLocation, value: string) => {
    setFormData((prev) => {
      const newLocations = [...prev.officeLocations];
      newLocations[index] = { ...newLocations[index], [field]: value };
      return { ...prev, officeLocations: newLocations };
    });
  };

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      officeLocations: [...prev.officeLocations, { name: '', address: '', hours: '' }]
    }));
  };

  const removeLocation = (index: number) => {
    if (formData.officeLocations.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      officeLocations: prev.officeLocations.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate each contact info
    formData.contactInfo.forEach((info, index) => {
      if (!info.title.trim()) {
        newErrors[`info_${index}_title`] = 'Title is required';
      }
      
      info.details.forEach((detail, detailIndex) => {
        if (!detail.trim()) {
          newErrors[`info_${index}_detail_${detailIndex}`] = 'Detail is required';
        }
      });
    });
    
    // Validate each office location
    formData.officeLocations.forEach((location, index) => {
      if (!location.name.trim()) {
        newErrors[`location_${index}_name`] = 'Office name is required';
      }
      if (!location.address.trim()) {
        newErrors[`location_${index}_address`] = 'Address is required';
      }
      if (!location.hours.trim()) {
        newErrors[`location_${index}_hours`] = 'Office hours are required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Available icons for contact info
  const iconOptions = [
    'Mail', 'Phone', 'MapPin', 'Clock', 'Building', 'Info', 'Globe', 'MessageCircle'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Contact Page Content</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-light hover:text-text-dark"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Contact Information</h4>
            <button
              type="button"
              onClick={addInfo}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Contact Info
            </button>
          </div>
          
          {formData.contactInfo.map((info, infoIndex) => (
            <div key={infoIndex} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Contact Info #{infoIndex + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeInfo(infoIndex)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.contactInfo.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id={`info-${infoIndex}-title`}
                    label="Title"
                    value={info.title}
                    onChange={(e) => handleInfoChange(infoIndex, 'title', e.target.value)}
                    required
                    error={errors[`info_${infoIndex}_title`]}
                  />
                  <div>
                    <label htmlFor={`info-${infoIndex}-icon`} className="block text-sm font-medium mb-1">
                      Icon
                    </label>
                    <select
                      id={`info-${infoIndex}-icon`}
                      value={info.iconName}
                      onChange={(e) => handleInfoChange(infoIndex, 'iconName', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Details</label>
                    <button
                      type="button"
                      onClick={() => addInfoDetail(infoIndex)}
                      className="text-primary hover:text-primary-dark flex items-center text-xs"
                    >
                      <Plus size={12} className="mr-1" />
                      Add Detail
                    </button>
                  </div>
                  
                  {info.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center mb-2">
                      <FormField
                        id={`info-${infoIndex}-detail-${detailIndex}`}
                        value={detail}
                        onChange={(e) => handleInfoDetailChange(infoIndex, detailIndex, e.target.value)}
                        required
                        error={errors[`info_${infoIndex}_detail_${detailIndex}`]}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeInfoDetail(infoIndex, detailIndex)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={info.details.length === 1}
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Office Locations Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Office Locations</h4>
            <button
              type="button"
              onClick={addLocation}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Office Location
            </button>
          </div>
          
          {formData.officeLocations.map((location, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Office #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.officeLocations.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`location-${index}-name`}
                  label="Office Name"
                  value={location.name}
                  onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                  required
                  error={errors[`location_${index}_name`]}
                />
                <FormField
                  id={`location-${index}-address`}
                  label="Address"
                  type="textarea"
                  value={location.address}
                  onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                  rows={2}
                  required
                  error={errors[`location_${index}_address`]}
                />
                <FormField
                  id={`location-${index}-hours`}
                  label="Office Hours"
                  value={location.hours}
                  onChange={(e) => handleLocationChange(index, 'hours', e.target.value)}
                  placeholder="e.g., 'Mon-Fri: 9am-5pm'"
                  required
                  error={errors[`location_${index}_hours`]}
                />
              </div>
            </div>
          ))}
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

export default ContactForm; 