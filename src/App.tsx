import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import InvoiceView from './components/InvoiceView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<InvoiceForm />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoice/:id" element={<InvoiceView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
