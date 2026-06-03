import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';
import { Header } from '../components/Header';
import { Search, Plus, Minus, Check, ShoppingCart } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { 
    cart, 
    addToCart, 
    updateCartQty, 
    clearCart, 
    placeOrder,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    menuItems,
    categories,
    fetchMenuAndCategories
  } = useOrderStore();

  useEffect(() => {
    fetchMenuAndCategories();
  }, [fetchMenuAndCategories]);

  const categoriesList = ['All', ...categories];

  const [customerName, setCustomerName] = useState('');
  const [successPlaced, setSuccessPlaced] = useState(false);
  const [customizationInput, setCustomizationInput] = useState<string>('');
  const [customizingItem, setCustomizingItem] = useState<string | null>(null);

  // Filter menu items
  const filteredMenu = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  // Calculate pricing
  const subtotal = cart.reduce((acc, curr) => acc + (curr.menuItem.price * curr.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePlaceOrderSubmit = () => {
    if (cart.length === 0) return;
    setSuccessPlaced(true);
    setTimeout(() => {
      placeOrder(customerName.trim() || 'Walk-in Customer');
      setCustomerName('');
      setSuccessPlaced(false);
    }, 1200);
  };

  const handleAddWithCustomization = (item: any) => {
    addToCart(item, customizationInput.trim() || undefined);
    setCustomizingItem(null);
    setCustomizationInput('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen select-none bg-space-bg">
      <Header title="POS Terminal" />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Section: Menu Catalog & Categories */}
        <div className="flex-1 p-6 flex flex-col space-y-5 overflow-y-auto">
          {/* Top Search & Filter row */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm text-left">
              <Search className="w-4 h-4 text-space-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-space-border rounded-lg py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-space-muted/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Category Selectors */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-md">
              {categoriesList.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                      isActive
                        ? 'bg-gray-950 border-gray-950 text-white shadow-md'
                        : 'bg-white border-space-border text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dishes Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => setCustomizingItem(item.id)}
                className="bg-white border border-space-border hover:border-gray-400 hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group text-left"
              >
                {/* Image panel */}
                <div className="h-[120px] bg-gray-50 border-b border-space-border relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card contents */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-[13px] font-extrabold text-gray-950 truncate">{item.name}</h4>
                    <p className="text-[10px] text-space-muted font-medium mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-extrabold text-primary font-heading">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="w-7 h-7 rounded-lg bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors"
                      title="Add to cart"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Customization modal trigger overlay */}
          {customizingItem && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-2xl border border-space-border text-left">
                <h3 className="text-sm font-extrabold text-gray-950 font-heading mb-1 uppercase tracking-wider">
                  Dish Customizations
                </h3>
                <p className="text-xs text-space-muted mb-4 font-semibold">
                  Add custom prep notes (e.g., "No onions", "Extra cheese")
                </p>
                <input
                  type="text"
                  placeholder="e.g. No onions"
                  value={customizationInput}
                  onChange={(e) => setCustomizationInput(e.target.value)}
                  className="w-full bg-space-bg border border-space-border rounded-lg py-2 px-3 text-xs text-gray-950 mb-5 focus:border-primary focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       const itemObj = menuItems.find(m => m.id === customizingItem);
                       if (itemObj) handleAddWithCustomization(itemObj);
                    }
                  }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setCustomizingItem(null);
                      setCustomizationInput('');
                    }}
                    className="py-2.5 border border-space-border hover:border-gray-400 rounded-lg text-xs font-bold text-gray-600 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                       const itemObj = menuItems.find(m => m.id === customizingItem);
                       if (itemObj) handleAddWithCustomization(itemObj);
                    }}
                    className="py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold text-center"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Current Order Cart */}
        <div className="w-[380px] bg-white border-l border-space-border flex flex-col justify-between shrink-0 h-full relative z-10 shadow-2xl shadow-black/5">
          <div className="flex flex-col h-full justify-between">
            {/* Cart Header */}
            <div className="p-6 border-b border-space-border text-left">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-gray-950 font-heading">
                  Current Order
                </h3>
                <span className="text-[10px] bg-blue-50 text-primary border border-blue-100 px-2 py-0.5 rounded font-extrabold uppercase select-none">
                  #New
                </span>
              </div>
              <input
                type="text"
                placeholder="Walk-in Customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-space-bg border border-space-border rounded-lg py-2 px-3 text-xs text-gray-900 mt-4 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Cart List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length > 0 ? (
                cart.map((c, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-left">
                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-2 mr-3 shrink-0">
                        <button
                          onClick={() => updateCartQty(c.menuItem.id, -1)}
                          className="w-6 h-6 rounded-lg bg-gray-50 border border-space-border hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-extrabold text-gray-950 w-4 text-center">
                          {c.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(c.menuItem.id, 1)}
                          className="w-6 h-6 rounded-lg bg-gray-50 border border-space-border hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-bold text-gray-950 truncate text-[13px]">
                          {c.menuItem.name}
                        </p>
                        {c.customizations && (
                          <p className="text-[10px] text-red-500 font-semibold truncate mt-0.5">
                            {c.customizations}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <span className="font-extrabold text-gray-950 text-[13px]">
                        ${(c.menuItem.price * c.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-b border-space-border/50"></div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-space-muted font-semibold text-xs select-none">
                  Shopping cart is empty. Add items from the catalog.
                </div>
              )}
            </div>

            {/* Checkout Pricing footer */}
            <div className="p-6 border-t border-space-border bg-gray-50/50 space-y-5">
              <div className="space-y-2 text-xs font-semibold text-space-muted text-left border-b border-space-border/50 pb-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="text-gray-800">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline text-left">
                <span className="text-sm font-extrabold text-gray-600">Total</span>
                <span className="text-3xl font-extrabold text-primary font-heading">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  disabled={cart.length === 0 || successPlaced}
                  onClick={handlePlaceOrderSubmit}
                  className={`w-full py-4 text-white rounded-xl text-xs font-extrabold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 uppercase ${
                    successPlaced
                      ? 'bg-green-600'
                      : 'bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg shadow-primary/10'
                  }`}
                >
                  {successPlaced ? (
                    <>
                      <Check className="w-4 h-4" />
                      Order Placed
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-1 shrink-0" />
                      Place Order
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={cart.length === 0}
                    onClick={() => alert('Order layout stored in draft cache.')}
                    className="py-3 border border-space-border hover:border-gray-400 rounded-xl text-xs font-extrabold text-gray-700 text-center bg-white transition-all disabled:opacity-40"
                  >
                    Save Cart
                  </button>
                  <button
                    disabled={cart.length === 0}
                    onClick={clearCart}
                    className="py-3 border border-red-200 hover:border-red-500 hover:bg-red-50 rounded-xl text-xs font-extrabold text-red-500 text-center bg-white transition-all disabled:opacity-40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default MenuPage;
