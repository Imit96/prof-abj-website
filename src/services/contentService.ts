import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from '../firebase/config';
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

// Collection names
const COLLECTIONS = {
  PUBLICATIONS: 'publications',
  GALLERY: 'gallery',
  PROFILE: 'profile',
  EVENTS: 'events',
  PORTFOLIO_CONTENT: 'portfolioContent',
  COOPERATION_CONTENT: 'cooperationContent',
  FOUNDATION_CONTENT: 'foundationContent',
  CONTACT_CONTENT: 'contactContent'
};

// Helper functions
const getCollection = async (collectionName: string, constraints: any = {}) => {
  const collectionRef = collection(db, collectionName);
  let q = query(collectionRef);
  
  if (constraints.whereField && constraints.whereValue) {
    q = query(q, where(constraints.whereField, '==', constraints.whereValue));
  }
  
  if (constraints.orderByField) {
    q = query(q, orderBy(constraints.orderByField, constraints.orderByDirection || 'asc'));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

const uploadFile = async (path: string, file: File) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return { path, url };
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

// Profile
export const getProfile = async () => {
  // Usually there's only one profile document, so we get all and take the first
  const profiles = await getCollection(COLLECTIONS.PROFILE);
  return profiles.length > 0 ? profiles[0] : null;
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

// Portfolio Content
export const getPortfolioContent = async () => {
  const content = await getDocument(COLLECTIONS.PORTFOLIO_CONTENT, 'main');
  if (!content) {
    return {
      id: 'main',
      sections: [],
      updatedAt: new Date()
    };
  }
  return content as PortfolioContent;
};

// Cooperation Content
export const getCooperationContent = async () => {
  const content = await getDocument(COLLECTIONS.COOPERATION_CONTENT, 'main');
  if (!content) {
    return {
      id: 'main',
      academicCollaborations: [],
      industryPartnerships: [],
      researchNetworks: [],
      collaborationOpportunities: '',
      updatedAt: new Date()
    };
  }
  return content as CooperationContent;
};

// Foundation Content
export const getFoundationContent = async () => {
  const content = await getDocument(COLLECTIONS.FOUNDATION_CONTENT, 'main');
  if (!content) {
    return {
      id: 'main',
      mission: '',
      programs: [],
      impactStats: [],
      upcomingEvents: [],
      updatedAt: new Date()
    };
  }
  return content as FoundationContent;
};

// Contact Content
export const getContactContent = async () => {
  const content = await getDocument(COLLECTIONS.CONTACT_CONTENT, 'main');
  if (!content) {
    return {
      id: 'main',
      contactInfo: [],
      officeLocations: [],
      updatedAt: new Date()
    };
  }
  return content as ContactContent;
}; 