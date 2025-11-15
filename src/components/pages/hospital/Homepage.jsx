import React from 'react';
import { Heart, Shield, Users, BarChart3, Clock, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';


const Homepage = () => {
  return (
    <>
      <Navbar />
      {/* Main content wrapper ensures content isn't hidden behind fixed navbar */}
      <main className="pt-20">
        {/* Hero Section */}
        <section id="home" className="relative bg-gray-50 min-h-screen flex items-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium">
                  <Shield className="h-4 w-4 mr-2" />
                  Digital Health Innovation
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  <span className="text-blue-600">NPVRS</span>: National Patient Vital Record System
                  <span className="block text-green-600">Transforming Nigeria's Primary Healthcare</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Instant access to vital health records across all PHCs and hospitals. Reducing emergency response time, preventing avoidable deaths, and strengthening national health data systems.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">70%</div>
                  <div className="text-sm text-gray-600">PHC Usage Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">6mo</div>
                  <div className="text-sm text-gray-600">Pilot Roadmap</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">System Access</div>
                </div>
              </div>
            </div>
            <div className="relative md:-mt-8 lg:-mt-12">
              <div className="bg-gray-100 rounded-md p-6 sm:p-8 max-w-md md:max-w-none mx-auto">
                <div className="bg-white rounded-md p-5 sm:p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Patient Profile</h3>
                        <p className="text-sm text-gray-600">Instant Health Access</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <div className="text-sm text-gray-600">Blood Pressure</div>
                        <div className="font-semibold text-blue-700">120/80</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-md">
                        <div className="text-sm text-gray-600">Heart Rate</div>
                        <div className="font-semibold text-green-700">72 BPM</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Allergies: None recorded</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Last visit: Lagos PHC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
  <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">The Critical Challenge</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nigeria's healthcare system faces urgent challenges that cost lives and resources daily
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-md flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Long Waiting Times</h3>
              <p className="text-gray-600">Emergency patients wait as vital signs and histories are re-captured at each facility</p>
            </div>
            
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fragmented Records</h3>
              <p className="text-gray-600">Patients move across facilities with no unified health background accessible</p>
            </div>
            
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-md flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Emergency Deaths</h3>
              <p className="text-gray-600">Lack of instant data leads to avoidable loss of life in maternal care and trauma</p>
            </div>
            
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-md flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Weak Reporting</h3>
              <p className="text-gray-600">PHC system struggles with timely, accurate data for planning and donor reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
  <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="text-blue-600">Our Solution:</span> PHC E-Health Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive digital health backbone that connects every PHC and hospital across Nigeria
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-md">
                <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Unified Vital Records</h3>
                <p className="text-gray-600">Every patient gets a portable digital health profile accessible in any participating PHC or hospital</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-md">
                <div className="w-12 h-12 bg-green-600 rounded-md flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Emergency-Ready</h3>
                <p className="text-gray-600">Doctors can view patient vitals, allergies, chronic conditions, and medication history instantly</p>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-blue-600 p-8 rounded-md text-white">
                <h3 className="text-2xl font-bold mb-4">Technical Excellence</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Interoperable Design</h4>
                    <p className="text-blue-100">Built with FHIR standards, ensuring future integration with DHIS2, NHIA, and donor systems</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cloud & Offline Support</h4>
                    <p className="text-blue-100">Works seamlessly in low-bandwidth, rural environments across Nigeria</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-md">
                <div className="w-12 h-12 bg-purple-600 rounded-md flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Generates real-time insights for PHC managers, states, and federal health authorities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
  <section className="py-16 sm:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the digital health revolution that's saving lives across Nigeria
          </p>

        </div>
      </section>
  {/* Footer */}
  <Footer />
    </main>
    </>
  );
};

export default Homepage;