import React from 'react';
import { Building2, GraduationCap, Network, Handshake } from 'lucide-react';
import { CooperationContent } from '../types/contentTypes';

const CooperationPage: React.FC = () => {
  // Dummy data for demonstration
  const dummyContent: CooperationContent = {
    academicCollaborations: [
      {
        institution: "University of Lagos",
        description: "Joint research projects in neurotoxicology and environmental health sciences",
        contactPerson: "Dr. John Smith"
      },
      {
        institution: "University of Ibadan",
        description: "Exchange programs for graduate students in neuroscience",
        contactPerson: "Prof. Sarah Johnson"
      },
      {
        institution: "University of Cape Town",
        description: "Collaborative research in environmental health sciences",
        contactPerson: "Dr. Michael Brown"
      }
    ],
    industryPartnerships: [
      {
        company: "PharmaTech Solutions",
        description: "Funding for research in drug development and testing",
        year: "2021"
      },
      {
        company: "EcoHealth Systems",
        description: "Development of environmental monitoring systems",
        year: "2022"
      },
      {
        company: "NeuroMed Innovations",
        description: "Joint development of neurological diagnostic tools",
        year: "2023"
      }
    ],
    researchNetworks: [
      {
        name: "African Neuroscience Network",
        description: "Network of neuroscience researchers across Africa",
        members: 50
      },
      {
        name: "Global Environmental Health Consortium",
        description: "International consortium for environmental health research",
        members: 30
      },
      {
        name: "West African Research Alliance",
        description: "Alliance of research institutions in West Africa",
        members: 25
      }
    ],
    collaborationOpportunities: "We're always looking for new partners to join us in advancing research and innovation. Contact us to learn more about collaboration opportunities."
  };

  return (
    <div className="bg-background-alt min-h-screen">
      <div className="bg-primary/10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-center mb-4">Cooperation & Partnerships</h1>
          <p className="text-lg text-text-light text-center max-w-3xl mx-auto">
            Building strong partnerships to advance research and innovation in neuroscience and environmental health.
          </p>
        </div>
      </div>

      {/* Academic Collaborations Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 justify-center">
            <GraduationCap className="text-primary mr-3" size={28} />
            <h2 className="text-2xl font-serif font-bold">Academic Collaborations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyContent.academicCollaborations.map((collab, index) => (
              <div key={index} className="bg-background-alt border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium text-xl mb-2">{collab.institution}</h3>
                <p className="text-sm text-text-light mb-4">{collab.description}</p>
                {collab.contactPerson && (
                  <p className="text-sm text-text-light">
                    <span className="font-medium">Contact:</span> {collab.contactPerson}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Partnerships Section */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 justify-center">
            <Building2 className="text-primary mr-3" size={28} />
            <h2 className="text-2xl font-serif font-bold">Industry Partnerships</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyContent.industryPartnerships.map((partner, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium text-xl mb-2">{partner.company}</h3>
                <p className="text-sm text-text-light mb-4">{partner.description}</p>
                <p className="text-sm text-text-light">
                  <span className="font-medium">Since:</span> {partner.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Networks Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 justify-center">
            <Network className="text-primary mr-3" size={28} />
            <h2 className="text-2xl font-serif font-bold">Research Networks</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyContent.researchNetworks.map((network, index) => (
              <div key={index} className="bg-background-alt border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium text-xl mb-2">{network.name}</h3>
                <p className="text-sm text-text-light mb-4">{network.description}</p>
                <p className="text-sm text-text-light">
                  <span className="font-medium">Members:</span> {network.members}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities Section */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-8 justify-center">
              <Handshake className="text-primary mr-3" size={28} />
              <h2 className="text-2xl font-serif font-bold">Collaboration Opportunities</h2>
            </div>
            
            <p className="text-text-light mb-8">
              {dummyContent.collaborationOpportunities}
            </p>
            
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CooperationPage; 