import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Safety Information</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cancellation Options</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">COVID-19 Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">For Property Owners</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community Forum</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partner with Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Booking</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guarantee</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guest Reviews</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Gift Cards</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">About</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Link href="#" aria-label="Facebook" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="text-gray-500 text-sm text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} StayDirectly. All rights reserved.</p>
              <div className="flex justify-center md:justify-end space-x-4 mt-2">
                <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                <Link href="#" className="hover:text-primary transition-colors">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
