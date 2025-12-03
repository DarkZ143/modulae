/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, get } from "firebase/database";
import { LayoutDashboard } from "lucide-react";

// ---------------- CONFIGURATION ----------------

// Admin Emails
const ALLOWED_ADMINS = [
  "themodulae@gmail.com",
  "rahulbhardwajthestar58@gmail.com"
];

const SEARCH_CATEGORIES = [
  "products", "chairs", "dining", "furniture", "kitchen",
  "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

const staticPages: Record<string, string> = {
  "About Us": "/pages/about-us",
  "Contact Us": "/pages/contact-us",
  FAQ: "/pages/faq",
};

// Default Fallback Menu (used while loading or if DB is empty)
const DEFAULT_MENU = [
  {
    title: "Living",
    type: "dropdown",
    children: [
      {
        title: "Sofas",
        type: "list",
        items: [
          { title: "All Sofa Sets", href: "/shop" },
          { title: "L Shape Sofas", href: "/shop" }
        ]
      }
    ]
  }
];

// -----------------------------------------------------

const Navbar = () => {
  // UI States
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<number | null>(null);

  // Search States
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Data States
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Dynamic Content States (From Admin Panel)
  const [menuItems, setMenuItems] = useState<any[]>(DEFAULT_MENU);
  const [logo, setLogo] = useState<any>(null);
  const [shopCategories, setShopCategories] = useState<string[]>([]);

  const router = useRouter();

  // Refs
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const mainMenusRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  // ---------------- 1. INITIAL DATA FETCH ----------------
  useEffect(() => {
    // A. Fetch Search Data
    const fetchSearchData = async () => {
      try {
        const promises = SEARCH_CATEGORIES.map((category) => get(ref(rtdb, `${category}/`)));
        const snapshots = await Promise.all(promises);
        let combined: any[] = [];
        snapshots.forEach((snap) => {
          if (snap.exists()) {
            const data = snap.val();
            const items = Object.keys(data).map((key) => ({ slug: key, ...data[key] }));
            combined = [...combined, ...items];
          }
        });
        setAllProducts(combined);
      } catch (error) { console.error("Error fetching search data"); }
    };

    // B. Fetch Navbar Settings (Dynamic Menu & Logo)
    const fetchNavbarSettings = () => {
      const navRef = ref(rtdb, "settings/navbar_v2");
      onValue(navRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.menus) setMenuItems(data.menus);
          if (data.logo) setLogo(data.logo);
        }
      });

      // Fetch active categories for "Shop By Category" list
      const catRef = ref(rtdb, "settings/categories");
      onValue(catRef, (snap) => {
        if (snap.exists()) setShopCategories(snap.val());
      });
    };

    fetchSearchData();
    fetchNavbarSettings();
  }, []);

  // ---------------- 2. AUTH & CART LISTENER ----------------
  useEffect(() => {
    let unsubCart: any = null;
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Check Admin Status
      if (currentUser && ALLOWED_ADMINS.includes(currentUser.email || "")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      if (currentUser) {
        const cartRef = ref(rtdb, `carts/${currentUser.uid}`);
        unsubCart = onValue(cartRef, (snapshot) => {
          if (snapshot.exists()) {
            const cartData = snapshot.val();
            let totalQty = 0;
            Object.values(cartData).forEach((item: any) => totalQty += item.qty);
            setCartCount(totalQty);
          } else {
            setCartCount(0);
          }
        });
      } else {
        setCartCount(0);
      }
    });

    return () => {
      if (unsubCart) unsubCart();
      unsubAuth();
    };
  }, []);

  // ---------------- 3. FILTER LOGIC ----------------
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = allProducts.filter((item) =>
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.category?.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(filtered.slice(0, 6));
    }
  }, [searchQuery, allProducts]);


  // ---------------- HANDLERS ----------------
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) console.log("Searching:", searchQuery);
  };

  const handleResultClick = () => {
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const getDropdownClasses = (children: any[]) => {
    if (!children) return "hidden";
    const count = children.length;
    if (count >= 3) return "grid grid-cols-3 min-w-[700px]";
    if (count === 2) return "grid grid-cols-2 min-w-[500px]";
    return "grid grid-cols-1 min-w-[250px]";
  };

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) setCategoryOpen(false);
      if (mainMenusRef.current && !mainMenusRef.current.contains(event.target as Node)) setActiveDropdown(null);
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setIsDesktopSearchOpen(false); setSearchQuery(""); setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* --- DESKTOP SEARCH BAR (Overlay) --- */}
      <div ref={desktopSearchRef} className={`fixed top-0 left-0 right-0 bg-white p-4 border border-orange-400 shadow-md z-60 transition-transform duration-300 hidden md:flex ${isDesktopSearchOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-7xl mx-auto w-full relative">
          <div className="flex items-center gap-2 w-full">
            <form onSubmit={handleSearchSubmit} className="flex flex-1 border border-gray-600 rounded-md overflow-hidden">
              <input type="text" placeholder="Search products..." className="flex-1 px-4 py-2 text-sm outline-none border-gray-700" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") { setIsDesktopSearchOpen(false); setSearchQuery(""); } }} />
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white"><IconSearch className="w-5 h-5" /></button>
            </form>
            <button onClick={() => { setIsDesktopSearchOpen(false); setSearchQuery(""); }} className="p-2 text-gray-600"><IconX className="w-6 h-6" /></button>
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg border border-t-0 rounded-b-lg mt-1 overflow-hidden z-50">
              {searchResults.map((item) => (
                <Link key={item.slug} href={`/products/${item.slug}`} onClick={handleResultClick} className="flex items-center gap-4 p-3 hover:bg-gray-50 transition border-b last:border-none">
                  <div className="relative w-12 h-12 bg-gray-100 rounded shrink-0">
                    <Image src={item.images?.[0] || "/placeholder.png"} alt={item.title} fill className="object-cover rounded" />
                  </div>
                  <div><p className="font-semibold text-gray-800 text-sm">{item.title}</p><p className="text-orange-600 text-xs font-bold">₹{item.price}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE SEARCH BAR --- */}
      <div className={`fixed top-0 left-0 right-0 bg-white p-4 border-b shadow-md z-60 transition-transform duration-300 md:hidden ${isMobileSearchOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2">
            <form className="flex flex-1 border rounded-md overflow-hidden" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Search products..." className="flex-1 px-4 py-2 text-sm outline-none" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button className="px-4 py-2 bg-orange-500 text-white"><IconSearch className="w-5 h-5" /></button>
            </form>
            <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 text-gray-600"><IconX className="w-6 h-6" /></button>
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t mt-2 rounded-lg max-h-[60vh] overflow-y-auto z-50">
              {searchResults.map((item) => (
                <Link key={item.slug} href={`/products/${item.slug}`} onClick={handleResultClick} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-none">
                  <div className="relative w-10 h-10 bg-gray-100 rounded shrink-0">
                    <Image src={item.images?.[0] || "/placeholder.png"} alt={item.title} fill className="object-cover rounded" />
                  </div>
                  <div><p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p><p className="text-orange-600 text-xs font-bold">₹{item.price}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- NAVBAR MAIN --- */}
      <nav className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
              {isOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
            </button>

            <Link href={logo?.href || "/"} className="flex items-center gap-2">
              {logo?.src ? (
                <Image src={logo.src} alt={logo.alt || "Modulae"} width={120} height={40} className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <span className="text-5xl font-bold text-orange-500">M</span>
                  <span className="text-3xl font-semibold">odulae</span>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative" ref={mainMenusRef}>
            {/* Shop By Category Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button onClick={() => setCategoryOpen(!categoryOpen)} className="bg-gray-100 font-semibold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-200 transition">
                Shop By Category <IconMenu className="w-4 h-4" />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md w-56 py-2 z-50 border border-gray-100 max-h-96 overflow-y-auto">
                  {shopCategories.length > 0 ? shopCategories.map((cat) => (
                    <Link key={cat} href={`/${cat}`} className="block px-4 py-2 hover:bg-orange-50 text-sm text-gray-700 hover:text-orange-600 capitalize">
                      {cat.replace(/-/g, ' ')}
                    </Link>
                  )) : <p className="px-4 py-2 text-sm text-gray-400">Loading...</p>}
                </div>
              )}
            </div>

            {/* ✅ DYNAMIC MENU FROM ADMIN */}
            {menuItems.map((menu, idx) => (
              <div key={idx} className="relative group">
                {menu.type === 'link' ? (
                  <Link href={menu.href || "#"} className="flex items-center gap-1 text-sm font-semibold hover:text-orange-500">
                    {menu.title}
                  </Link>
                ) : (
                  <button onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)} className="flex items-center gap-1 text-sm font-semibold hover:text-orange-500">
                    {menu.title} <IconChevronDown className="w-4 h-4" />
                  </button>
                )}

                {/* Dropdown */}
                {menu.type === 'dropdown' && activeDropdown === idx && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl mt-4 p-6 rounded-xl z-50 border border-gray-100 ${getDropdownClasses(menu.children)}`}>
                    {menu.children && menu.children.map((cat: any, cIdx: number) => (
                      <div key={cIdx} className="mb-4 break-inside-avoid">
                        {cat.type === 'link' ? (
                          <Link href={cat.href || "#"} className="font-bold text-orange-600 mb-2 block hover:underline">{cat.title}</Link>
                        ) : (
                          <>
                            <h4 className="font-bold text-orange-600 mb-2 text-sm uppercase">{cat.title}</h4>
                            <ul className="space-y-1">
                              {cat.items?.map((item: any, iIdx: number) => (
                                <li key={iIdx}>
                                  <Link href={item.href || "#"} className="block text-sm text-gray-600 hover:text-gray-900 hover:underline">
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search Triggers */}
            <button onClick={() => setIsDesktopSearchOpen(true)} className="hidden md:block bg-gray-50 p-2 rounded-full hover:bg-gray-100"><IconSearch className="w-5 h-5 text-gray-600" /></button>
            <button onClick={() => setIsMobileSearchOpen(true)} className="md:hidden bg-gray-50 p-2 rounded-full"><IconSearch className="w-5 h-5 text-gray-600" /></button>

            {/* Admin Link */}
            {isAdmin && (
              <Link href="/admin-section" className="hidden md:flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100">
                <LayoutDashboard className="w-3 h-3" /> Admin
              </Link>
            )}

            {/* Cart */}
            <button onClick={() => router.push("/cart")} className="relative flex items-center gap-1 hover:text-orange-500">
              <IconBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex justify-center items-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-70 transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <div className="flex justify-between items-center px-5 py-4 border-b bg-orange-50">
          <span className="font-bold text-xl text-orange-600">Menu</span>
          <button onClick={() => setIsOpen(false)}><IconX className="w-6 h-6 text-gray-600" /></button>
        </div>

        {/* Admin Link Mobile */}
        {isAdmin && (
          <div className="px-5 py-3 border-b">
            <Link href="/admin-section" className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 p-2 rounded-lg justify-center">
              <LayoutDashboard className="w-4 h-4" /> Go to Admin Panel
            </Link>
          </div>
        )}

        <ul className="px-5 py-4 space-y-4">
          {/* Dynamic Mobile Menus */}
          {menuItems.map((menu, idx) => (
            <li key={idx}>
              {menu.type === 'link' ? (
                <Link href={menu.href || "#"} className="block py-2 font-semibold text-gray-700">{menu.title}</Link>
              ) : (
                <>
                  <button onClick={() => setMobileSubMenuOpen(mobileSubMenuOpen === idx ? null : idx)} className="flex justify-between items-center w-full font-semibold text-gray-700 py-2">
                    {menu.title} <IconChevronDown className={`w-4 h-4 transition ${mobileSubMenuOpen === idx ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileSubMenuOpen === idx && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-4">
                      {menu.children?.map((cat: any, cIdx: number) => (
                        <div key={cIdx}>
                          {cat.type === 'link' ? (
                            <Link href={cat.href || "#"} className="font-bold text-orange-600 text-sm block mb-1">{cat.title}</Link>
                          ) : (
                            <>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-1">{cat.title}</p>
                              <ul className="space-y-2 pl-2">
                                {cat.items?.map((item: any, iIdx: number) => (
                                  <li key={iIdx}>
                                    <Link href={item.href || "#"} className="block text-sm text-gray-600 hover:text-orange-500">{item.title}</Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-65 md:hidden" />}
    </>
  );
};

export default Navbar;

// ----------------------------- INLINE ICONS -----------------------------
const IconSearch = ({ className = "" }: { className?: string }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" className={className} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const IconMenu = ({ className = "" }: { className?: string }) => (<svg fill="none" strokeWidth="2" stroke="currentColor" className={className} viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);
const IconX = ({ className = "" }: { className?: string }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" className={className} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const IconChevronDown = ({ className = "" }: { className?: string }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" className={className} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>);
const IconBag = ({ className = "" }: { className?: string }) => (<svg fill="none" strokeWidth="2" stroke="currentColor" className={className} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>);