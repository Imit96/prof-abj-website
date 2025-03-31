import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ContactTab from '../components/admin/contact/ContactTab';
import FoundationTab from '../components/admin/foundation/FoundationTab';
import PortfolioTab from '../components/admin/portfolio/PortfolioTab';
import GalleryTab from '../components/admin/gallery/GalleryTab';

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="foundation">Foundation</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="contact">
          <ContactTab />
        </TabsContent>
        <TabsContent value="foundation">
          <FoundationTab />
        </TabsContent>
        <TabsContent value="portfolio">
          <PortfolioTab />
        </TabsContent>
        <TabsContent value="gallery">
          <GalleryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage; 