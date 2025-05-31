import React from 'react'
import bgVideo from './assets/enhance.mp4' // Add your background video
import contactImage from './assets/contact.jpg' // Add missing import
import Header from './Header'

const Contact = () => {
  return (

    <div className="relative min-h-screen m-10">
            <Header/>
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
          style={{
            position: 'fixed',
            right: 0,
            bottom: 0,
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Contact Form Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                Have questions about our security solutions? We're here to help!
              </p>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF94] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF94] focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF94] focus:border-transparent"
                    placeholder="Your message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00FF94] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#00CC75] transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Image and Contact Info Section */}
            <div className="space-y-8">
              <div className="rounded-xl overflow-hidden shadow-xl">
                {contactImage ? (
                  <img
                    src={contactImage}
                    alt="Contact Us"
                    className="w-full h-[300px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">Contact Image</span>
                  </div>
                )}
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-[#00FF94] mb-4">Contact Information</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-[#00FF94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    123 Security Street, Cyber City, 12345
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-[#00FF94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    contact@securityai.com
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-[#00FF94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    (123) 456-7890
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
