// Content type interfaces for the admin dashboard

export interface Publication {
  id?: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  abstract?: string;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GalleryItem {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileInfo {
  id?: string;
  name: string;
  title: string;
  bio: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  awards: AwardItem[];
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

export interface ExperienceItem {
  position: string;
  institution: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export interface AwardItem {
  title: string;
  organization: string;
  year: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string;
  location?: string;
  imageUrl?: string;
  category?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface BaseContent {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Update the FeedbackMessage interface
export interface FeedbackMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt?: Date | string;
}

// Portfolio Page Content Types
export interface PortfolioContent {
  id?: string;
  sections: PortfolioSection[];
  updatedAt?: Date | string;
}

export interface PortfolioSection {
  id?: string;
  title: string;
  description?: string;
  iconName: string;
  subsections: PortfolioSubsection[];
  order: number;
}

export interface PortfolioSubsection {
  id?: string;
  title: string;
  content: string;
  type: 'publication' | 'project' | 'award' | 'text';
  metadata?: {
    authors?: string;
    journal?: string;
    year?: number;
    doi?: string;
    period?: string;
    organization?: string;
  };
  order: number;
}

// Cooperation Page Content Types
export interface CooperationContent {
  id?: string;
  academicCollaborations: AcademicCollaboration[];
  industryPartnerships: IndustryPartnership[];
  researchNetworks: ResearchNetwork[];
  collaborationOpportunities: string;
  updatedAt?: Date | string;
}

export interface AcademicCollaboration {
  id?: string;
  institution: string;
  description: string;
  contactPerson?: string;
}

export interface IndustryPartnership {
  id?: string;
  company: string;
  description: string;
  year: string;
}

export interface ResearchNetwork {
  id?: string;
  name: string;
  description: string;
  members: number;
}

// Foundation Page Content Types
export interface FoundationContent {
  id?: string;
  mission: string;
  programs: FoundationProgram[];
  impactStats: ImpactStat[];
  upcomingEvents: FoundationEvent[];
  updatedAt?: Date | string;
}

export interface FoundationProgram {
  id?: string;
  title: string;
  description: string;
  beneficiaries: string;
  iconName: string;
}

export interface ImpactStat {
  id?: string;
  number: string;
  description: string;
}

export interface FoundationEvent {
  id?: string;
  title: string;
  date: string;
  location: string;
}

// Contact Page Content Types
export interface ContactContent {
  id?: string;
  contactInfo: ContactInfo[];
  officeLocations: OfficeLocation[];
  updatedAt?: Date | string;
}

export interface ContactInfo {
  id?: string;
  title: string;
  iconName: string;
  details: string[];
}

export interface OfficeLocation {
  id?: string;
  name: string;
  address: string;
  hours: string;
}

export interface HomePageContent {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  sections: ContentSection[];
  updatedAt?: Date;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
} 