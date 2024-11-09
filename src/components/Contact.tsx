import React from 'react';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif">
            Contact Information
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Get in touch for research collaborations and academic inquiries
          </p>
        </div>
        <div className="mt-12 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:jane.smith@stanford.edu"
                      className="text-base text-gray-500 hover:text-blue-600"
                    >
                      jane.smith@stanford.edu
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-base text-gray-500">+1 (650) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Office</p>
                    <p className="text-base text-gray-500">
                      Gates Computer Science Building
                      <br />
                      353 Jane Stanford Way
                      <br />
                      Stanford, CA 94305
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <a
                      href="https://cs.stanford.edu/~jsmith"
                      className="text-base text-gray-500 hover:text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      cs.stanford.edu/~jsmith
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 md:h-auto">
              <iframe
                title="Office Location"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.2722083674007!2d-122.17338668469465!3d37.43030377982362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbb2a0200d71d%3A0x1d037d9c16034f8!2sGates%20Computer%20Science%2C%20353%20Jane%20Stanford%20Way%2C%20Stanford%2C%20CA%2094305!5e0!3m2!1sen!2sus!4v1625764821576!5m2!1sen!2sus"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}