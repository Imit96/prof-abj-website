import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/config';
import {
  Publication,
  GalleryItem,
  ProfileInfo,
  Event,
  FeedbackMessage,
  HomePageContent,
  PortfolioContent,
  CooperationContent,
  FoundationContent,
  ContactContent
} from '../types/contentTypes';

// Collection names
const COLLECTIONS = {
  PUBLICATIONS: 'publications',
  GALLERY: 'gallery',
  PROFILE: 'profile',
  EVENTS: 'events',
  FEEDBACK: 'feedback',
  HOME_CONTENT: 'homeContent',
  ABOUT_CONTENT: 'aboutContent',
  PORTFOLIO_CONTENT: 'portfolioContent',
  COOPERATION_CONTENT: 'cooperationContent',
  FOUNDATION_CONTENT: 'foundationContent',
  CONTACT_CONTENT: 'contactContent'
};

// Publications
export const getPublications = async () => {
  return getCollection(COLLECTIONS.PUBLICATIONS, {
    orderByField: 'year',
    orderByDirection: 'desc'
  });
};

export const getPublication = async (id: string) => {
  return getDocument(COLLECTIONS.PUBLICATIONS, id);
};

export const addPublication = async (publication: Publication) => {
  return addDocument(COLLECTIONS.PUBLICATIONS, publication);
};

export const updatePublication = async (id: string, publication: Publication) => {
  return updateDocument(COLLECTIONS.PUBLICATIONS, id, publication);
};

export const deletePublication = async (id: string) => {
  return deleteDocument(COLLECTIONS.PUBLICATIONS, id);
};

// Gallery
export const getGalleryItems = async (category?: string) => {
  const constraints = category 
    ? { whereField: 'category', whereValue: category, orderByField: 'order' }
    : { orderByField: 'order' };
    
  return getCollection(COLLECTIONS.GALLERY, constraints);
};

export const getGalleryItem = async (id: string) => {
  return getDocument(COLLECTIONS.GALLERY, id);
};

