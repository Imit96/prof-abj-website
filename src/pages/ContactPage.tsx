import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { ContactContent } from '../types/contentTypes';

const ContactPage: React.FC = () => {
  // Dummy data for demonstration
  const dummyContent: ContactContent = {
    contactInfo: [
      {
        title: "Email",
        iconName: "Mail",
        details: ["abolaji@unilag.edu.ng", "abolaji@example.com"]
      },
      {
        title: "Phone",
        iconName: "Phone",
        details: ["+234 123 456 7890", "+234 987 654 3210"]
      },
      {
        title: "Address",
        iconName: "MapPin",
        details: ["Department of Pharmacology", "College of Medicine", "University of Lagos", "Lagos, Nigeria"]
      }
    ],
    officeLocations: [
      {
        name: "Main Office",
        address: "Department of Pharmacology, College of Medicine, University of Lagos, Lagos, Nigeria",
        hours: "Monday - Friday: 9:00 AM - 5:00 PM"
      },
      {
        name: "Research Lab",
        address: "Building 2, Room 205, College of Medicine, University of Lagos",
        hours: "Monday - Friday: 8:00 AM - 6:00 PM"
      }
    ]
  };

  // Function to render the appropriate icon based on iconName
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail':
        return <Mail className="h-6 w-6 text-primary" />;
      case 'Phone':
        return <Phone className="h-6 w-6 text-primary" />;
      case 'MapPin':
        return <MapPin className="h-6 w-6 text-primary" />;
      default:
        return <Mail className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="bg-background-alt min-h-screen">
      <div className="bg-primary/10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-center mb-4">Contact Us</h1>
          <p className="text-lg text-text-light text-center max-w-3xl mx-auto">
            Get in touch with us for any inquiries about research collaborations, speaking engagements, or general information.
          </p>
        </div>
      </div>

      {/* Contact Information Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dummyContent.contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {renderIcon(info.iconName)}
                </div>
                <h3 className="font-medium text-xl mb-3">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-text-light">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold text-center mb-8">Office Locations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyContent.officeLocations.map((location, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium text-xl mb-3">{location.name}</h3>
                <div className="flex items-start mb-4">
                  <MapPin className="text-primary mr-3 mt-1" size={18} />
                  <p className="text-text-light">{location.address}</p>
                </div>
                <div className="flex items-center">
                  <Clock className="text-primary mr-3" size={18} />
                  <p className="text-text-light">{location.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-8">Send a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-light mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-light mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Message subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-light mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Your message"
                />
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  <Send className="mr-2" size={18} />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 