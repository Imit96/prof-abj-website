import React, { useState, useEffect } from 'react';
import { Publication } from '../../../types/contentTypes';
import FormField from '../FormField';
import { Save, X } from 'lucide-react';

interface PublicationFormProps {
  publication?: Publication;
  onSubmit: (publication: Publication) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PublicationForm: React.FC<PublicationFormProps> = ({
  publication,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Publication>({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    abstract: '',
    link: ''
  });

  // Initialize form data if publication is provided (edit mode)
  useEffect(() => {
    if (publication) {
      setFormData({
        ...publication,
        // Ensure year is a number
        year: typeof publication.year === 'string' 
          ? parseInt(publication.year) 
          : publication.year
      });
    }
  }, [publication]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">
          {publication ? 'Edit Publication' : 'Add New Publication'}
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
          label="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <FormField
          id="authors"
          label="Authors"
          value={formData.authors}
          onChange={handleChange}
          placeholder="e.g., Smith, J., Doe, A."
          required
        />

        <FormField
          id="journal"
          label="Journal"
          value={formData.journal}
          onChange={handleChange}
          required
        />

        <FormField
          id="year"
          label="Year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          required
        />

        <FormField
          id="doi"
          label="DOI"
          value={formData.doi || ''}
          onChange={handleChange}
          placeholder="e.g., 10.1000/xyz123"
        />

        <FormField
          id="abstract"
          label="Abstract"
          type="textarea"
          value={formData.abstract || ''}
          onChange={handleChange}
          rows={5}
        />

        <FormField
          id="link"
          label="External Link"
          type="url"
          value={formData.link || ''}
          onChange={handleChange}
          placeholder="https://..."
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
            Save Publication
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicationForm; 