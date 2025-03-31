import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../../../types/contentTypes';
import FormField from '../FormField';
import { Save, X } from 'lucide-react';

interface GalleryItemFormProps {
  galleryItem?: GalleryItem;
  onSubmit: (galleryItem: GalleryItem) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const GalleryItemForm: React.FC<GalleryItemFormProps> = ({
  galleryItem,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<GalleryItem>({
    title: '',
    description: '',
    imageUrl: '',
    category: 'research',
    order: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data if galleryItem is provided (edit mode)
  useEffect(() => {
    if (galleryItem) {
      setFormData({
        ...galleryItem,
        // Ensure order is a number
        order: typeof galleryItem.order === 'string' 
          ? parseInt(galleryItem.order) 
          : galleryItem.order
      });
    }
  }, [galleryItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
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

  const categoryOptions = [
    { value: 'research', label: 'Research' },
    { value: 'conferences', label: 'Conferences' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'awards', label: 'Awards' },
    { value: 'students', label: 'Students' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">
          {galleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
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
          error={errors.title}
        />

        <FormField
          id="description"
          label="Description"
          type="textarea"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
        />

        <FormField
          id="category"
          label="Category"
          type="select"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          required
          error={errors.category}
        />

        <FormField
          id="order"
          label="Display Order"
          type="number"
          value={formData.order}
          onChange={handleChange}
          required
        />

        <FormField
          id="imageUrl"
          label="Image URL"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          error={errors.imageUrl}
          placeholder="https://example.com/image.jpg"
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
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryItemForm; 