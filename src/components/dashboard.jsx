import React, { useState, useEffect, useReducer } from 'react';
import { ShoppingBag, X, Search, Plus, Minus, Trash2, CheckCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- REDUCER LOGIC ---
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.payload.id && item.size === action.payload.size);
      if (existingItem) {
        return state.map(item => 
          item.id === action.payload.id && item.size === action.payload.size 
          ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    case 'REMOVE_ITEM':
      return state.filter(item => !(item.id === action.payload.id && item.size === action.payload.size));
    case 'UPDATE_QTY':
      return state.map(item => 
        (item.id === action.payload.id && item.size === action.payload.size) 
        ? { ...item, qty: Math.max(1, action.payload.qty) } : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

const ClothingStore = () => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const localData = typeof window !== 'undefined' ? localStorage.getItem('studio_cart') : null;
    return localData ? JSON.parse(localData) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('studio_cart', JSON.stringify(cart));
  }, [cart]);

  const PRODUCTS = [
    { id: 1, name: 'Trench Coat', price: 12499, cat: 'Outerwear', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', desc: 'Premium gabardine construction.' },
    { id: 2, name: 'Selvedge Denim', price: 4999, cat: 'Pants', img: 'https://images.unsplash.com/photo-1725387072845-7431bbc453bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2VsdmVkZ2UlMjBEZW5pbXxlbnwwfHwwfHx8MA%3D%3D', desc: 'Japanese raw denim.' },
    { id: 3, name: 'Oversized Hoodie', price: 3499, cat: 'Basics', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', desc: 'Heavyweight organic cotton.' },
    { id: 4, name: 'Linen Shirt', price: 2799, cat: 'Shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', desc: 'Ethically sourced linen.' }
  ];

  const filteredProducts = PRODUCTS.filter(p => 
    (activeCategory === 'All' || p.cat === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleAddToCart = (product, size = 'M') => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, size } });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[300] bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl">
            <CheckCircle size={18} className="text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Added to Bag</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PRIMARY STICKY NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-white border-b border-slate-100 px-6 lg:px-12 py-4 h-[130px] md:h-[80px] flex flex-col md:flex-row items-center justify-between">
        <div className="text-xl md:text-2xl font-black tracking-tighter uppercase mb-4 md:mb-0">
          Classy Comforts Club.
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex-1 md:w-64">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-slate-50 rounded-full transition relative">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 2. SECONDARY STICKY HEADER */}
      <div className="sticky top-[130px] md:top-[80px] z-[90] bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-black tracking-tighter uppercase italic text-red-600">Menswear</h2>
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {['All', 'Outerwear', 'Pants', 'Basics', 'Shirts'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all pb-1 ${
                  activeCategory === cat ? 'text-black border-b-2 border-black' : 'text-slate-400 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PRODUCT GRID */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(product => (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={product.id} className="group relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-sm">
                <img 
                   src={product.img} 
                   alt={product.name} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 cursor-pointer" 
                   onClick={() => setSelectedProduct(product)}
                />
                
                {/* MOBILE QUICK ADD BUTTON */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 right-4 md:hidden bg-black text-white p-3 rounded-full shadow-xl active:scale-90 transition-transform"
                >
                  <Plus size={20} />
                </button>

                {/* DESKTOP HOVER BUTTON */}
                <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-tighter"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-tighter"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">{product.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{product.cat}</p>
                </div>
                <span className="font-bold text-sm">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[210] shadow-2xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic underline decoration-red-500">Your Bag</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag size={48} />
                    <p className="mt-4 font-bold text-[10px] uppercase">Empty Bag</p>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4 mb-8 border-b border-slate-50 pb-8">
                      <img src={item.img} className="w-20 h-24 object-cover rounded-sm" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-xs font-bold uppercase">{item.name}</h4>
                          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item })}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase mt-1">Size: {item.size}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-slate-200 rounded-full px-2">
                            <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { ...item, qty: item.qty - 1 } })}><Minus size={12} /></button>
                            <span className="mx-3 text-xs font-bold">{item.qty}</span>
                            <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { ...item, qty: item.qty + 1 } })}><Plus size={12} /></button>
                          </div>
                          <span className="text-sm font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="pt-8">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-bold uppercase text-slate-400">Total</span>
                    <span className="text-2xl font-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <button className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest">Checkout</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto grid md:grid-cols-2 rounded-sm shadow-2xl">
              <button className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full" onClick={() => setSelectedProduct(null)}><X size={20}/></button>
              <img src={selectedProduct.img} className="w-full h-80 md:h-full object-cover" />
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-black uppercase italic mb-4">{selectedProduct.name}</h2>
                <p className="text-sm text-slate-500 mb-8">{selectedProduct.desc}</p>
                <div className="mb-8">
                  <label className="text-[10px] font-bold uppercase block mb-4">Size</label>
                  <div className="flex gap-2">
                    {['S', 'M', 'L'].map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)} className={`w-10 h-10 border text-xs font-bold transition-colors ${selectedSize === s ? 'bg-black text-white border-black' : 'hover:border-black'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { handleAddToCart(selectedProduct, selectedSize); setSelectedProduct(null); }} className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest">Add — ₹{selectedProduct.price.toLocaleString('en-IN')}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClothingStore;