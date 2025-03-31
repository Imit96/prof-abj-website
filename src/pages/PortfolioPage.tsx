import React from 'react';
import { Brain, FlaskConical, GraduationCap, Users, Award, BookOpen } from 'lucide-react';
import { PortfolioContent } from '../types/contentTypes';

const PortfolioPage: React.FC = () => {
  // Dummy data for demonstration
  const dummyContent: PortfolioContent = {
    sections: [
      {
        title: "Research Publications",
        description: "Selected publications in neurotoxicology and environmental health sciences",
        iconName: "BookOpen",
        subsections: [
          {
            title: "Recent Publications",
            content: "Abolaji, A. O., et al. (2023). Neuroprotective effects of natural compounds against environmental toxins. Journal of Neuroscience Research, 101(2), 245-260.",
            type: "publication",
            metadata: {
              authors: "Abolaji, A. O., et al.",
              journal: "Journal of Neuroscience Research",
              year: 2023,
              doi: "10.1002/jnr.25123"
            },
            order: 1
          },
          {
            title: "Key Findings",
            content: "Our research has demonstrated the protective effects of natural compounds against neurotoxic environmental pollutants, offering potential therapeutic strategies for neurodegenerative diseases.",
            type: "text",
            order: 2
          }
        ],
        order: 1
      },
      {
        title: "Research Projects",
        description: "Current and completed research projects in neuroscience and environmental health",
        iconName: "FlaskConical",
        subsections: [
          {
            title: "Active Projects",
            content: "Investigating the role of oxidative stress in pesticide-induced neurotoxicity",
            type: "project",
            metadata: {
              period: "2022-2024"
            },
            order: 1
          },
          {
            title: "Project Impact",
            content: "This research aims to develop novel therapeutic strategies for preventing pesticide-related neurological disorders in agricultural communities.",
            type: "text",
            order: 2
          }
        ],
        order: 2
      },
      {
        title: "Awards & Recognition",
        description: "Academic and research achievements",
        iconName: "Award",
        subsections: [
          {
            title: "Recent Awards",
            content: "Outstanding Research Contribution Award",
            type: "award",
            metadata: {
              organization: "International Society of Toxicology",
              year: 2023
            },
            order: 1
          },
          {
            title: "Research Excellence",
            content: "Recognized for significant contributions to understanding environmental neurotoxicity",
            type: "text",
            order: 2
          }
        ],
        order: 3
      }
    ]
  };

  // Function to render the appropriate icon based on iconName
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="h-8 w-8 text-primary" />;
      case 'FlaskConical':
        return <FlaskConical className="h-8 w-8 text-primary" />;
      case 'Award':
        return <Award className="h-8 w-8 text-primary" />;
      case 'Brain':
        return <Brain className="h-8 w-8 text-primary" />;
      case 'GraduationCap':
        return <GraduationCap className="h-8 w-8 text-primary" />;
      case 'Users':
        return <Users className="h-8 w-8 text-primary" />;
      default:
        return <BookOpen className="h-8 w-8 text-primary" />;
    }
  };

  // Function to render different types of subsections
  const renderSubsection = (subsection: any) => {
    switch (subsection.type) {
      case 'publication':
        return (
          <div className="space-y-2">
            <p className="text-text-light">{subsection.content}</p>
            {subsection.metadata && (
              <div className="text-sm text-text-light">
                <p>Authors: {subsection.metadata.authors}</p>
                <p>Journal: {subsection.metadata.journal}</p>
                <p>Year: {subsection.metadata.year}</p>
                {subsection.metadata.doi && (
                  <p>DOI: {subsection.metadata.doi}</p>
                )}
              </div>
            )}
          </div>
        );
      case 'project':
        return (
          <div className="space-y-2">
            <p className="text-text-light">{subsection.content}</p>
            {subsection.metadata && (
              <p className="text-sm text-text-light">
                Period: {subsection.metadata.period}
              </p>
            )}
          </div>
        );
      case 'award':
        return (
          <div className="space-y-2">
            <p className="text-text-light">{subsection.content}</p>
            {subsection.metadata && (
              <div className="text-sm text-text-light">
                <p>Organization: {subsection.metadata.organization}</p>
                <p>Year: {subsection.metadata.year}</p>
              </div>
            )}
          </div>
        );
      default:
        return <p className="text-text-light">{subsection.content}</p>;
    }
  };

  return (
    <div className="bg-background-alt min-h-screen">
      <div className="bg-primary/10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-center mb-4">Portfolio</h1>
          <p className="text-lg text-text-light text-center max-w-3xl mx-auto">
            Explore my research publications, projects, and academic achievements in neuroscience and environmental health.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {dummyContent.sections.map((section, index) => (
          <section
            key={index}
            className={`mb-12 ${
              index % 2 === 0 ? 'bg-white' : 'bg-background-alt'
            } rounded-lg p-8 shadow-sm`}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                {getIcon(section.iconName)}
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold">{section.title}</h2>
                {section.description && (
                  <p className="text-text-light mt-1">{section.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.subsections
                .sort((a, b) => a.order - b.order)
                .map((subsection, subIndex) => (
                  <div
                    key={subIndex}
                    className="bg-background-alt rounded-lg p-6 shadow-sm"
                  >
                    <h3 className="font-medium text-xl mb-4">{subsection.title}</h3>
                    {renderSubsection(subsection)}
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage; 