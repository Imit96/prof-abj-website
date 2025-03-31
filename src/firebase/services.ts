import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Query
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as authSignOut
} from 'firebase/auth';
import app from './config';
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

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

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

// Authentication services
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await authSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Firestore services
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

export const getDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const getCollection = async (
  collectionName: string,
  constraints: {
    whereField?: string;
    whereValue?: any;
    orderByField?: string;
    orderByDirection?: 'asc' | 'desc';
    limitTo?: number;
  } = {}
) => {
  try {
    const collectionRef = collection(db, collectionName);
    let q: Query = collectionRef;
    
    if (constraints.whereField && constraints.whereValue) {
      q = query(collectionRef, where(constraints.whereField, '==', constraints.whereValue));
    }
    
    if (constraints.orderByField) {
      q = query(q, orderBy(constraints.orderByField, constraints.orderByDirection || 'asc'));
    }
    
    if (constraints.limitTo) {
      q = query(q, limit(constraints.limitTo));
    }
    
    const querySnapshot = await getDocs(q);
    const documents: any[] = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
};

// Storage services
export const uploadFile = async (path: string, file: File) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { path, url };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
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