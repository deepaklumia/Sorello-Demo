import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  FolderPlus, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    menuItems: number;
  };
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: string;
  preparationTime: number;
  isAvailable: boolean;
  categoryId: string;
}

export const MenuManagement: React.FC = () => {
  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState('');

  // MenuItem states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals / Item Operations
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Item Form Fields
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemTime, setItemTime] = useState(10);
  const [itemImage, setItemImage] = useState('');
  const [itemCatId, setItemCatId] = useState('');
  const [itemLoading, setItemLoading] = useState(false);

  // Load Categories & Items
  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories
      const catRes = await api.get('/restaurant/menu/categories');
      const cats: Category[] = catRes.data || [];
      setCategories(cats);

      // Load menu items
      const itemsRes = await api.get('/restaurant/menu/items');
      const items: MenuItem[] = itemsRes.data || [];
      setMenuItems(items);

      if (cats.length > 0) {
        setActiveCategoryId(cats[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load menu configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  // Filter items for active category
  const filteredItems = menuItems.filter(item => item.categoryId === activeCategoryId);

  // Get item counts per category (since prisma relation counts might not be filled)
  const getItemCount = (catId: string) => {
    return menuItems.filter(item => item.categoryId === catId).length;
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await api.post('/restaurant/menu/categories', { name: newCatName.trim() });
      const addedCat = res.data;
      setCategories([...categories, addedCat]);
      setNewCatName('');
      if (!activeCategoryId) {
        setActiveCategoryId(addedCat.id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add category');
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm('Delete category? All items inside will be unassigned or deleted.')) return;
    try {
      await api.delete(`/restaurant/menu/categories/${catId}`);
      setCategories(categories.filter(c => c.id !== catId));
      setMenuItems(menuItems.filter(item => item.categoryId !== catId));
      if (activeCategoryId === catId) {
        const remaining = categories.filter(c => c.id !== catId);
        setActiveCategoryId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  // Edit Category Handler (Submit)
  const handleUpdateCategoryName = async (cat: Category) => {
    if (!editCatName.trim()) return;
    try {
      const res = await api.put(`/restaurant/menu/categories/${cat.id}`, { name: editCatName.trim() });
      setCategories(categories.map(c => c.id === cat.id ? { ...c, name: res.data.name } : c));
      setEditingCategory(null);
      setEditCatName('');
    } catch (err: any) {
      alert(err.message || 'Failed to update category');
    }
  };

  // Toggle Availability Handler
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const nextVal = !item.isAvailable;
      const res = await api.patch(`/restaurant/menu/items/${item.id}/availability`, { isAvailable: nextVal });
      
      setMenuItems(menuItems.map(m => m.id === item.id ? { ...m, isAvailable: res.data.isAvailable } : m));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle item availability');
    }
  };

  // Delete Menu Item
  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/restaurant/menu/items/${itemId}`);
      setMenuItems(menuItems.filter(m => m.id !== itemId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  // Open modal to Add Item
  const openAddItemModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemDesc('');
    setItemPrice('');
    setItemTime(10);
    setItemImage('');
    setItemCatId(activeCategoryId || '');
    setShowItemModal(true);
  };

  // Open modal to Edit Item
  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description || '');
    setItemPrice(item.price);
    setItemTime(item.preparationTime);
    setItemImage(item.imageUrl || '');
    setItemCatId(item.categoryId);
    setShowItemModal(true);
  };

  // Submit Menu Item Modal Form (Add or Edit)
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || !itemCatId) return;

    try {
      setItemLoading(true);
      const payload = {
        name: itemName.trim(),
        description: itemDesc.trim(),
        price: parseFloat(itemPrice),
        preparationTime: Number(itemTime),
        imageUrl: itemImage.trim() || undefined,
        categoryId: itemCatId
      };

      if (editingItem) {
        // Edit flow
        const res = await api.put(`/restaurant/menu/items/${editingItem.id}`, payload);
        setMenuItems(menuItems.map(m => m.id === editingItem.id ? res.data : m));
      } else {
        // Add flow
        const res = await api.post('/restaurant/menu/items', payload);
        setMenuItems([...menuItems, res.data]);
      }
      setShowItemModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save menu item');
    } finally {
      setItemLoading(false);
    }
  };

  // Simulate CSV Export
  const handleExportCSV = () => {
    const headers = 'ID,Name,Category,Price,Preparation Time,Available\n';
    const rows = menuItems.map(item => {
      const catName = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
      return `${item.id},"${item.name}","${catName}",$${item.price},${item.preparationTime} mins,${item.isAvailable}`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'menu_inventory.csv');
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-2 border-space-border border-t-accent-cyan animate-spin"></div>
        <p className="text-xs text-space-muted font-bold tracking-widest uppercase mt-4">Loading Menu Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight">
            Menu Management
          </h2>
          <p className="text-xs text-space-muted mt-1 font-medium">
            Configure your restaurant's digital catalog, categories, and item availability in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial bg-[#151B2C] hover:bg-[#1E273E] text-white border border-space-border/80 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-space-muted" />
            Export CSV
          </button>
          
          <button
            onClick={openAddItemModal}
            disabled={categories.length === 0}
            className="flex-1 sm:flex-initial bg-accent-cyan text-[#0B0F19] hover:bg-opacity-90 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Categories (Left) & Menu Items (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Categories List */}
        <div className="lg:col-span-4 glass-card rounded-xl p-5 border border-space-border/60 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-space-border/30">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">Categories</h3>
            <span className="text-[10px] bg-space-surface px-2 py-0.5 rounded font-extrabold text-space-muted">
              {categories.length} Total
            </span>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Starters"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 bg-[#090D18] border border-space-border rounded-lg px-3 py-2 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
            />
            <button
              type="submit"
              className="bg-space-surface border border-space-border hover:border-accent-cyan p-2.5 rounded-lg text-accent-cyan transition-all"
              title="Add Category"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </form>

          {/* Categories Nav stack */}
          <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = activeCategoryId === cat.id;
              const isEditing = editingCategory?.id === cat.id;
              const itemCount = getItemCount(cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => !isEditing && setActiveCategoryId(cat.id)}
                  className={`group w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#151B2C] text-accent-cyan border border-space-border/80 shadow-[0_0_15px_rgba(0,240,255,0.02)]'
                      : 'text-space-muted hover:text-white hover:bg-space-surface/20'
                  }`}
                >
                  <div className="flex-1 pr-3 text-left">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          className="bg-space-dark border border-space-border rounded px-2 py-0.5 text-xs text-white w-full focus:outline-none focus:border-accent-cyan"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateCategoryName(cat);
                            if (e.key === 'Escape') setEditingCategory(null);
                          }}
                        />
                        <button
                          onClick={() => handleUpdateCategoryName(cat)}
                          className="p-1 hover:text-emerald-400 text-space-muted"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-1 hover:text-rose-400 text-space-muted"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span>{cat.name}</span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-space-muted bg-space-dark/80 px-2 py-0.5 rounded-full font-bold select-none">
                        {itemCount}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(cat);
                          setEditCatName(cat.name);
                        }}
                        className="p-1 hover:text-accent-cyan rounded hover:bg-space-surface/40"
                        title="Edit Name"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                        className="p-1 hover:text-rose-400 rounded hover:bg-space-surface/40"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {categories.length === 0 && (
              <p className="text-center py-6 text-space-muted font-semibold">
                No categories created yet. Create a category to start adding dishes.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Menu Items Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-space-border/20">
            <h3 className="text-sm font-extrabold font-heading text-white tracking-wide">
              {categories.find(c => c.id === activeCategoryId)?.name || 'Select a Category'}
            </h3>
            <p className="text-xs text-space-muted">
              Manage items inside this section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`glass-card rounded-xl border border-space-border/60 overflow-hidden flex flex-col justify-between hover:border-space-border transition-all duration-300 relative group ${
                  !item.isAvailable && 'opacity-65'
                }`}
              >
                {/* Out of Stock banner */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-[#0B0F19]/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
                    <span className="bg-[#0B0F19] border border-space-border/90 text-space-muted text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Card Top: Image / Default Graphic */}
                <div className="h-[120px] w-full relative overflow-hidden bg-[#101524] border-b border-space-border/40">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#151B2C] to-[#243354] flex items-center justify-center text-space-border/50 text-[10px] font-bold uppercase select-none">
                      NO IMAGE PROVIDED
                    </div>
                  )}

                  {/* Preparation Badge */}
                  <span className="absolute top-3 left-3 bg-[#0B0F19]/80 border border-space-border/80 text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-accent-cyan" />
                    {item.preparationTime} mins
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{item.name}</h4>
                      <span className="text-xs font-extrabold text-accent-cyan shrink-0">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-space-muted font-medium line-clamp-2 mt-1 leading-relaxed">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Action tray */}
                  <div className="flex justify-between items-center border-t border-space-border/30 pt-3 mt-4">
                    {/* Availability Switch */}
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider select-none transition-colors ${
                        item.isAvailable ? 'text-accent-cyan' : 'text-space-muted'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-accent-cyan" />
                          Available
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-space-muted" />
                          Out of Stock
                        </>
                      )}
                    </button>

                    {/* Edit/Delete icons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-1.5 hover:bg-space-surface rounded text-space-muted hover:text-white transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 hover:bg-space-surface rounded text-space-muted hover:text-rose-400 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-space-muted font-semibold glass-card rounded-xl border border-space-border/50">
                No menu items found in this category. Click "Add Item" to add some!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Item Modal Dialog (Add / Edit) */}
      {showItemModal && (
        <div className="fixed inset-0 bg-space-dark/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="glass-card rounded-xl p-6 w-full max-w-[460px] shadow-2xl border border-space-border relative text-left">
            <button
              onClick={() => setShowItemModal(false)}
              className="absolute top-4 right-4 text-space-muted hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="text-base font-bold font-heading text-white mb-1 flex items-center gap-2">
              {editingItem ? 'Edit Menu Item' : 'Add New Item'}
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </h3>
            <p className="text-xs text-space-muted mb-5 leading-relaxed">
              Define pricing, description, preparation timelines, and graphics.
            </p>

            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wagyu Slider"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                    Category Group
                  </label>
                  <select
                    value={itemCatId}
                    onChange={(e) => setItemCatId(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-space-dark text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                    Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="18.50"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="12"
                    value={itemTime}
                    onChange={(e) => setItemTime(Number(e.target.value))}
                    className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                  Image URL (Unsplash or direct asset)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (optional)"
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe ingredients, allergy alerts, and configurations..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={itemLoading}
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold py-3 px-4 rounded-lg text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50 mt-2"
              >
                {itemLoading ? 'Saving Dish...' : editingItem ? 'Save Updates' : 'Add Item to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MenuManagement;
