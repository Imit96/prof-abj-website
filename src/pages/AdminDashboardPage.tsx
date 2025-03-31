import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from '../firebase/services';
import {
  LayoutDashboard,
  FileText,
  Users,
  Image,
  Calendar,
  MessageSquare,
  LogOut,
  Settings,
  ChevronDown,
  Edit,
  Plus,
  Trash,
  UserCircle,
  Edit3,
  Loader2,
  Heart,
  Mail
} from 'lucide-react';
import React from 'react';
import { 
  getPublications, 
  addPublication, 
  updatePublication, 
  deletePublication 
} from '../services/contentService';
import { Publication } from '../types/contentTypes';
import PublicationForm from '../components/admin/publications/PublicationForm';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import { 
  getGalleryItems, 
  addGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem 
} from '../services/contentService';
import { GalleryItem, ProfileInfo, EducationItem, ExperienceItem, AwardItem } from '../types/contentTypes';
import GalleryItemForm from '../components/admin/gallery/GalleryItemForm';
import { 
  getFeedbackMessages, 
  getFeedbackMessage, 
  markFeedbackAsRead, 
  deleteFeedbackMessage 
} from '../services/contentService';
import { FeedbackMessage, FirebaseTimestamp } from '../types/contentTypes';
import { formatDistanceToNow } from 'date-fns';
import { 
  getEvents, 
  getEvent, 
  addEvent, 
  updateEvent, 
  deleteEvent 
} from '../services/contentService';
import { Event } from '../types/contentTypes';
import EventForm from '../components/admin/events/EventForm';
import { format } from 'date-fns';
import { 
  getProfile,
  updateProfile
} from '../services/contentService';
import ProfileForm from '../components/admin/profile/ProfileForm';
import toast from 'react-hot-toast';
import PortfolioTab from '../components/admin/portfolio/PortfolioTab';
import CooperationTab from '../components/admin/cooperation/CooperationTab';
import FoundationTab from '../components/admin/foundation/FoundationTab';
import ContactTab from '../components/admin/contact/ContactTab';

// Define interface for sidebar items
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Define props for mobile menu component
interface MobileMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  items: SidebarItem[];
  handleSignOut: () => void;
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Sidebar items
  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'publications', label: 'Publications', icon: <FileText size={20} /> },
    { id: 'profile', label: 'Profile', icon: <Users size={20} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <FileText size={20} /> },
    { id: 'cooperation', label: 'Cooperation', icon: <Users size={20} /> },
    { id: 'foundation', label: 'Foundation', icon: <Heart size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <Image size={20} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={20} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'publications':
        return <PublicationsTab />;
      case 'profile':
        return <ProfileTab />;
      case 'portfolio':
        return <PortfolioTab />;
      case 'cooperation':
        return <CooperationTab />;
      case 'foundation':
        return <FoundationTab />;
      case 'gallery':
        return <GalleryTab />;
      case 'events':
        return <EventsTab />;
      case 'contact':
        return <ContactTab />;
      case 'feedback':
        return <FeedbackTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background-alt flex">
      {/* Sidebar */}
      <div className="bg-white w-64 shadow-md hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-serif font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-6 py-3 text-left transition-colors duration-300 ${
                    activeTab === item.id
                      ? 'bg-primary/10 text-primary border-r-4 border-primary'
                      : 'text-text-light hover:bg-primary/5'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-6 py-3 text-left text-text-light hover:bg-primary/5 transition-colors duration-300"
              >
                <span className="mr-3"><LogOut size={20} /></span>
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden w-full bg-white p-4 shadow-md fixed top-0 z-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-primary">Admin Panel</h2>
          <div className="relative">
            <MobileMenu
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              items={sidebarItems}
              handleSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 md:pt-6 mt-16 md:mt-0">
        {renderTabContent()}
      </main>
    </div>
  );
};

