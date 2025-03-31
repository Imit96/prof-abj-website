import React from 'react';
import { Heart, Lightbulb, Users, HandHeart, Target, Calendar } from 'lucide-react';
import { FoundationContent } from '../types/contentTypes';

const FoundationPage: React.FC = () => {
  // Dummy data for demonstration
  const dummyContent: FoundationContent = {
    mission: "The Abolaji Foundation is dedicated to advancing research, education, and healthcare in the field of neuroscience and environmental health. Our mission is to make a lasting impact on society through scientific innovation, educational support, and community outreach.",
    programs: [
      {
        title: "Research Grants",
        description: "Supporting innovative research projects in neurotoxicology and environmental health sciences.",
        beneficiaries: "Researchers and Scientists",
        iconName: "Lightbulb"
      },
      {
        title: "Student Scholarships",
        description: "Providing financial support to promising students pursuing studies in neuroscience and environmental health.",
        beneficiaries: "Graduate Students",
        iconName: "Users"
      },
      {
        title: "Community Health",
        description: "Supporting communities affected by neurological disorders through medical assistance and awareness programs.",
        beneficiaries: "Local Communities",
        iconName: "Heart"
      }
    ],
    impactStats: [
      { number: "50+", description: "Research Projects Funded" },
      { number: "100+", description: "Students Supported" },
      { number: "5", description: "Communities Reached" },
      { number: "1000+", description: "Lives Impacted" }
    ],
    upcomingEvents: [
      {
        title: "Annual Neuroscience Symposium",
        date: "June 15, 2024",
        location: "University of Lagos"
      },
      {
        title: "Community Health Fair",
        date: "July 20, 2024",
        location: "Lagos State"
      },
      {
        title: "Research Grant Workshop",
        date: "August 5, 2024",
        location: "Online"
      }
    ]
  };

  // Function to render the appropriate icon based on iconName
  const renderProgramIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lightbulb':
        return <Lightbulb className="h-10 w-10 text-primary" />;
      case 'Users':
        return <Users className="h-10 w-10 text-primary" />;
      case 'Heart':
        return <Heart className="h-10 w-10 text-primary" />;
      default:
        return <Heart className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <div className="bg-background-alt min-h-screen">
      <div className="bg-primary/10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-center mb-4">The Abolaji Foundation</h1>
          <p className="text-lg text-text-light text-center max-w-3xl mx-auto">
            Dedicated to advancing research, education, and healthcare in the field of neuroscience and environmental health.
          </p>
        </div>
      </div>

      {/* About Foundation Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-6">Our Mission</h2>
            <p className="text-text-light text-center mb-8">
              {dummyContent.mission}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Research</h3>
                <p className="text-sm text-text-light">Funding innovative research in neurotoxicology and environmental health sciences</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Education</h3>
                <p className="text-sm text-text-light">Nurturing the next generation of scientists through scholarships and mentorship</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Healthcare</h3>
                <p className="text-sm text-text-light">Supporting communities affected by neurological disorders through medical assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 justify-center">
            <Target className="text-primary mr-3" size={28} />
            <h2 className="text-2xl font-serif font-bold">Our Programs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dummyContent.programs.map((program, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    {renderProgramIcon(program.iconName)}
                  </div>
                  <h3 className="font-medium text-xl mb-3 text-center">{program.title}</h3>
                  <p className="text-text-light mb-4 text-center">{program.description}</p>
                  <div className="mt-auto">
                    <span className="text-sm text-primary font-medium">{program.beneficiaries}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold text-center mb-12">Our Impact</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dummyContent.impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-sm opacity-80">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 justify-center">
            <Calendar className="text-primary mr-3" size={28} />
            <h2 className="text-2xl font-serif font-bold">Upcoming Events</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyContent.upcomingEvents.map((event, index) => (
              <div key={index} className="bg-background-alt border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{event.title}</h3>
                <div className="flex justify-between text-sm text-text-light">
                  <span>{event.date}</span>
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-8 justify-center">
              <HandHeart className="text-primary mr-3" size={28} />
              <h2 className="text-2xl font-serif font-bold">Get Involved</h2>
            </div>
            
            <p className="text-text-light mb-8">
              There are many ways to support our mission, from volunteering to donations.
              If you're interested in getting involved, please contact us for more information.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="font-medium mb-3">Donate</h3>
                <p className="text-sm text-text-light">Support our programs with a one-time or recurring donation</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="font-medium mb-3">Volunteer</h3>
                <p className="text-sm text-text-light">Join our team of dedicated volunteers in community outreach</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="font-medium mb-3">Partner</h3>
                <p className="text-sm text-text-light">Collaborate with us as an organization or institution</p>
              </div>
            </div>
            
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

export default FoundationPage; 