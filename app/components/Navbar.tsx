"use client";
import { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
// Removed imports for react-icons and next/navigation to fix build errors

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(
    null
  ); // State for mobile submenus
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // State for mobile search

  // Updated menuItems based on the provided images
  const menuItems = [
    {
      title: "Living",
      categories: {
        "Sofa and Recliner": [
          "All Sofa Sets",
          "Recliners",
          "Plus Sofas",
          "Leatherette Sofas",
          "Single Seater Sofa",
          "3 Seater Sofas",
          "L Shape Sofas",
          "Sofa Cum Beds",
          "Cushion & Cushion Cover",
        ],
        "Chairs And Seating": [
          "All Chairs",
          "Office Chairs",
          "Lounge Chairs",
          "Wing Chairs",
          "Gaming Chairs",
          "Bean Bags",
          "Ottomans",
        ],
        "TV Units": [
          "All TV Units",
          "Engineered Wood TV Units",
          "Solid Wood TV Units",
        ],
        "Living Room Storage": [
          "All Book Shelves",
          "Wall Shelf",
          "All Shoe Racks",
          "Sideboards",
          "Chest of Drawers",
          "Display Units",
        ],
        Tables: [
          "All Coffee Tables",
          "Premium Coffee Tables",
          "Solid Wood Coffee Tables",
          "Center Tables",
          "Side Tables",
          "Computer Tables",
        ],
        "Wall Decor & Curtain": [
          "Wall Arts",
          "Wall Clocks",
          "Paintings",
          "Wall Mirrors",
          "Curtains",
        ],
        "Lamp And Other Decors": [
          "Hanging Pendants",
          "Table Lamps",
          "Study Lamps",
          "Planters",
          "Table Accents",
        ],
      },
    },
    {
      title: "Dining",
      categories: {
        "Dining Furnitures": [
          "Dining Sets",
          "4 Seater Dining Sets",
          "6 Seater Dining Sets",
          "Metal & Glass Dining Sets",
          "Dining Table",
          "Dining Chairs",
          "Luxury Dining",
        ],
        "Dining Decors": ["Hanging Pendants", "Curtains"],
        Dinnerware: [
          "Dinner Plates",
          "Quarter Plates",
          "Bowls",
          "Dinner Sets",
          "Serving Bowls",
        ],
        Serveware: ["Serving Bowls", "Casseroles"],
        Cookware: [
          "Kadhai & Woks",
          "Pans & Skillets",
          "Tawas",
          "Cookware Sets",
        ],
        "Dining Storages": ["Sideboards", "Chest of Drawers", "Wall Shelf"],
      },
    },
    {
      title: "Bedroom",
      categories: {
        Beds: [
          "All Beds",
          "Solid Wood Beds",
          "Engineered Wood Beds",
          "Sheesham Wood Beds",
          "Metal Beds",
          "Upholstered Beds",
          "Hydraulic Beds",
          "Kids Bed",
        ],
        Beddings: [
          "Mattress Protectors",
          "Fitted Bedsheets",
          "Flat Bedsheets",
          "Comforters",
          "Blankets",
          "Pillow Covers",
          "Duvet Covers",
          "All Bedsheets",
        ],
        "Pillows and Cushions": [
          "Sleeping Pillows",
          "Support Pillows",
          "Maternity and Baby Pillows",
          "Cushion & Cushion Cover",
          "Car Cushions",
          "Memory Foam Pillows",
        ],
        Wardrobes: [
          "All Wardrobes",
          "Luxury Wardrobes",
          "Engineered Wood Wardrobes",
          "Solid Wood Wardrobes",
          "2 Door Wardrobes",
          "3 Door Wardrobes",
        ],
        "Bedroom Tables": [
          "Bedside Tables",
          "Premium Bedside Tables",
          "Dressing Tables",
          "Computer Tables",
        ],
        "Decor and Curtain": [
          "Curtains",
          "Hanging Pendants",
          "Wall Clocks",
          "Wall Arts",
          "Table Lamps",
          "Wall Mirrors",
        ],
        Balcony: ["Deck Tiles", "Artificial Grass"],
      },
    },
    {
      title: "Kitchen",
      categories: {
        Dinnerware: [
          "Dinner Plates",
          "Quarter Plates",
          "Bowls",
          "Dinner Sets",
          "Serving Bowls",
        ],
        Serveware: ["Serving Bowls", "Casseroles"],
        "Cups And Mugs": ["Cups & Saucers", "Mugs & Kullhads"],
        Cookware: [
          "Kadhai & Woks",
          "Pans and Skillets",
          "Tawas",
          "Casserole",
          "Cookware Sets",
        ],
        "Table Linens": ["Placemats & Chargers"],
        Drinkware: ["Bottles & Flasks", "Cups & Saucers", "Tumblers"],
        "Kitchen Storage": ["Glass Container", "Storage Basket"],
      },
    },
    {
      title: "Pages",
      categories: {
        Company: ["About Us", "Contact Us", "FAQ", "Login/Register"],
      },
    },
  ];

  const shopCategories = ["Table", "Chair", "Furniture", "Sofa Set", "Other"];

  // Refs for click-outside-to-close functionality
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const mainMenusRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside of the dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close category dropdown
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
      // Close main dropdowns
      if (
        mainMenusRef.current &&
        !mainMenusRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this runs only once

  // Toggles for main menu items
  const handleMenuToggle = (title: string) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
    setCategoryOpen(false); // Close other dropdown
  };

  // Toggle for category menu
  const handleCategoryToggle = () => {
    setCategoryOpen((prev) => !prev);
    setActiveDropdown(null); // Close other dropdown
  };
  // Removed useRouter hook

  // Helper function to get grid classes for dropdowns
  const getDropdownClasses = (menu: (typeof menuItems)[0]) => {
    const numCategories = Object.keys(menu.categories).length;
    let gridClass = "grid-cols-3";
    let widthClass = "min-w-[700px]";

    if (numCategories >= 7) {
      gridClass = "grid-cols-4";
      widthClass = "min-w-[900px]";
    } else if (numCategories >= 5) {
      gridClass = "grid-cols-3";
      widthClass = "min-w-[700px]";
    } else if (numCategories === 4) {
      gridClass = "grid-cols-4";
      widthClass = "min-w-[800px]";
    } else if (numCategories < 3) {
      gridClass = "grid-cols-1";
      widthClass = "min-w-[200px]";
    }

    return `grid ${gridClass} ${widthClass}`;
  };

  return (
    <>
      {/* Mobile Search Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white p-4 border-b border-gray-200 shadow-md z-[60] transform transition-transform duration-300 ease-in-out ${
          isMobileSearchOpen ? "translate-y-0" : "-translate-y-full"
        } md:hidden`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <form className="flex-1 flex w-full border border-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 px-4 py-2 text-sm outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600"
            >
              <IconSearch className="w-5 h-5" />
            </button>
          </form>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-gray-600"
            aria-label="Close search"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex justify-between items-center">
          {/* Left: Logo + Mobile Icon */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="md:hidden text-2xl text-gray-700"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <IconX className="w-6 h-6" />
              ) : (
                <IconMenu className="w-6 h-6" />
              )}
            </button>
            <a
              href="/"
              className="flex items-center cursor-pointer"
              aria-label="Homepage"
            >
              <span className="text-5xl font-bold text-orange-500">M</span>
              <span className="text-3xl font-semibold text-black">odulae</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div
            className="hidden md:flex items-center gap-8 relative"
            ref={mainMenusRef}
          >
            {/* Shop By Category Button */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={handleCategoryToggle} // Changed to onClick
                className="bg-gray-100 font-semibold border-none px-4 py-2 rounded-md flex items-center gap-2  hover:bg-gray-100"
              >
                Shop By Category <IconMenu className="w-5 h-5" />
              </button>

              {/* Category Dropdown */}
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border-none rounded-md shadow-lg w-48 py-2 z-50">
                  {shopCategories.map((cat) => (
                    <div
                      key={cat}
                      className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main Menus */}
            {menuItems.map((menu) => (
              <div
                key={menu.title}
                className={menu.title === "Pages" ? "relative group" : "group"} // Make "Pages" relative
              >
                <button
                  onClick={() => handleMenuToggle(menu.title)} // Changed to onClick
                  className="flex items-center gap-1 text-sm pl-4  text-black font-semibold hover:text-orange-500"
                >
                  {menu.title}{" "}
                  <IconChevronDown className="w-3.5 h-3.5" />
                </button>

                {activeDropdown === menu.title && (
                  <div
                    className={`absolute top-full border-none ${
                      menu.title === "Pages"
                        ? "left-0" // Align to button for "Pages"
                        : "left-1/2 -translate-x-1/2" // Center for others
                    } bg-white shadow-lg border mt-2 p-6 rounded-md gap-6 z-50 ${getDropdownClasses(
                      menu
                    )}`}
                  >
                    {Object.entries(menu.categories).map(
                      ([category, subcats]) => (
                        <div key={category}>
                          <h4 className="font-semibold text-gray-800 mb-2 truncate">
                            {category}
                          </h4>
                          <ul className="space-y-1">
                            {subcats.map((sub: string) => (
                              <li
                                key={sub}
                                className="text-sm text-gray-600 hover:text-orange-500 cursor-pointer truncate"
                              >
                                {sub}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            {/* Desktop Search Button */}
            <button className="hidden md:block relative bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
              <IconSearch className="text-2xl text-black hover:text-orange-500 w-6 h-6" />
            </button>
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden relative bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
            >
              <IconSearch className="text-2xl text-black hover:text-orange-500 w-6 h-6" />
            </button>

            {/* Bag Button */}
            <button className="relative flex items-center gap-1">
              <p className="hidden md:block">My Bag</p>
              <IconBag className="text-xl text-black w-5 h-5" />
              {/* Mobile Badge */}
              <span className="md:hidden absolute -top-1 -right-2 w-4 h-4 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
              {/* Desktop Count */}
              <span className="hidden md:block text-sm text-black">(0)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* === Mobile Drawer === */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <a
            href="/"
            className="flex items-center gap-1"
            aria-label="Homepage"
          >
            <span className="text-3xl font-bold text-orange-500">M</span>
            <span className="text-xl font-semibold text-black">odulae</span>
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl text-gray-700"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* --- Mobile Menu Content --- */}
        <ul className="flex flex-col px-5 py-6">
          {menuItems.map((menu) => (
            <li key={menu.title} className="border-b border-gray-100 py-3">
              <button
                onClick={() =>
                  setMobileSubMenuOpen((prev) =>
                    prev === menu.title ? null : menu.title
                  )
                }
                className="flex justify-between items-center w-full text-lg text-gray-800 font-medium hover:text-orange-500"
                aria-expanded={mobileSubMenuOpen === menu.title}
              >
                <span>{menu.title}</span>
                <IconChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    mobileSubMenuOpen === menu.title ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile Submenu with transition */}
              <div
                className={`pl-4 mt-4 space-y-4 transition-all duration-500 ease-in-out overflow-hidden ${
                  mobileSubMenuOpen === menu.title
                    ? "max-h-[1000px]" // Large value to allow content to show
                    : "max-h-0"
                }`}
              >
                {Object.entries(menu.categories).map(
                  ([category, subcats]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-gray-700 text-base mb-2">
                        {category}
                      </h4>
                      <ul className="space-y-2">
                        {subcats.map((sub: string) => (
                          <li
                            key={sub}
                            className="text-sm text-gray-600 hover:text-orange-500 cursor-pointer"
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Overlay --- */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Navbar;

// --- Inline SVG Icon Components ---

const IconSearch = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconMenu = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconX = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconChevronDown = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconChevronRight = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconBag = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);