import {
  Publication,
  GalleryItem,
  ProfileInfo,
  Event,
  PortfolioContent,
  CooperationContent,
  FoundationContent,
  ContactContent
} from '../types/contentTypes';

// Mock data
const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Sample Publication',
    authors: 'Author 1, Author 2',
    year: 2024,
    journal: 'Sample Journal',
    doi: '10.1234/sample',
    abstract: 'Sample abstract text'
  }
];

const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Sample Image',
    description: 'Sample description',
    imageUrl: '/images/sample.jpg',
    category: 'general',
    order: 1
  }
];

const mockProfile: ProfileInfo = {
  id: '1',
  name: 'Sample Name',
  title: 'Sample Title',
  bio: 'Sample bio text',
  imageUrl: '/images/profile.jpg',
  education: [
    {
      degree: 'PhD',
      institution: 'Sample University',
      year: '2020',
      description: 'Sample education description'
    }
  ],
  experience: [
    {
      position: 'Professor',
      institution: 'Sample University',
      startYear: '2020',
      endYear: 'Present',
      description: 'Sample experience description'
    }
  ],
  awards: [
    {
      title: 'Sample Award',
      organization: 'Sample Organization',
      year: '2023',
      description: 'Sample award description'
    }
  ]
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Sample Event',
    description: 'Sample event description',
    startDate: new Date().toISOString(),
    location: 'Sample Location'
  }
];

const mockPortfolioContent: PortfolioContent = {
  id: 'main',
  sections: [
    {
      id: '1',
      title: 'Sample Section',
      description: 'Sample section description',
      iconName: 'sample-icon',
      subsections: [
        {
          id: '1',
          title: 'Sample Subsection',
          content: 'Sample content',
          type: 'text',
          order: 1
        }
      ],
      order: 1
    }
  ]
};

const mockCooperationContent: CooperationContent = {
  id: 'main',
  academicCollaborations: [],
  industryPartnerships: [],
  researchNetworks: [],
  collaborationOpportunities: 'Sample opportunities text'
};

const mockFoundationContent: FoundationContent = {
  id: 'main',
  mission: 'Sample mission statement',
  programs: [],
  impactStats: [],
  upcomingEvents: []
};

const mockContactContent: ContactContent = {
  id: 'main',
  contactInfo: [],
  officeLocations: []
};

// Publications
export const getPublications = async () => {
  return mockPublications;
};

export const getPublication = async (id: string) => {
  return mockPublications.find(pub => pub.id === id) || null;
};

// Gallery
export const getGalleryItems = async (category?: string) => {
  if (category) {
    return mockGalleryItems.filter(item => item.category === category);
  }
  return mockGalleryItems;
};

export const getGalleryItem = async (id: string) => {
  return mockGalleryItems.find(item => item.id === id) || null;
};

// Profile
export const getProfile = async () => {
  return mockProfile;
};

// Events
export const getEvents = async () => {
  return mockEvents;
};

export const getEvent = async (id: string) => {
  return mockEvents.find(event => event.id === id) || null;
};

// Portfolio Content
export const getPortfolioContent = async () => {
  return mockPortfolioContent;
};

export const updatePortfolioContent = async (updatedContent: PortfolioContent) => {
  // In a real application, this would make an API call to update the content
  // For now, we'll just update the mock data
  Object.assign(mockPortfolioContent, updatedContent);
  return mockPortfolioContent;
};

// Cooperation Content
export const getCooperationContent = async () => {
  return mockCooperationContent;
};

// Foundation Content
export const getFoundationContent = async () => {
  return mockFoundationContent;
};

// Contact Content
export const getContactContent = async () => {
  return mockContactContent;
}; 