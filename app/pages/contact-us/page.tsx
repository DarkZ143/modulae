import CategoryHeader from '@/app/components/CategoryHeader'
import ContactUs from '@/app/components/ContactUs'
import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'

import React from 'react'

const Contact = () => {
    return (
        <div>

            <Navbar />
            <CategoryHeader title="Contact Us" />
            <ContactUs />
            <Footer />


        </div>
    )
}

export default Contact
