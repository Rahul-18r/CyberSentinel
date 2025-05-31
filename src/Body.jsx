import React from 'react';
import bgVideo from './assets/enhance.mp4';

const Body = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
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

      {/* Content Sections */}
      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white/0 backdrop-none rounded-xl shadow-xl p-8 m-4 w-[90%] text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Secure Your World,Effortlessly Today!.
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white max-w-4xl mx-auto">
              Protecting businesses and individuals with AI-powered security tools. 
              From deepfake detection to email protection, we've got you covered.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-[#00FF94] hover:bg-[#00CC75] px-6 py-3 rounded-lg text-black text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
             
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 m-4 max-w-4xl w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                Empowering Your Digital Security
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                We combine cutting-edge AI technology with practical solutions to address modern cybersecurity challenges.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/30 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#00FF94] mb-3">Our Mission</h3>
                <p className="text-white">
                  To provide accessible, powerful cybersecurity tools that protect individuals and organizations from emerging digital threats.
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#00FF94] mb-3">Our Approach</h3>
                <p className="text-white">
                  Leveraging advanced AI and machine learning to detect and prevent cyber threats before they become problems.
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#00FF94] mb-3">Technology</h3>
                <p className="text-white">
                  State-of-the-art deep learning models powering our suite of security tools, from deepfake detection to spam filtering.
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#00FF94] mb-3">Security First</h3>
                <p className="text-white">
                  Dedicated to maintaining the highest standards of security and privacy in all our solutions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Body;
