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
  CollectionReference,
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

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

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
    // Create a unique filename to avoid conflicts
    const uniqueFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const uniquePath = path; // Use the path directly without appending the filename again
    const storageRef = ref(storage, uniquePath);
    
    // Set metadata to handle CORS
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '3600'
      }
    };
    
    // Upload with retry logic
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          path: uniquePath,
          url: downloadURL
        };
      } catch (error) {
        lastError = error;
        console.error(`Upload attempt ${4 - retries} failed:`, error);
        retries--;
        if (retries > 0) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    throw lastError;
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