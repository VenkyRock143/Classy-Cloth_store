import React, { useState, useReducer, createContext, useContext, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, X, Plus, Heart, Search, Menu, Trash2, 
  Zap, Globe, Instagram, Twitter, Youtube, Truck, RefreshCw, Sun, Moon, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';

// --- 1. CORE ENGINE & MOCK DATA ---
const StoreContext = createContext();

const CATEGORIES = ['All', 'Outerwear', 'Utility', 'Street Tech', 'Tailored', 'Footwear', 'Basics', 'Archive'];

const MOCK_PRODUCTS = Array.from({ length: 80 }).map((_, i) => ({
  id: i + 1,
  name: `${['Noble', 'Apex', 'Vanguard', 'Elite', 'Zenith', 'Prime'][i % 6]} ${['Parka', 'Gilet', 'Cargo', 'Blazer', 'Knit', 'Boot'][i % 6]}`,
  price: Math.floor(Math.random() * 95000) + 8000,
  cat: CATEGORIES[1 + (i % (CATEGORIES.length - 1))],
  img: `https://images.unsplash.com/photo-${[
    '1617137968427-85924c800a22', '1550246140-5119ae4790b8', '1520975916090-3105956dac38', 
    '1618354691373-d851c5c3a990', '1490114538077-0a7f8cb49891', '1552374196-1ab2a1c593e8'
  ][i % 6]}?auto=format&fit=crop&q=80&w=800&h=1200`,
  tag: i % 5 === 0 ? 'EXCLUSIVE' : 'NEW DROP',
}));

const storeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const exists = state.cart.find(item => item.id === action.payload.id);
      return {
        ...state,
        cart: exists 
          ? state.cart.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i) 
          : [...state.cart, { ...action.payload, qty: 1 }],
        notification: { text: `ADDED: ${action.payload.name}` }
      };
    case 'REMOVE_ITEM':
      return { ...state, cart: state.cart.filter(i => i.id !== action.payload) };
    case 'TOGGLE_THEME':
      return { ...state, darkMode: !state.darkMode };
    case 'CLEAR_NOTIF': return { ...state, notification: null };
    default: return state;
  }
};

// --- 2. SUB-COMPONENTS ---

