import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Settings, DollarSign, User, Calendar, Edit, CheckCircle, AlertCircle, Plus, X, ChevronDown, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { Client, Payment } from '../../types/types'; // Import the types

export default function PaymentsManagement() {
  // States for client and payment lists
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<(Payment & { clients?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // States for payment configuration
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [paymentConfig, setPaymentConfig] = useState({
    totalAmount: 1500,
    installments: 3,
    currency: 'PLN'
  });

  // States for payment editing
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<(Payment & { client_name?: string }) | null>(null);
  
  // Load clients and payments
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');
      
      if (clientsError) {
        console.error('Error loading clients:', clientsError);
      } else {
        setClients(clientsData || []);
      }
      
      // Fetch payments with client names
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          clients (full_name)
        `);
      
      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
      } else {
        setPayments(paymentsData || []);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);
  
  // Filter payments by search term and status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clients?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          payment.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Function to create new payments for a client
  const handleCreatePayments = async () => {
    if (!selectedClient) return;
    
    try {
      // Calculate installment amount
      const installmentAmount = Math.floor(paymentConfig.totalAmount / paymentConfig.installments);
      const remainder = paymentConfig.totalAmount % paymentConfig.installments;
      
      // Create array of payments to insert
      const paymentsToInsert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>[] = [];
      
      for (let i = 0; i < paymentConfig.installments; i++) {
        // The last payment receives the remainder to avoid rounding issues
        const amount = i === paymentConfig.installments - 1 
          ? installmentAmount + remainder 
          : installmentAmount;
        
        // Calculate due date (one month apart)
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i + 1);
        
        paymentsToInsert.push({
          client_id: selectedClient.id,
          reference_number: `PAY-${selectedClient.id.substring(0, 4)}-${i + 1}`,
          amount,
          due_date: dueDate.toISOString().split('T')[0],
          installment_number: i + 1,
          total_installments: paymentConfig.installments,
          status: 'Pendiente'
        });
      }
      
      // Insert payments into database
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentsToInsert)
        .select();
      
      if (error) throw error;
      
      // Update local state
      setPayments([...payments, ...data]);
      setIsConfiguring(false);
      
      alert('Payments created successfully');
    } catch (error) {
      console.error('Error creating payments:', error);
      alert('Error creating payments');
    }
  };
  
  // Function to update a payment
  const handleUpdatePayment = async () => {
    if (!editingPayment) return;
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          amount: editingPayment.amount,
          payment_date: editingPayment.payment_date,
          status: editingPayment.status,
          notes: editingPayment.notes
        })
        .eq('id', editingPayment.id)
        .select();
      
      if (error) throw error;
      
      // Update local state
      setPayments(payments.map(p => 
        p.id === editingPayment.id ? {...p, ...data[0]} : p
      ));
      
      setIsEditingPayment(false);
      setEditingPayment(null);
      
      alert('Payment updated successfully');
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Error updating payment');
    }
  };
  
  // Format date for UI display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Payment Management</h1>
        <button
          onClick={() => setIsConfiguring(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Assign Payments to Client
        </button>
      </div>

      {/* Payment Configuration Modal */}
      {isConfiguring && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Assign Payments to Client</h3>
              <button onClick={() => setIsConfiguring(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Client selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                <select 
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedClient?.id || ''}
                  onChange={(e) => {
                    const client = clients.find(c => c.id === e.target.value);
                    setSelectedClient(client || null);
                  }}
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Total amount configuration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={paymentConfig.totalAmount}
                    onChange={(e) => setPaymentConfig({...paymentConfig, totalAmount: Number(e.target.value)})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{paymentConfig.currency}</span>
                  </div>
                </div>
              </div>
              
              {/* Installments configuration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Installments</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={paymentConfig.installments}
                  onChange={(e) => setPaymentConfig({...paymentConfig, installments: Number(e.target.value)})}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsConfiguring(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePayments}
                  disabled={!selectedClient}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    selectedClient ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
                  }`}
                >
                  Create Payments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Editing Modal */}
      {isEditingPayment && editingPayment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Payment</h3>
              <button onClick={() => {
                setIsEditingPayment(false);
                setEditingPayment(null);
              }} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Client: <span className="font-medium text-gray-700">{editingPayment.client_name}</span></p>
                <p className="text-sm text-gray-500">Reference: <span className="font-medium text-gray-700">{editingPayment.reference_number}</span></p>
                <p className="text-sm text-gray-500">Installment: <span className="font-medium text-gray-700">{editingPayment.installment_number} of {editingPayment.total_installments}</span></p>
              </div>
              
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={editingPayment.amount}
                    onChange={(e) => setEditingPayment({...editingPayment, amount: Number(e.target.value)})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">PLN</span>
                  </div>
                </div>
              </div>
              
              {/* Payment date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={editingPayment.payment_date || ''}
                  onChange={(e) => setEditingPayment({...editingPayment, payment_date: e.target.value})}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingPayment.status}
                  onChange={(e) => setEditingPayment({...editingPayment, status: e.target.value as Payment['status']})}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="Pendiente">Pending</option>
                  <option value="Pagado">Paid</option>
                  <option value="Vencido">Overdue</option>
                </select>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={editingPayment.notes || ''}
                  onChange={(e) => setEditingPayment({...editingPayment, notes: e.target.value})}
                  rows={3}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsEditingPayment(false);
                    setEditingPayment(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Panel */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <CreditCard className="h-6 w-6 mr-2" />
              <h3 className="font-medium text-lg">Total to Collect</h3>
            </div>
            <p className="text-3xl font-bold">
              {payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()} PLN
            </p>
            <p className="text-sm opacity-80 mt-2">From {payments.length} scheduled payments</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-6 w-6 mr-2" />
              <h3 className="font-medium text-lg">Total Collected</h3>
            </div>
            <p className="text-3xl font-bold">
              {payments
                .filter(payment => payment.status === 'Pagado')
                .reduce((sum, payment) => sum + payment.amount, 0)
                .toLocaleString()} PLN
            </p>
            <p className="text-sm opacity-80 mt-2">
              From {payments.filter(payment => payment.status === 'Pagado').length} completed payments
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="font-medium text-lg">Pending Collection</h3>
            </div>
            <p className="text-3xl font-bold">
              {payments
                .filter(payment => payment.status === 'Pendiente')
                .reduce((sum, payment) => sum + payment.amount, 0)
                .toLocaleString()} PLN
            </p>
            <p className="text-sm opacity-80 mt-2">
              From {payments.filter(payment => payment.status === 'Pendiente').length} pending payments
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filtering */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by client or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative inline-block text-left">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select
                className="border rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="Pagado">Paid</option>
                <option value="Pendiente">Pending</option>
                <option value="Vencido">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-gray-500">No payments match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.clients?.full_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.reference_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{payment.amount} PLN</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_date ? formatDate(payment.payment_date) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.installment_number} of {payment.total_installments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'Pagado'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'Vencido'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          setEditingPayment({
                            ...payment,
                            client_name: payment.clients?.full_name
                          });
                          setIsEditingPayment(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}