import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Plus, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Modern Dental Clinic
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                location.pathname === '/'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus size={20} /> New Invoice
            </Link>
            <Link
              to="/invoices"
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                location.pathname === '/invoices'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} /> All Invoices
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`${
          isOpen ? 'fixed' : 'hidden'
        } inset-0 bg-black bg-opacity-50 z-40 md:hidden`}
        onClick={toggleMenu}
      />

      {/* Mobile menu sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-bold text-gray-800">Menu</span>
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <Link
              to="/"
              onClick={toggleMenu}
              className={`flex items-center gap-2 px-4 py-2 rounded-md w-full ${
                location.pathname === '/'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus size={20} /> New Invoice
            </Link>
            <Link
              to="/invoices"
              onClick={toggleMenu}
              className={`flex items-center gap-2 px-4 py-2 rounded-md w-full ${
                location.pathname === '/invoices'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} /> All Invoices
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}