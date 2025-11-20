"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TopOfferBar from "@/app/components/TopOfferBar";

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <TopOfferBar />
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-16">
          
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500">
              Last Updated: <span className="font-medium">{currentDate}</span>
            </p>
          </div>

          {/* Content Container */}
          <div className="bg-white shadow-sm rounded-xl p-8 md:p-12 border border-gray-100 space-y-10 text-gray-700 leading-relaxed">
            
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>Modulae</strong>. We value the trust you place in us. 
                This Privacy Policy describes how we collect, use, and disclose your personal 
                information when you visit our website or make a purchase. By using our services, 
                you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-4">
                When you visit Modulae, we collect certain information about your device, 
                your interaction with the site, and information necessary to process your purchases.
              </p>
              
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Personal Identification:</strong> Name, email address, phone number, 
                  shipping address, and billing address.
                </li>
                <li>
                  <strong>Payment Information:</strong> Credit card numbers or payment account details 
                  (processed securely by our third-party payment providers).
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, time zone settings, 
                  and device information.
                </li>
              </ul>
            </section>

            {/* 3. How We Use Your Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the collected data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To process and fulfill your orders, including sending order confirmations and invoices.</li>
                <li>To communicate with you regarding updates, offers, and customer support.</li>
                <li>To screen our orders for potential risk or fraud.</li>
                <li>To improve and optimize our website user experience (e.g., analytics).</li>
              </ul>
            </section>

            {/* 4. Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Cookies & Tracking
              </h2>
              <p>
                We use cookies to enhance your browsing experience. Cookies are small files stored on your 
                device that help us remember your preferences and shopping cart contents. You can choose 
                to disable cookies through your browser settings, though this may affect your ability to 
                use certain features of our site.
              </p>
            </section>

            {/* 5. Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your personal information. 
                All payment transactions are encrypted using Secure Socket Layer (SSL) technology. 
                However, no method of transmission over the Internet is 100% secure, so we cannot 
                guarantee absolute security.
              </p>
            </section>

            {/* 6. Sharing Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Third-Party Disclosure
              </h2>
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information 
                to outside parties. This does not include trusted third parties who assist us in 
                operating our website (e.g., shipping partners, payment gateways), so long as those 
                parties agree to keep this information confidential.
              </p>
            </section>

            {/* 7. Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Your Rights
              </h2>
              <p>
                Depending on your location, you may have the right to access the personal information 
                we hold about you, port it to a new service, or ask that your personal information 
                be corrected, updated, or erased. Please contact us if you wish to exercise these rights.
              </p>
            </section>

            {/* 8. Contact Us */}
            <section className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Have Questions?
              </h2>
              <p className="mb-4 text-sm">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="text-sm font-medium space-y-1">
                <li>Email: <a href="mailto:support@modulae.com" className="text-orange-600 hover:underline">support@modulae.com</a></li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Modulae HQ, Furniture City, India</li>
              </ul>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}