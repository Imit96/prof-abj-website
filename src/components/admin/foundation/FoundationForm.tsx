import React, { useState, useEffect } from 'react';
import { FoundationContent, FoundationProgram, ImpactStat, FoundationEvent } from '../../../types/contentTypes';
import FormField from '../FormField';
import { Save, X, Plus, Minus } from 'lucide-react';

interface FoundationFormProps {
  foundationContent?: FoundationContent;
  onSubmit: (foundationContent: FoundationContent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const FoundationForm: React.FC<FoundationFormProps> = ({
  foundationContent,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<FoundationContent>({
    mission: '',
    programs: [{ title: '', description: '', beneficiaries: '', iconName: 'Award' }],
    impactStats: [{ number: '', description: '' }],
    upcomingEvents: [{ title: '', date: '', location: '' }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (foundationContent) {
      setFormData({
        ...foundationContent,
        mission: foundationContent.mission || '',
        programs: foundationContent.programs?.length > 0 
          ? foundationContent.programs 
          : [{ title: '', description: '', beneficiaries: '', iconName: 'Award' }],
        impactStats: foundationContent.impactStats?.length > 0
          ? foundationContent.impactStats
          : [{ number: '', description: '' }],
        upcomingEvents: foundationContent.upcomingEvents?.length > 0 
          ? foundationContent.upcomingEvents
          : [{ title: '', date: '', location: '' }]
      });
    }
  }, [foundationContent]);

  // Mission statement handler
  const handleMissionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mission: value
    }));
  };

  // Programs handlers
  const handleProgramChange = (index: number, field: keyof FoundationProgram, value: string) => {
    setFormData((prev) => {
      const newPrograms = [...prev.programs];
      newPrograms[index] = { ...newPrograms[index], [field]: value };
      return { ...prev, programs: newPrograms };
    });
  };

  const addProgram = () => {
    setFormData((prev) => ({
      ...prev,
      programs: [...prev.programs, { title: '', description: '', beneficiaries: '', iconName: 'Award' }]
    }));
  };

