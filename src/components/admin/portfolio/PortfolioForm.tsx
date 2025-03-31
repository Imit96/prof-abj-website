import React, { useState, useEffect } from 'react';
import { PortfolioContent, PortfolioSection, PortfolioSubsection } from '../../../types/contentTypes';
import FormField from '../FormField';
import { Save, X, Plus, Minus, GripVertical } from 'lucide-react';

interface PortfolioFormProps {
  portfolioContent?: PortfolioContent;
  onSubmit: (portfolioContent: PortfolioContent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  portfolioContent,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<PortfolioContent>({
    sections: [{
      id: '1',
      title: '',
      description: '',
      iconName: 'FileText',
      order: 1,
      subsections: [{
        id: '1-1',
        title: '',
        content: '',
        type: 'text',
        order: 1
      }]
    }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (portfolioContent) {
      setFormData(portfolioContent);
    }
  }, [portfolioContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Section handlers
  const handleSectionChange = (index: number, field: keyof PortfolioSection, value: string) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `${prev.sections.length + 1}`,
          title: '',
          description: '',
          iconName: 'FileText',
          order: prev.sections.length + 1,
          subsections: [{
            id: `${prev.sections.length + 1}-1`,
            title: '',
            content: '',
            type: 'text',
            order: 1
          }]
        }
      ]
    }));
  };

  const removeSection = (index: number) => {
    if (formData.sections.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  // Subsection handlers
  const handleSubsectionChange = (sectionIndex: number, subsectionIndex: number, field: keyof PortfolioSubsection, value: string) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      const newSubsections = [...newSections[sectionIndex].subsections];
      newSubsections[subsectionIndex] = { ...newSubsections[subsectionIndex], [field]: value };
      newSections[sectionIndex] = { ...newSections[sectionIndex], subsections: newSubsections };
      return { ...prev, sections: newSections };
    });
  };

  const addSubsection = (sectionIndex: number) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      const section = newSections[sectionIndex];
      const newSubsection: PortfolioSubsection = {
        id: `${section.id}-${section.subsections.length + 1}`,
        title: '',
        content: '',
        type: 'text',
        order: section.subsections.length + 1
      };
      section.subsections.push(newSubsection);
      return { ...prev, sections: newSections };
    });
  };

  const removeSubsection = (sectionIndex: number, subsectionIndex: number) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      const section = newSections[sectionIndex];
      if (section.subsections.length === 1) return prev;
      section.subsections = section.subsections.filter((_, i) => i !== subsectionIndex);
      return { ...prev, sections: newSections };
    });
  };

  const handleMetadataChange = (sectionIndex: number, subsectionIndex: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      const section = newSections[sectionIndex];
      const subsection = section.subsections[subsectionIndex];
      subsection.metadata = { 
        ...subsection.metadata, 
        [field]: value === undefined ? '' : value 
      };
      return { ...prev, sections: newSections };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Portfolio Content</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-light hover:text-text-dark"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {formData.sections.map((section, sectionIndex) => (
          <div key={section.id} className="p-6 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Section {sectionIndex + 1}</h4>
              <button
                type="button"
                onClick={() => removeSection(sectionIndex)}
                className="text-red-500 hover:text-red-700"
                disabled={formData.sections.length === 1}
              >
                <Minus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <FormField
                id={`section-${sectionIndex}-title`}
                label="Title"
                value={section.title}
                onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                required
                error={errors[`section_${sectionIndex}_title`]}
              />
              <FormField
                id={`section-${sectionIndex}-description`}
                label="Description"
                value={section.description || ''}
                onChange={(e) => handleSectionChange(sectionIndex, 'description', e.target.value)}
                error={errors[`section_${sectionIndex}_description`]}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={section.iconName}
                  onChange={(e) => handleSectionChange(sectionIndex, 'iconName', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="FileText">File Text</option>
                  <option value="FlaskConical">Flask</option>
                  <option value="AwardIcon">Award</option>
                  <option value="Brain">Brain</option>
                  <option value="GraduationCap">Graduation Cap</option>
                  <option value="Users">Users</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-md font-medium">Subsections</h5>
                <button
                  type="button"
                  onClick={() => addSubsection(sectionIndex)}
                  className="text-primary hover:text-primary-dark flex items-center text-sm"
                >
                  <Plus size={16} className="mr-1" />
                  Add Subsection
                </button>
              </div>

              {section.subsections.map((subsection, subsectionIndex) => (
                <div key={subsection.id} className="p-4 border rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <h6 className="font-medium">Subsection {subsectionIndex + 1}</h6>
                    <button
                      type="button"
                      onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                      className="text-red-500 hover:text-red-700"
                      disabled={section.subsections.length === 1}
                    >
                      <Minus size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      id={`subsection-${sectionIndex}-${subsectionIndex}-title`}
                      label="Title"
                      value={subsection.title}
                      onChange={(e) => handleSubsectionChange(sectionIndex, subsectionIndex, 'title', e.target.value)}
                      required
                      error={errors[`subsection_${sectionIndex}_${subsectionIndex}_title`]}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={subsection.type}
                        onChange={(e) => handleSubsectionChange(sectionIndex, subsectionIndex, 'type', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="text">Text</option>
                        <option value="publication">Publication</option>
                        <option value="project">Project</option>
                        <option value="award">Award</option>
                      </select>
                    </div>
                    <FormField
                      id={`subsection-${sectionIndex}-${subsectionIndex}-content`}
                      label="Content"
                      value={subsection.content}
                      onChange={(e) => handleSubsectionChange(sectionIndex, subsectionIndex, 'content', e.target.value)}
                      required
                      error={errors[`subsection_${sectionIndex}_${subsectionIndex}_content`]}
                    />

                    {subsection.type === 'publication' && (
                      <div className="space-y-4">
                        <FormField
                          id={`subsection-${sectionIndex}-${subsectionIndex}-authors`}
                          label="Authors"
                          value={subsection.metadata?.authors || ''}
                          onChange={(e) => handleMetadataChange(sectionIndex, subsectionIndex, 'authors', e.target.value)}
                        />
                        <FormField
                          id={`subsection-${sectionIndex}-${subsectionIndex}-journal`}
                          label="Journal"
                          value={subsection.metadata?.journal || ''}
                          onChange={(e) => handleMetadataChange(sectionIndex, subsectionIndex, 'journal', e.target.value)}
                        />
                        <FormField
                          id={`subsection-${sectionIndex}-${subsectionIndex}-year`}
                          label="Year"
                          type="number"
                          value={subsection.metadata?.year || ''}
                          onChange={(e) => handleMetadataChange(sectionIndex, subsectionIndex, 'year', parseInt(e.target.value))}
                        />
                        <FormField
                          id={`subsection-${sectionIndex}-${subsectionIndex}-doi`}
                          label="DOI"
                          value={subsection.metadata?.doi || ''}
                          onChange={(e) => handleMetadataChange(sectionIndex, subsectionIndex, 'doi', e.target.value)}
                        />
                      </div>
                    )}

                    {subsection.type === 'project' && (
                      <FormField
                        id={`subsection-${sectionIndex}-${subsectionIndex}-period`}
                        label="Period"
                        value={subsection.metadata?.period || ''}
                        onChange={(e) => handleMetadataChange(sectionIndex, subsectionIndex, 'period', e.target.value)}
                      />
                    )}

                    {subsection.type === 'award' && (
                      <div className="space-y-4">
                        <FormField
                          id={`subsection-${sectionIndex}-${subsectionIndex}-organization`}
                          label="Organization"
                          value={subsection.metadata?.organization || ''}
                          onChange={(e) => handleMetadataChange(sectionIndex, subsectionIndex, 'organization', e.target.value)}
                        />
                        <FormField
                          id={`subsection-${sectionIndex}-${subsectionIndex}-year`}
                          label="Year"
                          type="number"
                          value={subsection.metadata?.year || ''}
                          onChange={(e) => handleMetadataChange(sectionIndex, subsectionIndex, 'year', parseInt(e.target.value))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={addSection}
            className="text-primary hover:text-primary-dark flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Section
          </button>
          <div className="space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-text-light hover:text-text-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PortfolioForm; 