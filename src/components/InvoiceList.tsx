import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useInvoiceStore } from '../store/useInvoiceStore';

export default function InvoiceList() {
  const navigate = useNavigate();
  const invoices = useInvoiceStore((state) => state.invoices);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Invoices</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">₹{invoice.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/invoice/${invoice.id}`)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-2"
                  >
                    <FileText size={20} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
