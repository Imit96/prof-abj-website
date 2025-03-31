import React, { useState } from 'react';
import { addGalleryItem } from '../services/contentService';

// Helper function to create a placeholder image as base64
const createPlaceholderImage = (text) => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add text
  ctx.fillStyle = '#6b7280';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Convert to blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob], `${text.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' }));
    }, 'image/png', 0.8); // Use 0.8 quality for better performance
  });
};

// Dummy gallery items from the original GalleryPage
const initialGalleryItems = [
  {
    title: "Biochemistry Research Laboratory",
    category: "laboratory",
    description: "The main research laboratory at the Department of Biochemistry, University of Ibadan.",
    order: 1,
    placeholderText: "Laboratory Image"
  },
  {
    title: "International Toxicology Conference 2023",
    category: "conferences", 
    description: "Professor Abolaji presenting research findings at the International Toxicology Conference 2023.",
    order: 2,
    placeholderText: "Conference Image"
  },
  {
    title: "Research Team Members",
    category: "students",
    description: "The dedicated team of researchers working on neurotoxicology projects.",
    order: 3,
    placeholderText: "Team Image"
  },
  {
    title: "Drosophila Melanogaster Research Equipment",
    category: "laboratory",
    description: "Specialized equipment used for Drosophila melanogaster studies in our laboratory.",
    order: 4,
    placeholderText: "Equipment Image"
  },
  {
    title: "Excellence in Research Award Ceremony",
    category: "awards",
    description: "Professor Abolaji receiving recognition for research contributions at the annual science awards.",
    order: 5,
    placeholderText: "Award Ceremony"
  },
  {
    title: "Research Impact in Community Health",
    category: "research",
    description: "The foundation's activities engaging with local communities on health awareness about environmental toxicants.",
    order: 6,
    placeholderText: "Community Outreach"
  },
  {
    title: "Neuroscience Workshop for Students",
    category: "students",
    description: "Annual workshop for undergraduate students interested in neuroscience research.",
    order: 7,
    placeholderText: "Workshop Image"
  },
  {
    title: "Research Team at International Conference",
    category: "conferences",
    description: "The neurotoxicology research team representing the university at the International Biochemistry Conference.",
    order: 8,
    placeholderText: "Conference Team"
  },
  {
    title: "Laboratory Analysis of Environmental Samples",
    category: "laboratory",
    description: "Researchers analyzing environmental samples for potential neurotoxic compounds.",
    order: 9,
    placeholderText: "Lab Analysis"
  }
];

const PopulateGalleryData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([]);
  
  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };
  
  const handlePopulate = async () => {
    setIsLoading(true);
    setProgress(0);
    setMessages([]);
    
    addMessage("Starting gallery data import...");
    
    for (let i = 0; i < initialGalleryItems.length; i++) {
      const item = initialGalleryItems[i];
      try {
        addMessage(`Processing item ${i+1}/${initialGalleryItems.length}: ${item.title}`);
        
        // Create placeholder image
        const imageFile = await createPlaceholderImage(item.placeholderText);
        
        // Remove placeholderText from item data
        const { placeholderText, ...itemData } = item;
        
        addMessage(`Adding ${item.title} to Firestore...`);
        
        // Add retry logic for the entire upload process
        let retries = 3;
        let lastError;
        
        while (retries > 0) {
          try {
            await addGalleryItem(itemData, imageFile);
            addMessage(`Successfully added ${item.title} to Firestore.`);
            break;
          } catch (error) {
            lastError = error;
            retries--;
            if (retries > 0) {
              addMessage(`Retrying upload for ${item.title}... (${retries} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        if (retries === 0) {
          throw lastError;
        }
        
        // Update progress
        setProgress(Math.round(((i + 1) / initialGalleryItems.length) * 100));
        
        // Add a longer delay between uploads to prevent rate limiting
        if (i < initialGalleryItems.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        addMessage(`Error adding ${item.title}: ${error.message}`);
        console.error(`Error adding gallery item ${item.title}:`, error);
      }
    }
    
    addMessage("Gallery data import completed.");
    setIsLoading(false);
  };
  
  return (
    <div className="container mx-auto max-w-4xl p-6 bg-white rounded-lg shadow-md my-12">
      <h1 className="text-3xl font-serif font-bold mb-6">Populate Gallery Data</h1>
      
      <p className="mb-4 text-text-light">
        This utility will populate your Firestore database with {initialGalleryItems.length} example gallery items.
        Click the button below to start importing.
      </p>
      
      <div className="my-6">
        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePopulate}
          disabled={isLoading}
        >
          {isLoading ? 'Importing...' : 'Import Gallery Items'}
        </button>
      </div>
      
      {isLoading && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-light mt-1">Progress: {progress}%</p>
        </div>
      )}
      
      {messages.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-serif font-bold mb-2">Import Log</h2>
          <div className="bg-gray-100 p-4 rounded-md max-h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="mb-1 text-sm">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopulateGalleryData; 