export const addGalleryItem = async (item: GalleryItem) => {
  try {
    return addDocument(COLLECTIONS.GALLERY, item);
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

export const updateGalleryItem = async (id: string, item: GalleryItem) => {
  return updateDocument(COLLECTIONS.GALLERY, id, item);
};

export const deleteGalleryItem = async (id: string) => {
  return deleteDocument(COLLECTIONS.GALLERY, id);
};

// Profile
export const getProfile = async () => {
  // Usually there's only one profile document, so we get all and take the first
  const profiles = await getCollection(COLLECTIONS.PROFILE);
  return profiles.length > 0 ? profiles[0] : null;
};

export const updateProfile = async (profile: ProfileInfo, imageFile?: File) => {
  // Get existing profile or create a new ID for it
  let profileId: string;
  const existingProfile = await getProfile();
  
  if (existingProfile && existingProfile.id) {
    profileId = existingProfile.id;
  } else {
    // Create a new profile
    profileId = await addDocument(COLLECTIONS.PROFILE, profile);
    return profileId;
  }
  
  // If a new image is provided, upload it
  if (imageFile) {
    const imagePath = `profile/${Date.now()}-${imageFile.name}`;
    const uploadResult = await uploadFile(imagePath, imageFile);
    
    // Update profile with new image URL
    return updateDocument(COLLECTIONS.PROFILE, profileId, {
      ...profile,
      imageUrl: uploadResult.url
    });
  }
  
  // Otherwise just update the profile data
  return updateDocument(COLLECTIONS.PROFILE, profileId, profile);
};

// Events
export const getEvents = async () => {
  return getCollection(COLLECTIONS.EVENTS, {
    orderByField: 'startDate',
    orderByDirection: 'desc'
  });
};

export const getEvent = async (id: string) => {
  return getDocument(COLLECTIONS.EVENTS, id);
};

export const addEvent = async (event: Event, imageFile?: File) => {
  // Upload image if provided
  if (imageFile) {
    const imagePath = `events/${Date.now()}-${imageFile.name}`;
    const uploadResult = await uploadFile(imagePath, imageFile);
    
    event.imageUrl = uploadResult.url;
  }
  
  return addDocument(COLLECTIONS.EVENTS, event);
};

export const updateEvent = async (id: string, event: Event, imageFile?: File) => {
  // Upload new image if provided
  if (imageFile) {
    const imagePath = `events/${Date.now()}-${imageFile.name}`;
    const uploadResult = await uploadFile(imagePath, imageFile);
    
    event.imageUrl = uploadResult.url;
  }
  
  return updateDocument(COLLECTIONS.EVENTS, id, event);
};

export const deleteEvent = async (id: string) => {
  return deleteDocument(COLLECTIONS.EVENTS, id);
};

// Feedback
export const getFeedbackMessages = async () => {
  return getCollection(COLLECTIONS.FEEDBACK, {
    orderByField: 'createdAt',
    orderByDirection: 'desc'
  });
};

export const getFeedbackMessage = async (id: string) => {
  return getDocument(COLLECTIONS.FEEDBACK, id);
};

export const markFeedbackAsRead = async (id: string) => {
  return updateDocument(COLLECTIONS.FEEDBACK, id, { isRead: true });
};

export const deleteFeedbackMessage = async (id: string) => {
  return deleteDocument(COLLECTIONS.FEEDBACK, id);
};

// Page Content
export const getPageContent = async (pageId: string) => {
  const collection = getCollectionForPage(pageId);
  const content = await getCollection(collection);
  return content.length > 0 ? content[0] : null;
};

export const updatePageContent = async (pageId: string, content: any, imageFiles?: Record<string, File>) => {
  const collection = getCollectionForPage(pageId);
  const existingContent = await getPageContent(pageId);
  
  // Upload any images
  if (imageFiles) {
    for (const [key, file] of Object.entries(imageFiles)) {
      const imagePath = `pages/${pageId}/${Date.now()}-${file.name}`;
      const uploadResult = await uploadFile(imagePath, file);
      
      // Update content with the image URL
      if (key === 'heroImage') {
        content.heroImageUrl = uploadResult.url;
      } else if (key.startsWith('section_')) {
        const sectionId = key.split('_')[1];
        const sectionIndex = content.sections.findIndex((s: any) => s.id === sectionId);
        
        if (sectionIndex !== -1) {
          content.sections[sectionIndex].imageUrl = uploadResult.url;
        }
      }
    }
  }
  
  if (existingContent && existingContent.id) {
    return updateDocument(collection, existingContent.id, content);
  } else {
    return addDocument(collection, content);
  }
};

// Helper function to get the appropriate collection for a page
function getCollectionForPage(pageId: string) {
  switch (pageId) {
    case 'home':
      return COLLECTIONS.HOME_CONTENT;
    case 'about':
      return COLLECTIONS.ABOUT_CONTENT;
    case 'portfolio':
      return COLLECTIONS.PORTFOLIO_CONTENT;
    case 'cooperation':
      return COLLECTIONS.COOPERATION_CONTENT;
    case 'foundation':
      return COLLECTIONS.FOUNDATION_CONTENT;
    case 'contact':
      return COLLECTIONS.CONTACT_CONTENT;
    default:
      return COLLECTIONS.HOME_CONTENT;
  }
}

// Portfolio Content
export const getPortfolioContent = async () => {
  const content = await getCollection(COLLECTIONS.PORTFOLIO_CONTENT);
  return content.length > 0 ? content[0] : null;
};

export const updatePortfolioContent = async (content: PortfolioContent) => {
  const existingContent = await getPortfolioContent();
  
  if (existingContent && existingContent.id) {
    return updateDocument(COLLECTIONS.PORTFOLIO_CONTENT, existingContent.id, content);
  } else {
    return addDocument(COLLECTIONS.PORTFOLIO_CONTENT, content);
  }
};

// Cooperation Content
export const getCooperationContent = async () => {
  const content = await getCollection(COLLECTIONS.COOPERATION_CONTENT);
  return content.length > 0 ? content[0] : null;
};

export const updateCooperationContent = async (content: CooperationContent) => {
  const existingContent = await getCooperationContent();
  
  if (existingContent && existingContent.id) {
    return updateDocument(COLLECTIONS.COOPERATION_CONTENT, existingContent.id, content);
  } else {
    return addDocument(COLLECTIONS.COOPERATION_CONTENT, content);
  }
};

// Foundation Content
export const getFoundationContent = async () => {
  const content = await getCollection(COLLECTIONS.FOUNDATION_CONTENT);
  return content.length > 0 ? content[0] : null;
};

export const updateFoundationContent = async (content: FoundationContent) => {
  const existingContent = await getFoundationContent();
  
  if (existingContent && existingContent.id) {
    return updateDocument(COLLECTIONS.FOUNDATION_CONTENT, existingContent.id, content);
  } else {
    return addDocument(COLLECTIONS.FOUNDATION_CONTENT, content);
  }
};

// Contact Content
export const getContactContent = async () => {
  const content = await getCollection(COLLECTIONS.CONTACT_CONTENT);
  return content.length > 0 ? content[0] : null;
};

export const updateContactContent = async (content: ContactContent) => {
  const existingContent = await getContactContent();
  
  if (existingContent && existingContent.id) {
    return updateDocument(COLLECTIONS.CONTACT_CONTENT, existingContent.id, content);
  } else {
    return addDocument(COLLECTIONS.CONTACT_CONTENT, content);
  }
}; 