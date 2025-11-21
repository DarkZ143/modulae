"use client";


// Data for the footer links
const infoLinks1 = [
  { name: "About Us", href: "/pages/about-us" },
  { name: "Help & Advice", href: "/pages/help-and-advice" },
  { name: "Furniture Magazine", href: "/pages/furniture-magazine" },
  { name: "FR Collections", href: "/shop" },
  { name: "Purchase Protection", href: "/pages/purchase-protection" },
  { name: "Meet Experts", href: "/pages/meet-experts" },
];

const infoLinks2 = [
  { name: "Furniture Business", href: "/pages/furniture-business" },
  { name: "Contact Us", href: "/pages/contact-us" },
  { name: "Gift Vouchers", href: "/pages/gift-vouchers" },
  { name: "Gallery", href: "/pages/gallery" },
  { name: "Brands", href: "/pages/brands" },
  { name: "Help Topics", href: "/pages/faq" },
];

const subFooterLinks = [
  { name: "About Us", href: "/pages/about-us" },
  { name: "Services", href: "/pages/services" },
  { name: "Privacy", href: "/pages/privacy-policy" },
  { name: "Terms & Conditions", href: "/pages/terms" },
];

const Footer = () => {
  return (
    <footer
      className="text-gray-300 relative"
      style={{
        // A more subtle, professional gradient
        backgroundImage: "linear-gradient(to bottom, #222, #111)",
      }}
    >
      {/* --- Main Footer Section --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <IconHeadset className="w-12 h-12 text-orange-500" />
              <div>
                <p className="text-sm">Our Sales Team</p>
                <p className="text-xl font-bold text-white">
                  (+800) 1234 5678 90
                </p>
              </div>
            </div>
            <div className="text-sm space-y-3">
              <p>62 North Helen Street, Green Cove, FL 3204</p>
              <p>Phone: +123 456 7890</p>
              <p>Email: example@gmail.com</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-3">Follow Us:</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  <IconTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <IconFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <IconPinterest className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <IconInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Information (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6">
              Information
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <ul className="space-y-3">
                {infoLinks1.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {infoLinks2.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              Off your first order when you sign-up to our newsletter
            </h3>
            <form className="flex w-full">
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 bg-black/20 text-white px-4 py-3 rounded-l-md border border-white/20 focus:outline-none focus:border-white text-sm placeholder-gray-300"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-r-md text-sm hover:bg-orange-600 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            <div>
              <h4 className="font-semibold text-white mb-4">
                Payment methods
              </h4>
              <div className="flex items-center space-x-2">
                <IconDiscover />
                <IconVisa />
                <IconMastercard />
                <IconAmex />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Sub-Footer Section --- */}
      <div className="border-t border-white/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs text-gray-300 text-center md:text-left">
            © 2025, Modulae Designed by Bhardwaj Innovations
          </p>

          {/* Sub-links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {subFooterLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

        </div>
      </div>

     
    </footer>
  );
};

// --- Inline SVG Icons ---

const IconHeadset = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const IconTwitter = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const IconFacebook = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const IconPinterest = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.198-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.781c0-1.668.967-2.911 2.168-2.911 1.026 0 1.512.765 1.512 1.682 0 1.025-.653 2.557-.99 3.952-.282 1.194.599 2.168 1.777 2.168 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.493 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026" />
  </svg>
);

const IconInstagram = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
  </svg>
);



// Payment Icons (simple placeholders)
const IconDiscover = () => (
  <div className="h-8 w-12 bg-white rounded-md flex items-center justify-center">
    <span className="text-xs font-bold text-blue-900">DISC</span>
  </div>
);

const IconVisa = () => (
  <div className="h-8 w-12 bg-white rounded-md flex items-center justify-center">
    <span className="text-xs font-bold text-blue-700">VISA</span>
  </div>
);

const IconMastercard = () => (
  <div className="h-8 w-12 bg-white rounded-md flex items-center justify-center">
    <span className="text-xs font-bold text-red-600">MC</span>
  </div>
);

const IconAmex = () => (
  <div className="h-8 w-12 bg-white rounded-md flex items-center justify-center">
    <span className="text-xs font-bold text-blue-500">AMEX</span>
  </div>
);

export default Footer;