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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button and download PDF button */}
      <div className="mb-6 flex justify-between items-center no-print">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} /> Back to Invoices
        </button>
        <button
          onClick={handlePrint}
          disabled={!isImageLoaded}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Printer size={20} /> Download PDF
        </button>
      </div>

      {/* Invoice content */}
      <div ref={invoiceRef} className="bg-white rounded-lg shadow-lg p-8">
        {/* Clinic and invoice details */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Modern Dental Clinic</h1>
            <p className="text-gray-600 mt-1">INTUC Jn, Nettoor, Maradu</p>
            <p className="text-gray-600">Ernakulam, Kerala 682040</p>
            <p className="text-gray-600">Phone: +91 8304842300</p>
            <div className="mt-4">
              <p className="text-gray-600 font-medium">Dr. Muhammed Roshan S R</p>
              <p className="text-gray-600">BDS, FICOI (USA)</p>
              <p className="text-gray-600">Registration No: 27128</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600">{invoice.invoiceNumber}</h2>
            <p className="text-gray-600 mt-1">
              Date: {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Patient information */}
        <div className="border-t-2 border-b-2 border-blue-100 py-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name: <span className="font-medium text-gray-800">{invoice.patientName}</span></p>
              <p className="text-gray-600">Age: <span className="font-medium text-gray-800">{invoice.age}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Phone: <span className="font-medium text-gray-800">{invoice.phoneNumber}</span></p>
              <p className="text-gray-600">OP Number: <span className="font-medium text-gray-800">{invoice.opNumber}</span></p>
            </div>
          </div>
        </div>

        {/* Treatments table */}
        <div className="mb-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left py-3 px-4 text-blue-600">Treatment</th>
                <th className="text-right py-3 px-4 text-blue-600">Price</th>
                <th className="text-right py-3 px-4 text-blue-600">Quantity</th>
                <th className="text-right py-3 px-4 text-blue-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {invoice.treatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td className="py-3 px-4 text-gray-800">{treatment.name}</td>
                  <td className="text-right py-3 px-4 text-gray-800">₹{treatment.price.toFixed(2)}</td>
                  <td className="text-right py-3 px-4 text-gray-800">{treatment.quantity}</td>
                  <td className="text-right py-3 px-4 text-gray-800">₹{treatment.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold bg-blue-50">
                <td colSpan={3} className="py-3 px-4 text-blue-600">Grand Total</td>
                <td className="text-right py-3 px-4 text-blue-600">₹{invoice.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer with signature */}
        <div className="mt-8 pt-8 border-t border-blue-100 flex justify-between items-end">
          <div className="text-gray-600 text-sm">
            <p className="font-medium text-blue-600">Thank you for choosing Modern Dental Clinic</p>
            <p className="mt-2">For any queries, please contact us at support@moderndental.com</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Date: {new Date(invoice.date).toLocaleDateString()}</p>
            <div className="mt-4">
              <div className="h-20 w-48 mb-2">
                <img
                  src="/roshan_sign_transparent.png" // Image from the public folder
                  alt="Signature"
                  className="h-20 w-48 object-cover"
                  onLoad={() => setIsImageLoaded(true)} // Set state to true when image is loaded
                  onError={() => console.error('Image failed to load')} // Log error if image fails to load
                />
              </div>
              <p className="text-gray-600">Dr. Muhammed Roshan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
