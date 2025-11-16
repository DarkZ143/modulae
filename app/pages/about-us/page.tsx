import React from 'react'
import TopOfferBar from '../../components/TopOfferBar'
import Navbar from '../../components/Navbar'
import CategoryHeader from '../../components/CategoryHeader'
import LatestProducts from '../../components/LatestProduct'
import MarqueeAd from '../../components/banner3'
import Footer from '../../components/Footer'
import AboutCompany from '@/app/components/AboutCompany'
import BlogSection from '@/app/components/blog'

const About = () => {
  return (
    <div>
      <TopOfferBar />
      <Navbar />
      <CategoryHeader title="About Us" />
      <AboutCompany />
      <LatestProducts />
      <MarqueeAd />
      <BlogSection />
      <Footer />

    </div>
  )
}

export default About
