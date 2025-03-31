import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PortfolioContent, PortfolioSection, PortfolioSubsection } from '../../../types/contentTypes';
import FormField from '../FormField';

interface PortfolioFormProps {
  content: PortfolioContent | null;
  onSave: (content: PortfolioContent) => Promise<void>;
  onCancel: () => void;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ content, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PortfolioContent>(
    content || {
      sections: []
    }
  );

  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          description: '',
          iconName: 'BookOpen',
          subsections: [],
          order: prev.sections.length + 1
        }
      ]
    }));
  };

  const handleRemoveSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSectionChange = (index: number, field: keyof PortfolioSection, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleAddSubsection = (sectionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              subsections: [
                ...section.subsections,
                {
                  title: '',
                  content: '',
                  type: 'text',
                  order: section.subsections.length + 1
                }
              ]
            }
          : section
      )
    }));
  };

  const handleRemoveSubsection = (sectionIndex: number, subsectionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              subsections: section.subsections.filter((_, j) => j !== subsectionIndex)
            }
          : section
      )
    }));
  };

  const handleSubsectionChange = (
    sectionIndex: number,
    subsectionIndex: number,
    field: keyof PortfolioSubsection,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              subsections: section.subsections.map((subsection, j) =>
                j === subsectionIndex ? { ...subsection, [field]: value } : subsection
              )
            }
          : section
      )
    }));
  };

  const handleMetadataChange = (
    sectionIndex: number,
    subsectionIndex: number,
    field: string,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              subsections: section.subsections.map((subsection, j) =>
                j === subsectionIndex
                  ? {
                      ...subsection,
                      metadata: {
                        ...(subsection.metadata || {}),
                        [field]: value || (typeof value === 'number' ? 0 : '')
                      }
                    }
                  : subsection
              )
            }
          : section
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Portfolio Content</h2>
        <div className="space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-text-light hover:text-text-dark transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {formData.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 space-y-4">
                <FormField
                  id={`section-${sectionIndex}-title`}
                  label="Section Title"
                  value={section.title || ''}
                  onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value || '')}
                />
                <FormField
                  id={`section-${sectionIndex}-description`}
                  label="Section Description"
                  value={section.description || ''}
                  onChange={(e) => handleSectionChange(sectionIndex, 'description', e.target.value || '')}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSection(sectionIndex)}
                className="ml-4 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Subsections</h3>
                <button
                  type="button"
                  onClick={() => handleAddSubsection(sectionIndex)}
                  className="flex items-center text-primary hover:text-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subsection
                </button>
              </div>

              {section.subsections.map((subsection, subsectionIndex) => (
                <div key={subsectionIndex} className="bg-background-alt p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 space-y-4">
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-title`}
                        label="Subsection Title"
                        value={subsection.title || ''}
                        onChange={(e) =>
                          handleSubsectionChange(sectionIndex, subsectionIndex, 'title', e.target.value || '')
                        }
                      />
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-content`}
                        label="Subsection Content"
                        value={subsection.content || ''}
                        onChange={(e) =>
                          handleSubsectionChange(sectionIndex, subsectionIndex, 'content', e.target.value || '')
                        }
                      />
                      <select
                        id={`subsection-${sectionIndex}-${subsectionIndex}-type`}
                        value={subsection.type}
                        onChange={(e) =>
                          handleSubsectionChange(sectionIndex, subsectionIndex, 'type', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="text">Text</option>
                        <option value="publication">Publication</option>
                        <option value="project">Project</option>
                        <option value="award">Award</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubsection(sectionIndex, subsectionIndex)}
                      className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {subsection.type === 'publication' && (
                    <div className="space-y-4 mt-4">
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-authors`}
                        label="Authors"
                        value={subsection.metadata?.authors || ''}
                        onChange={(e) =>
                          handleMetadataChange(sectionIndex, subsectionIndex, 'authors', e.target.value || '')
                        }
                      />
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-journal`}
                        label="Journal"
                        value={subsection.metadata?.journal || ''}
                        onChange={(e) =>
                          handleMetadataChange(sectionIndex, subsectionIndex, 'journal', e.target.value || '')
                        }
                      />
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-year`}
                        label="Year"
                        value={subsection.metadata?.year?.toString() || ''}
                        onChange={(e) =>
                          handleMetadataChange(sectionIndex, subsectionIndex, 'year', parseInt(e.target.value) || 0)
                        }
                      />
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-doi`}
                        label="DOI"
                        value={subsection.metadata?.doi || ''}
                        onChange={(e) =>
                          handleMetadataChange(sectionIndex, subsectionIndex, 'doi', e.target.value || '')
                        }
                      />
                    </div>
                  )}

                  {subsection.type === 'project' && (
                    <div className="space-y-4 mt-4">
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-period`}
                        label="Period"
                        value={subsection.metadata?.period || ''}
                        onChange={(e) =>
                          handleMetadataChange(sectionIndex, subsectionIndex, 'period', e.target.value || '')
                        }
                      />
                    </div>
                  )}

                  {subsection.type === 'award' && (
                    <div className="space-y-4 mt-4">
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-organization`}
                        label="Organization"
                        value={subsection.metadata?.organization || ''}
                        onChange={(e) =>
                          handleMetadataChange(sectionIndex, subsectionIndex, 'organization', e.target.value || '')
                        }
                      />
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-year`}
                        label="Year"
                        value={subsection.metadata?.year?.toString() || ''}
                        onChange={(e) =>
                          handleMetadataChange(sectionIndex, subsectionIndex, 'year', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center text-primary hover:text-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Section
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm; 