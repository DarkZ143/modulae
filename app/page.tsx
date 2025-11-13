import React from 'react'
import TopOfferBar from './components/TopOfferBar'
import Navbar from './components/Navbar'
import HeroSlider from './components/HeroSlider'
import Explore from './components/Explore'
import Ad1 from './components/banner1'
import Ad2 from './components/banner2'
import LatestProducts from './components/LatestProduct'
import MarqueeAd from './components/banner3'
import HurryUp from './components/hurryup'
import Clients from './components/clients'
import BlogSection from './components/blog'
import Footer from './components/Footer'

const Home = () => {
  return (
    <div>
      <TopOfferBar />
      <Navbar />
      <HeroSlider />
      <Explore />
      <Ad1 />
      <Ad2 />
      <LatestProducts />
      <MarqueeAd />
      <HurryUp />
      <Clients />
      <BlogSection />
      <Footer />
      
    </div>
  )
}

export default Home
