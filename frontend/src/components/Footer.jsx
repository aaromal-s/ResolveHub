import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-tealbrand-400 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Resolve<span className="text-brand-500">Hub</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            E-Governance portal for public grievances, accountability tracker, and civic development.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Citizen Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                New User Registration
              </Link>
            </li>
            <li>
              <Link to="/about-contact" className="hover:text-white transition-colors">
                About / Contacts
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Services */}
        <div>
          <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Categories</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>Water Supply & Utilities</li>
            <li>Electricity & Streetlights</li>
            <li>Sanitation & Garbage Disposal</li>
            <li>Road Potholes & Streets</li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div>
          <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Emergency Support</h4>
          <p className="text-sm leading-relaxed mb-2">
            National Citizen Grievance Cell
          </p>
          <p className="text-brand-400 font-bold text-base">Toll Free: 1800-111-222</p>
          <p className="text-xs text-slate-500 mt-2">Email: support@resolvehub.gov.in</p>
        </div>
      </div>

      {/* Baseline copy */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
        <span>© {new Date().getFullYear()} ResolveHub Portal. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            SLA Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

