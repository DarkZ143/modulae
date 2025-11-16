import CategoryHeader from '@/app/components/CategoryHeader'
import FAQSection from '@/app/components/FAQSection'
import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import TopOfferBar from '@/app/components/TopOfferBar'
import React from 'react'

const FAQ = () => {
  return (
    <div>
      <TopOfferBar />
      <Navbar />
      <CategoryHeader title="Frequently Asked Questions" />
      <FAQSection />
      <Footer />
    </div>
  )
}

export default FAQ