  const removeProgram = (index: number) => {
    if (formData.programs.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }));
  };

  // Impact stats handlers
  const handleStatChange = (index: number, field: keyof ImpactStat, value: string) => {
    setFormData((prev) => {
      const newStats = [...prev.impactStats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, impactStats: newStats };
    });
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      impactStats: [...prev.impactStats, { number: '', description: '' }]
    }));
  };

  const removeStat = (index: number) => {
    if (formData.impactStats.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      impactStats: prev.impactStats.filter((_, i) => i !== index)
    }));
  };

  // Events handlers
  const handleEventChange = (index: number, field: keyof FoundationEvent, value: string) => {
    setFormData((prev) => {
      const newEvents = [...prev.upcomingEvents];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return { ...prev, upcomingEvents: newEvents };
    });
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      upcomingEvents: [...prev.upcomingEvents, { title: '', date: '', location: '' }]
    }));
  };

  const removeEvent = (index: number) => {
    if (formData.upcomingEvents.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.mission.trim()) {
      newErrors.mission = 'Mission statement is required';
    }
    
    // Validate each program
    formData.programs.forEach((program, index) => {
      if (!program.title.trim()) {
        newErrors[`program_${index}_title`] = 'Title is required';
      }
      if (!program.description.trim()) {
        newErrors[`program_${index}_description`] = 'Description is required';
      }
      if (!program.beneficiaries.trim()) {
        newErrors[`program_${index}_beneficiaries`] = 'Beneficiaries information is required';
      }
    });
    
    // Validate each impact stat
    formData.impactStats.forEach((stat, index) => {
      if (!stat.number.trim()) {
        newErrors[`stat_${index}_number`] = 'Number/value is required';
      }
      if (!stat.description.trim()) {
        newErrors[`stat_${index}_description`] = 'Description is required';
      }
    });
    
    // Validate each event
    formData.upcomingEvents.forEach((event, index) => {
      if (!event.title.trim()) {
        newErrors[`event_${index}_title`] = 'Title is required';
      }
      if (!event.date.trim()) {
        newErrors[`event_${index}_date`] = 'Date is required';
      }
      if (!event.location.trim()) {
        newErrors[`event_${index}_location`] = 'Location is required';
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

  // Available icons for programs
  const iconOptions = [
    'Award', 'BookOpen', 'HeartPulse', 'GraduationCap', 'Microscope', 
    'Stethoscope', 'Users', 'Building', 'HelpingHand', 'Leaf'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Foundation Content</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-light hover:text-text-dark"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mission Statement Section */}
        <div>
          <h4 className="text-lg font-medium mb-4">Mission Statement</h4>
          <FormField
            id="mission-statement"
            label="Mission Statement"
            type="textarea"
            value={formData.mission}
            onChange={(e) => handleMissionChange(e.target.value)}
            rows={4}
            required
            error={errors.mission}
          />
        </div>

        {/* Programs Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Foundation Programs</h4>
            <button
              type="button"
              onClick={addProgram}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Program
            </button>
          </div>
          
          {formData.programs.map((program, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Program #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeProgram(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.programs.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`program-${index}-title`}
                  label="Title"
                  value={program.title}
                  onChange={(e) => handleProgramChange(index, 'title', e.target.value)}
                  required
                  error={errors[`program_${index}_title`]}
                />
                <FormField
                  id={`program-${index}-description`}
                  label="Description"
                  type="textarea"
                  value={program.description}
                  onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                  rows={3}
                  required
                  error={errors[`program_${index}_description`]}
                />
                <FormField
                  id={`program-${index}-beneficiaries`}
                  label="Beneficiaries"
                  value={program.beneficiaries}
                  onChange={(e) => handleProgramChange(index, 'beneficiaries', e.target.value)}
                  required
                  error={errors[`program_${index}_beneficiaries`]}
                />
                <div>
                  <label htmlFor={`program-${index}-icon`} className="block text-sm font-medium mb-1">
                    Icon
                  </label>
                  <select
                    id={`program-${index}-icon`}
                    value={program.iconName}
                    onChange={(e) => handleProgramChange(index, 'iconName', e.target.value)}
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
            </div>
          ))}
        </div>

        {/* Impact Stats Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Impact Statistics</h4>
            <button
              type="button"
              onClick={addStat}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Stat
            </button>
          </div>
          
          {formData.impactStats.map((stat, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Stat #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.impactStats.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id={`stat-${index}-number`}
                  label="Number/Value"
                  value={stat.number}
                  onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                  placeholder="e.g., '25+' or '500+'"
                  required
                  error={errors[`stat_${index}_number`]}
                />
                <FormField
                  id={`stat-${index}-description`}
                  label="Description"
                  value={stat.description}
                  onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                  placeholder="e.g., 'Research publications funded'"
                  required
                  error={errors[`stat_${index}_description`]}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Upcoming Events</h4>
            <button
              type="button"
              onClick={addEvent}
              className="text-primary hover:text-primary-dark flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Event
            </button>
          </div>
          
          {formData.upcomingEvents.map((event, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Event #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeEvent(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.upcomingEvents.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <FormField
                  id={`event-${index}-title`}
                  label="Title"
                  value={event.title}
                  onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                  required
                  error={errors[`event_${index}_title`]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id={`event-${index}-date`}
                    label="Date"
                    value={event.date}
                    onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                    placeholder="e.g., 'December 15, 2023'"
                    required
                    error={errors[`event_${index}_date`]}
                  />
                  <FormField
                    id={`event-${index}-location`}
                    label="Location"
                    value={event.location}
                    onChange={(e) => handleEventChange(index, 'location', e.target.value)}
                    required
                    error={errors[`event_${index}_location`]}
                  />
                </div>
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

export default FoundationForm; 