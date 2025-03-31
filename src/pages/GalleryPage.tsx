import { useState, useEffect } from 'react';
import { getGalleryItems } from '../services/contentService';
import { GalleryItem } from '../types/contentTypes';

const GalleryPage: React.FC = () => {
  // State for gallery items
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  // State for filtering
  const [activeFilter, setActiveFilter] = useState<string>("All");
  // State for modal
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  
  // Fetch gallery items on component mount
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setIsLoading(true);
      try {
        const data = await getGalleryItems();
        setGalleryItems(data as GalleryItem[]);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGalleryItems();
  }, []);

  // Get unique categories
  const categories = ["All", "research", "conferences", "laboratory", "awards", "students"].map(category => ({
    id: category.toLowerCase(),
    label: category === "All" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)
  }));

  // Filter gallery items
  const filteredItems = activeFilter === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter.toLowerCase());

  return (
    <div className="bg-background-alt min-h-screen">
      <div className="bg-primary/10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-center mb-4">Gallery</h1>
          <p className="text-lg text-text-light text-center max-w-3xl mx-auto">
            A visual collection of Professor Abolaji's research activities, conferences, awards, and community outreach.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 justify-center">
            <Filter className="text-primary mr-2" size={20} />
            <h2 className="text-lg font-medium">Filter by Category</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeFilter === category.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-text-dark'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="animate-spin text-primary" size={40} />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-light">No gallery items match the selected category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded-full">
                      {categories.find(c => c.id === item.category)?.label || item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{item.title}</h3>
                    <p className="text-text-light text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for full image view */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-white/80 p-1 rounded-full z-10 hover:bg-white transition-colors"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>
            
            <div className="relative h-96">
              <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.title} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium">{selectedItem.title}</h3>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {selectedItem.category}
                </span>
              </div>
              <p className="text-text-light">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage; 