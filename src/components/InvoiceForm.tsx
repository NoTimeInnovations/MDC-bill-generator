import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, FileDown } from 'lucide-react';
import { Treatment } from '../types';
import { useInvoiceStore } from '../store/useInvoiceStore';

export default function InvoiceForm() {
  const navigate = useNavigate();
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [opNumber, setOpNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    price: '',
    quantity: '1'
  });

  const handleAddTreatment = () => {
    if (newTreatment.name && newTreatment.price && newTreatment.quantity) {
      const price = parseFloat(newTreatment.price);
      const quantity = parseInt(newTreatment.quantity);
      const total = price * quantity;
      
      setTreatments([
        ...treatments,
        {
          id: crypto.randomUUID(),
          name: newTreatment.name,
          price,
          quantity,
          total
        },
      ]);
      setNewTreatment({ name: '', price: '', quantity: '1' });
    }
  };

  const handleRemoveTreatment = (id: string) => {
    setTreatments(treatments.filter((t) => t.id !== id));
  };

  const handleTreatmentChange = (id: string, field: string, value: string) => {
    setTreatments(treatments.map(t => {
      if (t.id === id) {
        const updatedTreatment = { ...t, [field]: parseFloat(value) };
        updatedTreatment.total = updatedTreatment.price * updatedTreatment.quantity;
        return updatedTreatment;
      }
      return t;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grandTotal = treatments.reduce((sum, t) => sum + t.total, 0);
    
    const invoice = addInvoice({
      patientName,
      age: parseInt(age),
      phoneNumber,
      opNumber,
      date,
      treatments,
      total: grandTotal,
    });

    navigate(`/invoice/${invoice.id}`);
  };

  const grandTotal = treatments.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Generate Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="px-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="px-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="px-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">OP Number</label>
            <input
              type="text"
              required
              value={opNumber}
              onChange={(e) => setOpNumber(e.target.value)}
              className="px-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Treatments</h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Treatment Name"
              value={newTreatment.name}
              onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
              className="px-1 flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newTreatment.price}
              onChange={(e) => setNewTreatment({ ...newTreatment, price: e.target.value })}
              className="px-1 w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Qty"
              value={newTreatment.quantity}
              onChange={(e) => setNewTreatment({ ...newTreatment, quantity: e.target.value })}
              className="px-1 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddTreatment}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} /> Add
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Treatment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
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
                {treatments.map((treatment) => (
                  <tr key={treatment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={treatment.name}
                        onChange={(e) => handleTreatmentChange(treatment.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={treatment.price}
                        onChange={(e) => handleTreatmentChange(treatment.id, 'price', e.target.value)}
                        className="w-24 px-2 py-1 border rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={treatment.quantity}
                        onChange={(e) => handleTreatmentChange(treatment.id, 'quantity', e.target.value)}
                        className="w-20 px-2 py-1 border rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{treatment.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRemoveTreatment(treatment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-right">
            <div className="text-lg font-semibold text-gray-800">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            <FileDown size={20} /> Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
