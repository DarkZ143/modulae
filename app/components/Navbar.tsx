/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// ⭐ CART SYSTEM IMPORTS
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";





// ---------------- SLUG + STATIC PAGES ----------------
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");

// --- TYPE DEFINITION ---
type MenuItem = {
  title: string;
  categories: Record<string, string[]>;
};

const staticPages: Record<string, string> = {
  "About Us": "/pages/about-us",
  "Contact Us": "/pages/contact-us",
  FAQ: "/pages/faq",
};

// -----------------------------------------------------

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(
    null
  );
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // --- State for Desktop Search ---
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  // ⭐ CART COUNT STATE
  const [cartCount, setCartCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // ---------------- MENU ITEMS ----------------
  const menuItems: MenuItem[] = [
    {
      title: "Living",
      categories: {
        Sofas: [
          "All Sofa Sets",
          "L Shape Sofas",
          "3 Seater Sofas",
          "2 Seater Sofas",
          "Single Seater Sofas",
          "Recliners",
          "Sofa Cum Beds",
        ],
        Seating: [
          "Lounge Chairs",
          "Accent Chairs",
          "Ottomans",
          "Benches",
        ],
        "TV Units": [
          "Wooden TV Units",
          "Engineered Wood TV Units",
          "Solid Wood TV Units",
        ],
        Storage: [
          "Bookshelves",
          "Display Units",
          "Shoe Racks",
          "Sideboards",
          "Chest of Drawers",
        ],
        Tables: [
          "Center Tables",
          "Coffee Tables",
          "Side Tables",
          "Console Tables",
        ],
      },
    },
    {
      title: "Dining",
      categories: {
        "Dining Furniture": [
          "4 Seater Dining Sets",
          "6 Seater Dining Sets",
          "Dining Tables",
          "Dining Chairs",
          "Benches",
        ],
        Storage: [
          "Sideboards",
          "Crockery Units",
        ],
        Surfaces: [
          "Dining Table Marble Tops",
          "Granite Tops",
          "Wooden Tops",
        ],
      },
    },
    {
      title: "Bedroom",
      categories: {
        Beds: [
          "King Size Beds",
          "Queen Size Beds",
          "Hydraulic Beds",
          "Storage Beds",
          "Solid Wood Beds",
        ],
        Wardrobes: [
          "2 Door Wardrobes",
          "3 Door Wardrobes",
          "Sliding Door Wardrobes",
          "Solid Wood Wardrobes",
        ],
        Tables: [
          "Bedside Tables",
          "Dressing Tables",
          "Study Tables",
        ],
        Storage: [
          "Chest of Drawers",
        ],
        Flooring: [
          "Bedroom Floor Tiles",
          "Wooden Flooring",
        ]
      },
    },
    {
      title: "Kitchen",
      categories: {
        Furniture: [
          "Modular Cabinets",
          "Base Cabinets",
          "Wall Cabinets",
        ],
        Slabs: [
          "Granite Slabs",
          "Marble Slabs",
          "Quartz Slabs",
        ],
        Tiles: [
          "Kitchen Wall Tiles",
          "Kitchen Floor Tiles",
          "Anti-Skid Tiles",
        ],
        Storage: [
          "Pantry Units",
          "Open Shelves",
        ],
      },
    },

    {
      title: "Pages",
      categories: {
        Company: ["About Us", "Contact Us", "FAQ"],
      },
    },
  ];

  const shopCategories = ["Table", "Chair", "Furniture", "Sofa Set", "Other"];

  // ---------------- CLICK OUTSIDE HANDLER ----------------
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const mainMenusRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null); // Ref for the new bar

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
      if (
        mainMenusRef.current &&
        !mainMenusRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      // --- MODIFIED THIS BLOCK ---
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setIsDesktopSearchOpen(false); // Close the new desktop bar
        setSearchQuery("");
      }
      // --------------------------
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // ⭐ LISTEN FOR CART CHANGES (Firebase)
  useEffect(() => {
    let unsubCart: any = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCartCount(0);
        return;
      }

      const cartRef = ref(rtdb, `carts/${user.uid}`);

      unsubCart = onValue(cartRef, (snapshot) => {
        if (!snapshot.exists()) {
          setCartCount(0);
          return;
        }

        const cartData: any = snapshot.val();
        let totalQty = 0;

        Object.values(cartData).forEach((item: any) => {
          totalQty += item.qty;
        });

        setCartCount(totalQty);
      });
    });

    return () => {
      if (unsubCart) unsubCart();
      unsubAuth();
    };
  }, []);


  const handleMenuToggle = (title: string) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
    setCategoryOpen(false);
  };

  const handleCategoryToggle = () => {
    setCategoryOpen((prev) => !prev);
    setActiveDropdown(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
      setSearchQuery("");
      setIsDesktopSearchOpen(false); // Close it after search
    }
  };

  const getDropdownClasses = (menu: (typeof menuItems)[0]) => {
    const count = Object.keys(menu.categories).length;
    if (count >= 7) return "grid grid-cols-4 min-w-[900px]";
    if (count >= 5) return "grid grid-cols-3 min-w-[700px]";
    if (count === 4) return "grid grid-cols-4 min-w-[800px]";
    if (count < 3) return "grid grid-cols-1 min-w-[200px]";
    return "grid grid-cols-3 min-w-[700px]";
  };

  // ------------------ UI -----------------------
  return (
    <>
      {/* --- NEW DESKTOP SEARCH BAR --- */}
      <div
        ref={desktopSearchRef} // <-- MOVED REF HERE
        className={`fixed top-0 left-0 right-0 bg-white p-4 border border-orange-400 shadow-md z-60 transition-transform duration-300 hidden md:flex ${isDesktopSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 w-full">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 border border-gray-600 rounded-md overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm outline-none border-gray-700"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsDesktopSearchOpen(false);
                  setSearchQuery("");
                }
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white"
            >
              <IconSearch className="w-5 h-5" />
            </button>
          </form>
          <button
            onClick={() => {
              setIsDesktopSearchOpen(false);
              setSearchQuery("");
            }}
            className="p-2 text-gray-600"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white p-4 border-b shadow-md z-60 transition-transform duration-300 md:hidden ${isMobileSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <form className="flex flex-1 border rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm outline-none"
              autoFocus
            />
            <button className="px-4 py-2 bg-orange-500 text-white">
              <IconSearch className="w-5 h-5" />
            </button>
          </form>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-gray-600"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex justify-between items-center">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="md:hidden text-2xl text-gray-700"
            >
              {isOpen ? (
                <IconX className="w-6 h-6" />
              ) : (
                <IconMenu className="w-6 h-6" />
              )}
            </button>

            <a href="/" className="flex items-center">
              <span className="text-5xl font-bold text-orange-500">M</span>
              <span className="text-3xl font-semibold">odulae</span>
            </a>
          </div>

          {/* DESKTOP MENU */}
          <div
            className="hidden md:flex items-center gap-8 relative"
            ref={mainMenusRef}
          >
            {/* SHOP BY CATEGORY */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={handleCategoryToggle}
                className="bg-gray-100 font-semibold px-4 py-2 rounded-md flex items-center gap-2"
              >
                Shop By Category <IconMenu className="w-5 h-5" />
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md w-48 py-2 z-50">
                  {shopCategories.map((cat) => (
                    <a
                      key={cat}
                      href={`/collections/${slugify(cat)}?page=1`}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* MAIN NAV MENUS */}
            {menuItems.map((menu) => (
              <div key={menu.title} className="relative group">
                <button
                  onClick={() => handleMenuToggle(menu.title)}
                  className="flex items-center gap-1 text-sm font-semibold hover:text-orange-500"
                >
                  {menu.title}
                  <IconChevronDown className="w-4 h-4" />
                </button>

                {activeDropdown === menu.title && (
                  <div
                    className={
                      menu.title === "Pages"
                        ? // PAGES DROPDOWN LEFT-ALIGNED
                        `absolute top-full left-0 bg-white shadow-xl mt-4 p-6 rounded-xl z-50 grid grid-cols-1 min-w-[250px]`
                        : // PRODUCT DROPDOWN CENTER-ALIGNED
                        `absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl mt-4 p-6 rounded-xl z-50 ${getDropdownClasses(
                          menu
                        )}`
                    }
                  >
                    {Object.entries(menu.categories).map(
                      ([category, subcats]) => (
                        <div key={category}>
                          <h4 className="font-semibold mb-2">{category}</h4>
                          <ul className="space-y-1">
                            {subcats.map((sub) => {
                              // PAGES
                              if (menu.title === "Pages")
                                return (
                                  <a
                                    key={sub}
                                    href={staticPages[sub] ?? "#"}
                                    className="block text-sm text-gray-600 hover:text-orange-500 truncate"
                                  >
                                    {sub}
                                  </a>
                                );

                              // PRODUCT LINKS
                              const url = `/collections/${slugify(
                                menu.title
                              )}/${slugify(category)}/${slugify(
                                sub
                              )}?page=1`;

                              return (
                                <a
                                  key={sub}
                                  href={url}
                                  className="block text-sm text-gray-600 hover:text-orange-500 truncate"
                                >
                                  {sub}
                                </a>
                              );
                            })}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* PROFILE LINK */}
            <a
              href="/profile"
              className="text-sm font-semibold hover:text-orange-500"
            >
              Profile
            </a>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-5">
            {/* --- SIMPLIFIED DESKTOP SEARCH ICON --- */}
            <div className="hidden md:block">
              <button
                onClick={() => setIsDesktopSearchOpen(true)}
                className="bg-gray-50 p-2 rounded-full"
              >
                <IconSearch className="w-6 h-6" />
              </button>
            </div>
            {/* ------------------------------- */}

            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden bg-gray-50 p-2 rounded-full"
            >
              <IconSearch className="w-6 h-6" />
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="relative flex items-center gap-1"
            >
              <p className="hidden md:block cursor-pointer">My Bag</p>
              <IconBag className="w-5 h-5" />

              {/* DESKTOP COUNT */}
              <span className="hidden md:block text-sm">({cartCount})</span>

              {/* MOBILE COUNT */}
              <span className="md:hidden absolute -top-1 -right-2 w-4 h-4 bg-orange-500 text-white text-xs font-bold rounded-full flex justify-center">
                {cartCount}
              </span>
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <a href="/" className="flex items-center gap-1">
            <span className="text-3xl font-bold text-orange-500">M</span>
            <span className="text-xl font-semibold">odulae</span>
          </a>

          <button onClick={() => setIsOpen(false)}>
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* Profile link for mobile */}
        <ul className="px-5 py-4">
          <li className="border-b pb-3">
            <a
              href="/profile"
              className="text-lg font-medium hover:text-orange-500"
            >
              Profile
            </a>
          </li>
        </ul>

        {/* MOBILE MENU CONTENT */}
        <ul className="flex flex-col px-5 py-2">
          {menuItems.map((menu) => (
            <li key={menu.title} className="border-b py-3">
              <button
                onClick={() =>
                  setMobileSubMenuOpen((prev) =>
                    prev === menu.title ? null : menu.title
                  )
                }
                className="flex justify-between items-center w-full text-lg font-medium"
              >
                {menu.title}
                <IconChevronDown
                  className={`w-5 h-5 transition-transform ${mobileSubMenuOpen === menu.title ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`pl-4 mt-4 space-y-4 transition-all duration-500 overflow-hidden ${mobileSubMenuOpen === menu.title
                  ? "max-h-[900px]"
                  : "max-h-0"
                  }`}
              >
                {Object.entries(menu.categories).map(
                  ([category, subcats]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-base mb-2">
                        {category}
                      </h4>

                      <ul className="space-y-2">
                        {subcats.map((sub) => {
                          if (menu.title === "Pages")
                            return (
                              <a
                                key={sub}
                                href={staticPages[sub] ?? "#"}
                                className="block text-sm text-gray-600"
                              >
                                {sub}
                              </a>
                            );

                          const url = `/collections/${slugify(
                            menu.title
                          )}/${slugify(category)}/${slugify(sub)}?page=1`;

                          return (
                            <a
                              key={sub}
                              href={url}
                              className="block text-sm text-gray-600"
                            >
                              {sub}
                            </a>
                          );
                        })}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;

// ----------------------------- ICONS -----------------------------
// (Your icons remain the same)

const IconSearch = ({ className = "" }: { className?: string }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMenu = ({ className = "" }: { className?: string }) => (
  <svg
    fill="none"
    strokeWidth="2"
    stroke="currentColor"
    className={className}
    viewBox="0 0 24 24"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = ({ className = "" }: { className?: string }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    viewBox="0 0 24 24"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChevronDown = ({ className = "" }: { className?: string }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    viewBox="0 0 24 24"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconBag = ({ className = "" }: { className?: string }) => (
  <svg
    fill="none"
    strokeWidth="2"
    stroke="currentColor"
    className={className}
    viewBox="0 0 24 24"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);