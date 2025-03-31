import React, { useState, useEffect } from 'react';
import { getContactContent, updateContactContent } from '../../../services/contentService';
import Spinner from '../../ui/Spinner';
import { Mail, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import ContactForm from './ContactForm';
import { ContactContent } from '../../../types/contentTypes';

const ContactTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<ContactContent>({
    contactInfo: [],
    officeLocations: []
  });

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    setLoading(true);
    try {
      const content = await getContactContent();
      setContactContent(content);
    } catch (error) {
      console.error('Error fetching contact content:', error);
      toast.error('Failed to load contact content');
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

  const handleSubmit = async (updatedContent: ContactContent) => {
    setUpdating(true);
    try {
      await updateContactContent(updatedContent);
      setContactContent(updatedContent);
      toast.success('Contact content updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact content:', error);
      toast.error('Failed to update contact content');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddContactInfo = () => {
    setFormData(prev => ({
      ...prev,
      contactInfo: [
        ...prev.contactInfo,
        {
          title: '',
          iconName: 'Mail',
          details: ['']
        }
      ]
    }));
  };

  // Function to render the appropriate icon based on iconName
  const renderInfoIcon = (iconName: string) => {
    // This is a simplified approach. In a real implementation, you'd import and use all the icons
    return <Mail className="text-primary" size={20} />;
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
      <ContactForm
        contactContent={contactContent || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updating}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Contact Page Content</h3>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Edit Content
        </button>
      </div>

      {contactContent ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Contact Information</h4>
            </div>
            <div className="border p-4 rounded-md">
              {contactContent.contactInfo && contactContent.contactInfo.length > 0 ? (
                <div className="space-y-6">
                  {contactContent.contactInfo.map((info, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{renderInfoIcon(info.iconName)}</div>
                        <div>
                          <h5 className="font-medium">{info.title}</h5>
                          <ul className="mt-1 space-y-1">
                            {info.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-sm">{detail}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-light text-sm">No contact information added yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Building className="text-primary mr-2" size={20} />
              <h4 className="text-lg font-medium">Office Locations</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactContent.officeLocations && contactContent.officeLocations.length > 0 ? (
                contactContent.officeLocations.map((location, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <h5 className="font-medium">{location.name}</h5>
                    <p className="text-sm mt-1 whitespace-pre-line">{location.address}</p>
                    <p className="text-sm text-text-light mt-2">Hours: {location.hours}</p>
                  </div>
                ))
              ) : (
                <p className="text-text-light text-sm col-span-2">No office locations added yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-text-light mb-4">No contact content has been added yet</p>
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

export default ContactTab; 