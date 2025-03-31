import React, { useState, useEffect } from 'react';
import { Event } from '../../../types/contentTypes';
import FormField from '../FormField';
import FileUpload from '../FileUpload';
import { Save, X } from 'lucide-react';

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Event, imageFile?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: undefined,
    location: '',
    imageUrl: '',
    link: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data if event is provided (edit mode)
  useEffect(() => {
    if (event) {
      // Convert dates to strings for form inputs
      const startDate = event.startDate instanceof Date 
        ? event.startDate.toISOString().substring(0, 10) 
        : typeof event.startDate === 'string'
          ? event.startDate
          : typeof event.startDate === 'object' && 'toDate' in event.startDate
            ? event.startDate.toDate().toISOString().substring(0, 10)
            : '';
            
      const endDate = event.endDate instanceof Date 
        ? event.endDate.toISOString().substring(0, 10) 
        : typeof event.endDate === 'string'
          ? event.endDate
          : typeof event.endDate === 'object' && 'toDate' in event.endDate
            ? event.endDate.toDate().toISOString().substring(0, 10)
            : '';
      
      setFormData({
        ...event,
        startDate: startDate,
        endDate: endDate || undefined
      } as Event);
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string dates back to Date objects
      const updatedFormData = {
        ...formData,
        startDate: new Date(formData.startDate as string),
        endDate: formData.endDate ? new Date(formData.endDate as string) : undefined
      };
      
      onSubmit(updatedFormData, imageFile || undefined);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">
          {event ? 'Edit Event' : 'Add New Event'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-light hover:text-text-dark"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <FormField
          id="title"
          label="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
          error={errors.title}
        />

        <FormField
          id="description"
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
          error={errors.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="startDate"
            label="Start Date"
            type="date"
            value={typeof formData.startDate === 'string' ? formData.startDate : ''}
            onChange={handleChange}
            required
            error={errors.startDate}
          />

          <FormField
            id="endDate"
            label="End Date (Optional)"
            type="date"
            value={typeof formData.endDate === 'string' ? formData.endDate : ''}
            onChange={handleChange}
          />
        </div>

        <FormField
          id="location"
          label="Location (Optional)"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="e.g., University of Ibadan, Nigeria"
        />

        <FormField
          id="link"
          label="Event Link (Optional)"
          type="url"
          value={formData.link || ''}
          onChange={handleChange}
          placeholder="https://..."
        />

        <FileUpload
          id="eventImage"
          label="Event Image (Optional)"
          onChange={handleImageChange}
          currentImageUrl={formData.imageUrl}
        />

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
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 