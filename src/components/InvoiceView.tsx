import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { generatePDF } from '../utils/pdfGenerator';

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = useInvoiceStore((state) => state.getInvoice(id!));
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const handlePrint = async () => {
    if (invoiceRef.current) {
      try {
        await generatePDF(
          invoiceRef.current, 
          `invoice-${invoice.invoiceNumber}.pdf`
        );
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center no-print">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} /> Back to Invoices
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Printer size={20} /> Download PDF
        </button>
      </div>

      <div ref={invoiceRef} className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Modern Dental Clinic</h1>
            <p className="text-gray-600 mt-1">INTUC Jn, Nettoor, Maradu</p>
            <p className="text-gray-600">Ernakulam, Kerala 682040</p>
            <p className="text-gray-600">Phone: +91 8304842300</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600">{invoice.invoiceNumber}</h2>
            <p className="text-gray-600 mt-1">
              Date: {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
        </div>

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

        <div className="mb-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left py-3 px-4 text-blue-600">Treatment</th>
                <th className="text-right py-3 px-4 text-blue-600">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {invoice.treatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td className="py-3 px-4 text-gray-800">{treatment.name}</td>
                  <td className="text-right py-3 px-4 text-gray-800">₹{treatment.price}</td>
                </tr>
              ))}
              <tr className="font-bold bg-blue-50">
                <td className="py-3 px-4 text-blue-600">Total</td>
                <td className="text-right py-3 px-4 text-blue-600">₹{invoice.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center text-gray-600 text-sm mt-8 pt-8 border-t border-blue-100">
          <p className="font-medium text-blue-600">Thank you for choosing Modern Dental Clinic</p>
          <p className="mt-2">For any queries, please contact us at support@moderndental.com</p>
        </div>
      </div>
    </div>
  );
}