// This script helps populate the gallery collection with the dummy data from GalleryPage.tsx
// Run this in your browser console when you're logged into the admin dashboard

// Dummy gallery items from GalleryPage.tsx
const dummyGalleryItems = [
  {
    title: "Biochemistry Research Laboratory",
    category: "laboratory", // lowercase to match the expected categories in admin
    description: "The main research laboratory at the Department of Biochemistry, University of Ibadan.",
    order: 1,
    // You'll need to provide an actual image file when adding this through the admin UI
  },
  {
    title: "International Toxicology Conference 2023",
    category: "conferences", 
    description: "Professor Abolaji presenting research findings at the International Toxicology Conference 2023.",
    order: 2,
  },
  {
    title: "Neurotoxicology Research Team",
    category: "team",
    description: "The dedicated team of researchers working on neurotoxicology projects.",
    order: 3,
  },
  {
    title: "Drosophila Melanogaster Research Equipment",
    category: "laboratory",
    description: "Specialized equipment used for Drosophila melanogaster studies in our laboratory.",
    order: 4,
  },
  {
    title: "Excellence in Research Award Ceremony",
    category: "awards",
    description: "Professor Abolaji receiving recognition for research contributions at the annual science awards.",
    order: 5,
  },
  {
    title: "Community Health Outreach Program",
    category: "outreach",
    description: "The foundation's activities engaging with local communities on health awareness about environmental toxicants.",
    order: 6,
  },
  {
    title: "Neuroscience Workshop for Students",
    category: "education",
    description: "Annual workshop for undergraduate students interested in neuroscience research.",
    order: 7,
  },
  {
    title: "Research Team at International Conference",
    category: "conferences",
    description: "The neurotoxicology research team representing the university at the International Biochemistry Conference.",
    order: 8,
  },
  {
    title: "Laboratory Analysis of Environmental Samples",
    category: "laboratory",
    description: "Researchers analyzing environmental samples for potential neurotoxic compounds.",
    order: 9,
  }
];

// Instructions for the user:
/*
1. Go to the Admin Dashboard's Gallery tab
2. For each item in the dummyGalleryItems array above:
   a. Click "Add Image"
   b. Fill in the title, description, category, and order with the values from the array
   c. Upload an appropriate image (you can use placeholder services like https://placehold.co if needed)
   d. Click "Save Item"
3. Refresh the Gallery tab to see all your items

Alternatively, if your app supports programmatic data entry, you can adapt this script to
work with your Firebase configuration to directly add these items to the database.
*/ 