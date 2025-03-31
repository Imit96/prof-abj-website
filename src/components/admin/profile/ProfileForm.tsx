import React, { useState, useEffect } from 'react';
import { ProfileInfo, EducationItem, ExperienceItem, AwardItem } from '../../../types/contentTypes';
import FormField from '../FormField';
import FileUpload from '../FileUpload';
import { Save, X, Plus, Minus } from 'lucide-react';

interface ProfileFormProps {
  profile?: ProfileInfo;
  onSubmit: (profile: ProfileInfo, imageFile?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ProfileInfo>({
    name: '',
    title: '',
    bio: '',
    education: [{ degree: '', institution: '', year: '', description: '' }],
    experience: [{ position: '', institution: '', startYear: '', endYear: '', description: '' }],
    awards: [{ title: '', organization: '', year: '', description: '' }],
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data if profile is provided
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        // Ensure arrays are initialized
        education: profile.education?.length > 0 
          ? profile.education 
          : [{ degree: '', institution: '', year: '', description: '' }],
        experience: profile.experience?.length > 0
          ? profile.experience
          : [{ position: '', institution: '', startYear: '', endYear: '', description: '' }],
        awards: profile.awards?.length > 0
          ? profile.awards
          : [{ title: '', organization: '', year: '', description: '' }]
      });
    }
  }, [profile]);

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

  const handleEducationChange = (index: number, field: keyof EducationItem, value: string) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: string) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const handleAwardChange = (index: number, field: keyof AwardItem, value: string) => {
    setFormData((prev) => {
      const newAwards = [...prev.awards];
      newAwards[index] = { ...newAwards[index], [field]: value };
      return { ...prev, awards: newAwards };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '', description: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { position: '', institution: '', startYear: '', endYear: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    if (formData.experience.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addAward = () => {
    setFormData((prev) => ({
      ...prev,
      awards: [...prev.awards, { title: '', organization: '', year: '', description: '' }]
    }));
  };

  const removeAward = (index: number) => {
    if (formData.awards.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, imageFile || undefined);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Edit Profile</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-light hover:text-text-dark"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div>
          <h4 className="text-lg font-medium mb-4">Basic Information</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
              />
              <FormField
                id="title"
                label="Job Title/Position"
                value={formData.title}
                onChange={handleChange}
                required
                error={errors.title}
              />
            </div>

            <FormField
              id="bio"
              label="Bio"
              type="textarea"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              required
              error={errors.bio}
            />

            <FileUpload
              id="profileImage"
              label="Profile Image"
              onChange={handleImageChange}
              currentImageUrl={formData.imageUrl}
            />
          </div>
        </div>

        {/* Education Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Education</h4>
            <button
              type="button"
              onClick={addEducation}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Education
            </button>
          </div>
          
          {formData.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Education #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.education.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id={`education-${index}-degree`}
                    label="Degree/Certificate"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    required
                  />
                  <FormField
                    id={`education-${index}-institution`}
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id={`education-${index}-year`}
                    label="Year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    required
                  />
                  <FormField
                    id={`education-${index}-description`}
                    label="Description (Optional)"
                    value={edu.description || ''}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Experience</h4>
            <button
              type="button"
              onClick={addExperience}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Experience
            </button>
          </div>
          
          {formData.experience.map((exp, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Experience #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.experience.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`experience-${index}-position`}
                  label="Position"
                  value={exp.position}
                  onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                  required
                />
                <FormField
                  id={`experience-${index}-institution`}
                  label="Institution/Company"
                  value={exp.institution}
                  onChange={(e) => handleExperienceChange(index, 'institution', e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id={`experience-${index}-startYear`}
                    label="Start Year"
                    value={exp.startYear}
                    onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)}
                    required
                  />
                  <FormField
                    id={`experience-${index}-endYear`}
                    label="End Year (or 'Present')"
                    value={exp.endYear}
                    onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)}
                    required
                  />
                </div>
                <FormField
                  id={`experience-${index}-description`}
                  label="Description (Optional)"
                  type="textarea"
                  value={exp.description || ''}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Awards Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Awards & Honors</h4>
            <button
              type="button"
              onClick={addAward}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Award
            </button>
          </div>
          
          {formData.awards.map((award, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Award #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeAward(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.awards.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`award-${index}-title`}
                  label="Award Title"
                  value={award.title}
                  onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id={`award-${index}-organization`}
                    label="Organization"
                    value={award.organization}
                    onChange={(e) => handleAwardChange(index, 'organization', e.target.value)}
                    required
                  />
                  <FormField
                    id={`award-${index}-year`}
                    label="Year"
                    value={award.year}
                    onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                    required
                  />
                </div>
                <FormField
                  id={`award-${index}-description`}
                  label="Description (Optional)"
                  type="textarea"
                  value={award.description || ''}
                  onChange={(e) => handleAwardChange(index, 'description', e.target.value)}
                  rows={3}
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
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm; 