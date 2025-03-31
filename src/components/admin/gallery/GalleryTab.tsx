import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getGalleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../../services/contentService';
import { GalleryItem } from '../../../types/contentTypes';

const GalleryTab = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getGalleryItems();
      setItems(data as GalleryItem[]);
    } catch (err) {
      setError('Failed to fetch gallery items');
      console.error('Error fetching gallery items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (item: Omit<GalleryItem, 'id'>) => {
    try {
      const id = await addGalleryItem(item);
      setItems([...items, { ...item, id }]);
      setIsAdding(false);
      toast.success('Gallery item added successfully');
    } catch (err) {
      toast.error('Failed to add gallery item');
      console.error('Error adding gallery item:', err);
    }
  };

  const handleUpdateItem = async (id: string, item: Partial<GalleryItem>) => {
    try {
      await updateGalleryItem(id, item);
      setItems(items.map(i => i.id === id ? { ...i, ...item } : i));
      setEditingItem(null);
      toast.success('Gallery item updated successfully');
    } catch (err) {
      toast.error('Failed to update gallery item');
      console.error('Error updating gallery item:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteGalleryItem(id);
      setItems(items.filter(item => item.id !== id));
      toast.success('Gallery item deleted successfully');
    } catch (err) {
      toast.error('Failed to delete gallery item');
      console.error('Error deleting gallery item:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Items</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="relative h-48 mb-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <h3 className="font-medium mb-2">{item.title}</h3>
            <p className="text-text-light text-sm mb-2">{item.description}</p>
            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {item.category}
            </span>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {(isAdding || editingItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {isAdding ? 'Add Gallery Item' : 'Edit Gallery Item'}
            </h3>
            {/* Add your form component here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTab; 