function PremiumHero({ darkMode }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative w-full h-[60vh] md:h-[90vh] rounded-[1.5rem] md:rounded-[4rem] overflow-hidden mb-8 md:mb-24 group">
      <motion.div style={{ y }} className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=90&w=2000"
          className="w-full h-full object-cover scale-110"
          alt="Classy Cloth Store Hero"
        />
      </motion.div>
      <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-black via-black/20 to-transparent' : 'from-white/80 via-transparent to-transparent'}`} />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-24">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl md:text-[8vw] font-[1000] italic leading-[0.9] tracking-tighter uppercase mb-4 md:mb-6">
            CLASSY <br/>
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-[#00f2ff] to-[#7000ff]' : 'from-blue-700 to-purple-700'}`}>
              CLOTH.
            </span>
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <button className={`w-fit px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-[9px] md:text-[10px] tracking-[0.3em] uppercase transition-all ${darkMode ? 'bg-white text-black hover:bg-[#00f2ff]' : 'bg-black text-white hover:bg-blue-600'}`}>
              Shop Drop_01
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const { dispatch, state } = useContext(StoreContext);
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
      <div className={`relative aspect-[3/4] rounded-xl md:rounded-[2.5rem] overflow-hidden mb-2 md:mb-6 ${state.darkMode ? 'bg-[#111]' : 'bg-gray-100'}`}>
        <img src={product.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
        <button 
          onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
          className="absolute bottom-2 right-2 md:bottom-6 md:right-6 p-2 md:p-5 bg-[#00f2ff] text-black rounded-full shadow-2xl md:translate-y-20 md:group-hover:translate-y-0 transition-all duration-500"
        >
          <Plus size={16} className="md:w-6 md:h-6" />
        </button>
      </div>
      <div className="px-1">
        <h4 className="text-[10px] md:text-lg font-black italic uppercase tracking-tighter leading-tight truncate">{product.name}</h4>
        <div className="flex flex-col md:flex-row md:justify-between mt-0.5 md:mt-1">
          <p className="text-[7px] md:text-[10px] font-bold opacity-40 uppercase tracking-widest">{product.cat}</p>
          <span className={`text-[9px] md:text-lg font-black italic ${state.darkMode ? 'text-[#00f2ff]' : 'text-blue-600'}`}>₹{product.price.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

// --- 3. MAIN APP ---

export default function ClassyClothStore() {
  const [state, dispatch] = useReducer(storeReducer, { cart: [], notification: null, darkMode: true });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => 
    MOCK_PRODUCTS.filter(p => (activeFilter === 'All' || p.cat === activeFilter) && p.name.toLowerCase().includes(searchQuery.toLowerCase())), 
  [activeFilter, searchQuery]);

  // Clear notification after 3s
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_NOTIF' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <div className={`${state.darkMode ? 'bg-[#050505] text-white' : 'bg-white text-black'} min-h-screen transition-colors duration-500 font-sans antialiased overflow-x-hidden`}>
        
        {/* NAV */}
        <nav className={`fixed top-0 w-full z-[1000] px-4 md:px-12 py-4 md:py-6 flex justify-between items-center backdrop-blur-md border-b ${state.darkMode ? 'bg-black/50 border-white/5' : 'bg-white/50 border-black/5'}`}>
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => setIsMenuOpen(true)}><Menu size={22} /></button>
            <h1 className="text-lg md:text-2xl font-[1000] italic tracking-tighter uppercase">
              CLASSY<span className={state.darkMode ? "text-[#00f2ff]" : "text-blue-600"}>CLOTH</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })} className="p-2">{state.darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <button onClick={() => setIsCartOpen(true)} className={`relative p-2.5 md:p-3 rounded-full ${state.darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              <ShoppingBag size={18} />
              {state.cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#ff0055] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{state.cart.length}</span>}
            </button>
          </div>
        </nav>

        <main className="pt-24 md:pt-32 pb-20 px-3 md:px-12 max-w-[1800px] mx-auto">
          <PremiumHero darkMode={state.darkMode} />

          {/* FILTER BAR */}
          <div className="sticky top-20 md:top-24 z-40 py-4 mb-8 overflow-x-auto no-scrollbar flex gap-2 md:gap-3 bg-transparent backdrop-blur-sm">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} onClick={() => {setActiveFilter(cat); setVisibleCount(12);}}
                className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === cat ? (state.darkMode ? 'bg-[#00f2ff] text-black shadow-lg shadow-cyan-500/20' : 'bg-black text-white') : (state.darkMode ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10')}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRID - 3 COLUMNS MOBILE, 4 COLUMNS DESKTOP */}
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => setVisibleCount(p => p + 12)}
                className={`px-8 py-4 md:px-12 md:py-5 font-black uppercase text-[9px] tracking-[0.3em] rounded-full border-2 transition-all ${state.darkMode ? 'border-white hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'}`}
              >
                Load More
              </button>
            </div>
          )}
        </main>

        <Footer darkMode={state.darkMode} />

        {/* OVERLAYS */}
        <AnimatePresence>
          {isMenuOpen && <SideMenu onClose={() => setIsMenuOpen(false)} setActiveFilter={setActiveFilter} categories={CATEGORIES} />}
          {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />}
          {state.notification && <Toast toast={state.notification} />}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
}

// --- 4. SIDEBARS & DRAWERS ---

function SideMenu({ onClose, setActiveFilter, categories }) {
  const { state } = useContext(StoreContext);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[2000]" />
      <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className={`fixed left-0 top-0 h-full w-4/5 md:max-w-md z-[2100] p-10 flex flex-col ${state.darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center mb-16">
          <span className="font-black italic text-xl uppercase tracking-tighter">Navigate</span>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="space-y-4">
          {categories.map((cat) => (
            <button key={cat} onClick={() => { setActiveFilter(cat); onClose(); }} className="w-full text-left text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter hover:text-[#00f2ff] transition-all hover:translate-x-2">{cat}</button>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function CartDrawer({ onClose }) {
  const { state, dispatch } = useContext(StoreContext);
  const total = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000]" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className={`fixed right-0 top-0 h-full w-full md:max-w-md z-[2100] flex flex-col ${state.darkMode ? 'bg-[#080808] border-l border-white/10' : 'bg-white border-l border-black/10'}`}>
        <div className="p-8 border-b border-current/5 flex justify-between items-center">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Your Bag</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {state.cart.length === 0 && <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-center mt-20">Your bag is empty</p>}
          {state.cart.map(item => (
            <div key={item.id} className="flex gap-4 items-center">
              <img src={item.img} className="w-16 h-20 object-cover rounded-xl" alt="" />
              <div className="flex-1">
                <h4 className="text-[9px] font-black uppercase tracking-tighter leading-tight">{item.name}</h4>
                <p className="font-black italic">₹{item.price.toLocaleString()}</p>
                <p className="text-[8px] opacity-40 uppercase font-bold">Qty: {item.qty}</p>
              </div>
              <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })} className="text-red-500"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
        <div className={`p-8 ${state.darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
          <div className="flex justify-between items-end mb-6">
            <span className="text-[9px] font-black uppercase opacity-50 tracking-widest">Total</span>
            <span className="text-3xl font-black italic">₹{total.toLocaleString()}</span>
          </div>
          <button className={`w-full py-5 font-black uppercase text-[10px] tracking-[0.3em] rounded-xl flex items-center justify-center gap-3 ${state.darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>Checkout <ArrowRight size={14}/></button>
        </div>
      </motion.div>
    </>
  );
}

function Footer({ darkMode }) {
  return (
    <footer className={`pt-20 pb-10 px-6 border-t transition-colors ${darkMode ? 'bg-black border-white/5' : 'bg-gray-100 border-black/5'}`}>
      <div className="max-w-[1800px] mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-[1000] italic mb-4 tracking-tighter uppercase">Classy Cloth</h3>
            <p className="opacity-40 text-[10px] font-bold uppercase tracking-widest leading-loose max-w-xs mx-auto md:mx-0">Premium performance apparel engineered for the modern man. 2026 Archive.</p>
          </div>
          <div className="flex justify-center md:justify-end gap-10 md:col-span-2">
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-cyan-500">Legal</h4>
              <ul className="text-[9px] font-bold uppercase tracking-widest opacity-40 space-y-2">
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-pink-500">Social</h4>
              <ul className="text-[9px] font-bold uppercase tracking-widest opacity-40 space-y-2">
                <li>Instagram</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="opacity-20 text-[8px] font-black uppercase tracking-[0.5em]">© 2026 CLASSY CLOTH STORE INDIA — SHIPPED GLOBALLY</p>
      </div>
    </footer>
  );
}

function Toast({ toast }) {
  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-[4000] bg-[#00f2ff] text-black px-6 py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3"
    >
      <Zap size={14} fill="black" /> {toast.text}
    </motion.div>
  );
}