// Mobile menu dropdown
const MobileMenu = ({ activeTab, setActiveTab, items, handleSignOut }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-md"
      >
        <span>{items.find(item => item.id === activeTab)?.label || 'Menu'}</span>
        <ChevronDown size={16} />
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
        >
          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  activeTab === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-light hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm w-full text-left text-text-light hover:bg-primary/5"
            >
              <div className="flex items-center">
                <span className="mr-2"><LogOut size={16} /></span>
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Updated DashboardTab component to fetch actual counts
const DashboardTab = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    publications: 0,
    gallery: 0,
    events: 0,
    feedback: 0
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      // Fetch publications count
      const publications = await getPublications();
      // Fetch gallery items count
      const gallery = await getGalleryItems();
      // Fetch events count
      const events = await getEvents();
      // Fetch feedback messages count
      const feedback = await getFeedbackMessages();

      setCounts({
        publications: publications.length,
        gallery: gallery.length,
        events: events.length,
        feedback: feedback.length
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Dashboard</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-2">Publications</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-primary">{counts.publications}</p>
              <FileText size={18} className="text-primary ml-2" />
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-2">Gallery Items</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-primary">{counts.gallery}</p>
              <Image size={18} className="text-primary ml-2" />
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-2">Events</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-primary">{counts.events}</p>
              <Calendar size={18} className="text-primary ml-2" />
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-2">Feedback Messages</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-primary">{counts.feedback}</p>
              <MessageSquare size={18} className="text-primary ml-2" />
            </div>
          </div>
        </div>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => window.location.href = '#publications'}
            className="card p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center text-primary mb-2">
              <Plus size={18} className="mr-2" />
              <h4 className="font-medium">Add Publication</h4>
            </div>
            <p className="text-sm text-text-light">Add a new research publication or article</p>
          </button>
          <button 
            onClick={() => window.location.href = '#portfolio'}
            className="card p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center text-primary mb-2">
              <Plus size={18} className="mr-2" />
              <h4 className="font-medium">Manage Portfolio</h4>
            </div>
            <p className="text-sm text-text-light">Update your research portfolio content</p>
          </button>
          <button 
            onClick={() => window.location.href = '#gallery'}
            className="card p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center text-primary mb-2">
              <Plus size={18} className="mr-2" />
              <h4 className="font-medium">Add Gallery Item</h4>
            </div>
            <p className="text-sm text-text-light">Upload a new image to the gallery</p>
          </button>
          <button 
            onClick={() => window.location.href = '#events'}
            className="card p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center text-primary mb-2">
              <Plus size={18} className="mr-2" />
              <h4 className="font-medium">Add Event</h4>
            </div>
            <p className="text-sm text-text-light">Create a new event or announcement</p>
          </button>
          <button 
            onClick={() => window.location.href = '#foundation'}
            className="card p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center text-primary mb-2">
              <Plus size={18} className="mr-2" />
              <h4 className="font-medium">Update Foundation</h4>
            </div>
            <p className="text-sm text-text-light">Manage foundation programs and events</p>
          </button>
          <button 
            onClick={() => window.location.href = '#contact'}
            className="card p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center text-primary mb-2">
              <Plus size={18} className="mr-2" />
              <h4 className="font-medium">Update Contact</h4>
            </div>
            <p className="text-sm text-text-light">Manage contact information and office locations</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const PublicationsTab = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPublication, setCurrentPublication] = useState<Publication | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch publications on component mount
  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const data = await getPublications();
      setPublications(data as Publication[]);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentPublication(undefined);
    setShowForm(true);
  };

  const handleEditClick = (publication: Publication) => {
    setCurrentPublication(publication);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentPublication(undefined);
  };

  const handleSubmit = async (publication: Publication) => {
    setIsLoading(true);
    try {
      if (currentPublication?.id) {
        // Update existing publication
        await updatePublication(currentPublication.id, publication);
      } else {
        // Add new publication
        await addPublication(publication);
      }
      
      // Refresh publications list
      await fetchPublications();
      setShowForm(false);
      setCurrentPublication(undefined);
    } catch (error) {
      console.error('Error saving publication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    setDeleteLoading(true);
    try {
      await deletePublication(confirmDelete);
      // Refresh publications list
      await fetchPublications();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting publication:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Main content to render based on state
  const renderContent = () => {
    if (showForm) {
      return (
        <PublicationForm
          publication={currentPublication}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isLoading}
        />
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">Publications</h2>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={handleAddClick}
          >
            <Plus size={16} />
            <span>Add Publication</span>
          </button>
        </div>

        {isLoading ? (
          <div className="card p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : publications.length === 0 ? (
          <div className="card p-6">
            <p className="text-text-light text-center">No publications found. Add your first publication!</p>
          </div>
        ) : (
          <div className="card p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Journal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {publications.map((pub) => (
                    <tr key={pub.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                        <div className="text-sm text-text-light">{pub.authors}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pub.journal}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pub.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(pub)}
                          className="text-primary hover:text-primary-dark mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pub.id!)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {renderContent()}
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Publication"
        message="Are you sure you want to delete this publication? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

const ProfileTab = () => {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (updatedProfile: ProfileInfo, imageFile?: File) => {
    setIsSubmitting(true);
    try {
      await updateProfile(updatedProfile, imageFile);
      toast.success("Profile updated successfully");
      await fetchProfile();
      setShowForm(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (showForm) {
    return (
      <ProfileForm
        profile={profile || undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelClick}
        isLoading={isSubmitting}
      />
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <UserCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Profile Information</h3>
          <p className="text-text-light mb-4">Create your profile to showcase your academic background and achievements.</p>
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="h-20 w-20 rounded-full object-cover mr-4"
            />
          ) : (
            <UserCircle className="h-20 w-20 text-gray-400 mr-4" />
          )}
          <div>
            <h2 className="text-2xl font-serif font-bold">{profile.name}</h2>
            <p className="text-text-light">{profile.title}</p>
          </div>
        </div>
        <button
          onClick={handleEditClick}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Edit3 size={14} className="mr-1" />
          Edit Profile
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Bio</h3>
        <p className="text-text whitespace-pre-line">{profile.bio}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Education</h3>
        <div className="space-y-4">
          {profile.education.map((edu: EducationItem, index: number) => (
            <div key={index} className="border-l-2 border-primary pl-4">
              <h4 className="font-medium">{edu.degree}</h4>
              <p className="text-text-light">{edu.institution}, {edu.year}</p>
              {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Experience</h3>
        <div className="space-y-4">
          {profile.experience.map((exp: ExperienceItem, index: number) => (
            <div key={index} className="border-l-2 border-primary pl-4">
              <h4 className="font-medium">{exp.position}</h4>
              <p className="text-text-light">
                {exp.institution}, {exp.startYear} - {exp.endYear}
              </p>
              {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Awards & Honors</h3>
        <div className="space-y-4">
          {profile.awards.map((award: AwardItem, index: number) => (
            <div key={index} className="border-l-2 border-primary pl-4">
              <h4 className="font-medium">{award.title}</h4>
              <p className="text-text-light">{award.organization}, {award.year}</p>
              {award.description && <p className="mt-1 text-sm">{award.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GalleryTab = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch gallery items on component mount and when category changes
  useEffect(() => {
    fetchGalleryItems();
  }, [activeCategory]);

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const data = await getGalleryItems(activeCategory || undefined);
      setGalleryItems(data as GalleryItem[]);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentItem(undefined);
    setShowForm(true);
  };

  const handleEditClick = (item: GalleryItem) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentItem(undefined);
  };

  const handleSubmit = async (item: GalleryItem) => {
    setIsLoading(true);
    try {
      if (currentItem?.id) {
        // Update existing item
        await updateGalleryItem(currentItem.id, item);
      } else {
        // Add new item
        await addGalleryItem(item);
      }
      
      // Refresh gallery items list
      await fetchGalleryItems();
      setShowForm(false);
      setCurrentItem(undefined);
    } catch (error) {
      console.error('Error saving gallery item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteGalleryItem(confirmDelete);
      // Refresh gallery items
      await fetchGalleryItems();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category);
  };

  const categories = [
    { id: 'research', label: 'Research' },
    { id: 'conferences', label: 'Conferences' },
    { id: 'laboratory', label: 'Laboratory' },
    { id: 'awards', label: 'Awards' },
    { id: 'students', label: 'Students' }
  ];

  // Main content to render based on state
  const renderContent = () => {
    if (showForm) {
      return (
        <GalleryItemForm
          galleryItem={currentItem}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isLoading}
        />
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">Gallery</h2>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={handleAddClick}
          >
            <Plus size={16} />
            <span>Add Image</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-3 py-1 rounded-md text-sm ${
                activeCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-light hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-light hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="card p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="card p-6">
            <p className="text-text-light text-center mb-4">
              No gallery items found. {activeCategory ? `Try a different category or add your first ${activeCategory} image!` : 'Add your first image!'}
            </p>
            <div className="flex justify-center">
              <a 
                href="/admin/populate-gallery" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors inline-flex items-center gap-2"
              >
                <span>Populate with Example Data</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="card overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id!)}
                        className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-text-light mb-2">
                    {categories.find(c => c.id === item.category)?.label || item.category}
                  </p>
                  {item.description && (
                    <p className="text-sm text-text truncate">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {renderContent()}
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery item? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

const EventsTab = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getEvents();
      setEvents(data as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentEvent(undefined);
    setShowForm(true);
  };

  const handleEditClick = (event: Event) => {
    setCurrentEvent(event);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentEvent(undefined);
  };

  const handleSubmit = async (event: Event, imageFile?: File) => {
    setIsLoading(true);
    try {
      if (currentEvent?.id) {
        // Update existing event
        await updateEvent(currentEvent.id, event, imageFile);
      } else {
        // Add new event
        await addEvent(event, imageFile);
      }
      
      // Refresh events list
      await fetchEvents();
      setShowForm(false);
      setCurrentEvent(undefined);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteEvent(confirmDelete);
      // Refresh events
      await fetchEvents();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatEventDate = (date: any) => {
    if (!date) return '';
    
    // Handle different date formats
    let jsDate: Date;
    
    if (date instanceof Date) {
      jsDate = date;
    } else if (typeof date === 'object' && 'toDate' in date) {
      jsDate = date.toDate();
    } else {
      jsDate = new Date(date);
    }
    
    return format(jsDate, 'MMM d, yyyy');
  };

  // Main content to render based on state
  const renderContent = () => {
    if (showForm) {
      return (
        <EventForm
          event={currentEvent}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isLoading}
        />
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">Events</h2>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={handleAddClick}
          >
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        </div>

        {isLoading ? (
          <div className="card p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="card p-6">
            <p className="text-text-light text-center">No events found. Add your first event!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {event.imageUrl && (
                    <div className="md:w-1/4">
                      <div className="h-48 md:h-full">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className={`p-6 flex-1 ${event.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-medium mb-2">{event.title}</h3>
                        <div className="text-sm text-text-light mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar size={14} />
                            <span>
                              {formatEventDate(event.startDate)}
                              {event.endDate && ` - ${formatEventDate(event.endDate)}`}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.id!)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-text mb-4 line-clamp-2">{event.description}</p>
                    {event.link && (
                      <a 
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        View Event Details →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {renderContent()}
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

const FeedbackTab = () => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<FeedbackMessage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch feedback messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getFeedbackMessages();
      setMessages(data as FeedbackMessage[]);
    } catch (error) {
      console.error('Error fetching feedback messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = async (messageId: string) => {
    try {
      const message = await getFeedbackMessage(messageId) as FeedbackMessage;
      if (message) {
        setSelectedMessage(message);
        
        // Mark as read if not already read
        if (!message.isRead) {
          await markFeedbackAsRead(messageId);
          // Update the messages list
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, isRead: true } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Error getting message details:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteFeedbackMessage(confirmDelete);
      
      // Remove from selected if it was the selected message
      if (selectedMessage?.id === confirmDelete) {
        setSelectedMessage(null);
      }
      
      // Refresh messages list
      await fetchMessages();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatMessageDate = (date: Date | FirebaseTimestamp | string | undefined) => {
    if (!date) return '';
    
    let jsDate: Date;
    
    if (date instanceof Date) {
      jsDate = date;
    } else if (typeof date === 'object' && 'toDate' in date) {
      jsDate = date.toDate();
    } else {
      jsDate = new Date(date);
    }
    
    return formatDistanceToNow(jsDate, { addSuffix: true });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Feedback Messages</h2>
      
      {isLoading ? (
        <div className="card p-6 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="card p-6">
          <p className="text-text-light text-center">No feedback messages received yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card p-4 h-full">
              <h3 className="text-lg font-medium mb-4">Messages</h3>
              <div className="divide-y">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`py-3 px-2 cursor-pointer hover:bg-primary/5 rounded ${
                      selectedMessage?.id === message.id ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => handleMessageClick(message.id!)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-medium ${!message.isRead ? 'text-primary' : ''}`}>
                        {message.name}
                        {!message.isRead && <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>}
                      </h4>
                      <span className="text-xs text-text-light">
                        {formatMessageDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-text-light truncate">{message.subject}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            {selectedMessage ? (
              <div className="card p-6 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-medium">{selectedMessage.subject}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-text-light">From: {selectedMessage.name}</span>
                      <span className="text-sm text-text-light">({selectedMessage.email})</span>
                    </div>
                    <p className="text-xs text-text-light mt-1">
                      Received {formatMessageDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(selectedMessage.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </div>
                <div className="border-t pt-4">
                  <p className="whitespace-pre-line">{selectedMessage.message}</p>
                </div>
                <div className="mt-6 border-t pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="btn-primary inline-flex"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="card p-6 flex items-center justify-center h-full">
                <p className="text-text-light">Select a message to view its details</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Settings</h2>
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                <input 
                  type="email" 
                  value="admin@example.com" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Change Password</label>
                <button className="btn-outline text-sm">
                  Update Password
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Website Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="maintenance"
                  className="mr-2"
                />
                <label htmlFor="maintenance" className="text-sm font-medium">Enable Maintenance Mode</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="caching"
                  className="mr-2"
                  checked
                />
                <label htmlFor="caching" className="text-sm font-medium">Enable Page Caching</label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 