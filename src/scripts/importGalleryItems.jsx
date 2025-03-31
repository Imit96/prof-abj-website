import React, { useState } from 'react';
import { addGalleryItem } from '../services/contentService';

// Utility to convert a URL to a File
const urlToFile = async (url, filename, mimeType) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};

// Dummy gallery items from GalleryPage.tsx
const dummyGalleryItems = [
  {
    title: "Biochemistry Research Laboratory",
    category: "laboratory",
    description: "The main research laboratory at the Department of Biochemistry, University of Ibadan.",
    order: 1,
    placeholderUrl: "https://placehold.co/600x400?text=Laboratory+Image"
  },
  {
    title: "International Toxicology Conference 2023",
    category: "conferences",
    description: "Professor Abolaji presenting research findings at the International Toxicology Conference 2023.",
    order: 2,
    placeholderUrl: "https://placehold.co/600x400?text=Conference+Image"
  },
  {
    title: "Neurotoxicology Research Team",
    category: "team",
    description: "The dedicated team of researchers working on neurotoxicology projects.",
    order: 3,
    placeholderUrl: "https://placehold.co/600x400?text=Team+Image"
  },
  {
    title: "Drosophila Melanogaster Research Equipment",
    category: "laboratory",
    description: "Specialized equipment used for Drosophila melanogaster studies in our laboratory.",
    order: 4,
    placeholderUrl: "https://placehold.co/600x400?text=Equipment+Image"
  },
  {
    title: "Excellence in Research Award Ceremony",
    category: "awards",
    description: "Professor Abolaji receiving recognition for research contributions at the annual science awards.",
    order: 5,
    placeholderUrl: "https://placehold.co/600x400?text=Award+Ceremony"
  },
  {
    title: "Community Health Outreach Program",
    category: "outreach",
    description: "The foundation's activities engaging with local communities on health awareness about environmental toxicants.",
    order: 6,
    placeholderUrl: "https://placehold.co/600x400?text=Community+Outreach"
  },
  {
    title: "Neuroscience Workshop for Students",
    category: "education",
    description: "Annual workshop for undergraduate students interested in neuroscience research.",
    order: 7,
    placeholderUrl: "https://placehold.co/600x400?text=Workshop+Image"
  },
  {
    title: "Research Team at International Conference",
    category: "conferences",
    description: "The neurotoxicology research team representing the university at the International Biochemistry Conference.",
    order: 8,
    placeholderUrl: "https://placehold.co/600x400?text=Conference+Team"
  },
  {
    title: "Laboratory Analysis of Environmental Samples",
    category: "laboratory",
    description: "Researchers analyzing environmental samples for potential neurotoxic compounds.",
    order: 9,
    placeholderUrl: "https://placehold.co/600x400?text=Lab+Analysis"
  }
];

const ImportGalleryItems = () => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleImport = async () => {
    setStatus('importing');
    setProgress(0);
    setMessages([]);
    
    addMessage('Starting gallery items import...');
    
    for (let i = 0; i < dummyGalleryItems.length; i++) {
      const item = dummyGalleryItems[i];
      try {
        // Remove the placeholderUrl from the item data
        const { placeholderUrl, ...itemData } = item;
        
        // Convert the placeholder URL to a File object
        addMessage(`Downloading image ${i+1}/${dummyGalleryItems.length}...`);
        const imageFile = await urlToFile(
          placeholderUrl, 
          `gallery-item-${i+1}.png`, 
          'image/png'
        );
        
        // Add the item to the database
        addMessage(`Adding item ${i+1}/${dummyGalleryItems.length}: ${item.title}`);
        await addGalleryItem(itemData, imageFile);
        
        // Update progress
        setProgress(Math.round(((i + 1) / dummyGalleryItems.length) * 100));
      } catch (error) {
        addMessage(`Error adding item ${item.title}: ${error.message}`);
        console.error('Error adding gallery item:', error);
      }
    }
    
    setStatus('completed');
    addMessage('Import completed!');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h1 className="text-2xl font-serif font-bold mb-4">Import Gallery Items</h1>
      <p className="mb-4 text-text-light">
        This utility will import {dummyGalleryItems.length} gallery items with placeholder images to your Firestore database.
      </p>
      
      {status === 'idle' && (
        <button 
          onClick={handleImport}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Start Import
        </button>
      )}
      
      {status === 'importing' && (
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-light">Importing... {progress}% complete</p>
        </div>
      )}
      
      {status === 'completed' && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">Import completed successfully!</p>
          <p className="mt-2 text-sm text-text-light">
            You can now go to the Gallery tab in your admin dashboard to see the imported items.
          </p>
        </div>
      )}
      
      {messages.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Progress Log:</h3>
          <div className="bg-gray-100 p-3 rounded-md h-60 overflow-y-auto text-sm font-mono">
            {messages.map((message, i) => (
              <div key={i} className="mb-1">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportGalleryItems; 