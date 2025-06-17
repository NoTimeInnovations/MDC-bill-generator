import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { generatePDF } from '../utils/pdfGenerator';

export default function InvoiceView() {
  const { id } = useParams(); // Get the invoice ID from the URL
  const navigate = useNavigate(); // Navigation hook
  const invoice = useInvoiceStore((state) => state.getInvoice(id!)); // Fetch the invoice from the store
  const invoiceRef = useRef<HTMLDivElement>(null); // Reference to the invoice content for PDF generation
  const [isImageLoaded, setIsImageLoaded] = useState(false); // State to track if the image is loaded

  // Effect to handle image loading
  useEffect(() => {
    if (invoiceRef.current) {
      const img = invoiceRef.current.querySelector('img');
      if (img) {
        img.onload = () => setIsImageLoaded(true); // Set state to true when image is loaded
        img.onerror = () => console.error('Image failed to load'); // Log error if image fails to load
      }
    }
  }, []);

  // If the invoice is not found, display a message
  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  // Function to handle PDF generation
  const handlePrint = async () => {
    if (invoiceRef.current && isImageLoaded) {
      try {
        await generatePDF(
          invoiceRef.current,
          `invoice-${invoice.invoiceNumber}.pdf`
        );
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      }
    } else {
      console.error('Image not loaded or invoice reference not available');
    }
  };

  // Function to handle direct printing
  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            
            .invoice-content, .invoice-content * {
              visibility: visible;
            }
            
            .invoice-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            
            @page {
              margin: 0.5in;
              size: A4;
            }
          }
        `}
      </style>
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with back button and action buttons */}
        <div className="mb-6 flex justify-between items-center no-print print:hidden">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} /> Back to Invoices
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleDirectPrint}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Printer size={20} /> Print Invoice
            </button>
            <button
              onClick={handlePrint}
              disabled={!isImageLoaded}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Printer size={20} /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice content - optimized for single page */}
        <div ref={invoiceRef} className="invoice-content bg-white rounded-lg shadow-lg p-4 print:shadow-none print:p-0 print:rounded-none">
          {/* Clinic and invoice details */}
          <div className="flex justify-between items-start mb-4 print:mb-3">
            <div>
              <h1 className="text-2xl font-bold text-blue-600 print:text-xl">Modern Dental Clinic</h1>
              <p className="text-gray-600 mt-1 text-sm print:text-xs">INTUC Jn, Nettoor, Maradu</p>
              <p className="text-gray-600 text-sm print:text-xs">Ernakulam, Kerala 682040</p>
              <p className="text-gray-600 text-sm print:text-xs">Phone: +91 8304842300</p>
              <div className="mt-3 print:mt-2">
                <p className="text-gray-600 font-medium text-sm print:text-xs">Dr. Muhammed Roshan S R</p>
                <p className="text-gray-600 text-sm print:text-xs">BDS, FICOI (USA)</p>
                <p className="text-gray-600 text-sm print:text-xs">Registration No: 27128</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-blue-600 print:text-base">{invoice.invoiceNumber}</h2>
              <p className="text-gray-600 mt-1 text-sm print:text-xs">
                Date: {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Patient information */}
          <div className="border-t-2 border-b-2 border-blue-100 py-4 mb-4 print:py-2 print:mb-3">
            <h3 className="text-base font-semibold text-blue-600 mb-3 print:text-sm print:mb-2">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4 print:gap-2">
              <div>
                <p className="text-gray-600 text-sm print:text-xs">Name: <span className="font-medium text-gray-800">{invoice.patientName}</span></p>
                <p className="text-gray-600 text-sm print:text-xs">Age: <span className="font-medium text-gray-800">{invoice.age}</span></p>
              </div>
              <div>
                <p className="text-gray-600 text-sm print:text-xs">Phone: <span className="font-medium text-gray-800">{invoice.phoneNumber}</span></p>
                <p className="text-gray-600 text-sm print:text-xs">OP Number: <span className="font-medium text-gray-800">{invoice.opNumber}</span></p>
              </div>
            </div>
          </div>

          {/* Treatments table */}
          <div className="mb-4 print:mb-3">
            <table className="min-w-full text-sm print:text-xs">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-2 px-3 text-blue-600 print:py-1 print:px-2">Treatment</th>
                  <th className="text-right py-2 px-3 text-blue-600 print:py-1 print:px-2">Price</th>
                  <th className="text-right py-2 px-3 text-blue-600 print:py-1 print:px-2">Quantity</th>
                  <th className="text-right py-2 px-3 text-blue-600 print:py-1 print:px-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {invoice.treatments.map((treatment) => (
                  <tr key={treatment.id}>
                    <td className="py-2 px-3 text-gray-800 print:py-1 print:px-2">{treatment.name}</td>
                    <td className="text-right py-2 px-3 text-gray-800 print:py-1 print:px-2">₹{treatment.price.toFixed(2)}</td>
                    <td className="text-right py-2 px-3 text-gray-800 print:py-1 print:px-2">{treatment.quantity}</td>
                    <td className="text-right py-2 px-3 text-gray-800 print:py-1 print:px-2">₹{treatment.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-blue-50">
                  <td colSpan={3} className="py-2 px-3 text-blue-600 print:py-1 print:px-2">Grand Total</td>
                  <td className="text-right py-2 px-3 text-blue-600 print:py-1 print:px-2">₹{invoice.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer with signature */}
          <div className="mt-6 pt-4 border-t border-blue-100 flex justify-between items-end print:mt-4 print:pt-3">
            <div className="text-gray-600 text-sm print:text-xs">
              <p className="font-medium text-blue-600">Thank you for choosing Modern Dental Clinic</p>
              <p className="mt-2 print:mt-1">For any queries, please contact us at support@moderndental.com</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm print:text-xs">Date: {new Date(invoice.date).toLocaleDateString()}</p>
              <div className="mt-3 print:mt-2">
                <div className="h-16 w-40 mb-2 print:h-12 print:w-32 print:mb-1">
                  <img
                    src="/roshan_sign_transparent.png" // Image from the public folder
                    alt="Signature"
                    className="h-16 w-40 object-cover print:h-12 print:w-32"
                    onLoad={() => setIsImageLoaded(true)} // Set state to true when image is loaded
                    onError={() => console.error('Image failed to load')} // Log error if image fails to load
                  />
                </div>
                <p className="text-gray-600 text-sm print:text-xs">Dr. Muhammed Roshan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
