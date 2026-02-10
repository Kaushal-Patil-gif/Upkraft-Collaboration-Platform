import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPaymentHistory } from '../../services/paymentService';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const data = await getPaymentHistory();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PAYMENT_MADE': return '💳';
      case 'ESCROW_RELEASE': return '🔒';
      case 'MILESTONE_PAYMENT': return '🎯';
      case 'WITHDRAWAL': return '💸';
      default: return '💼';
    }
  };

  const getPaymentMethod = (payment) => {
    if (payment.type === 'WITHDRAWAL') return 'Bank Transfer';
    if (payment.type === 'ESCROW_RELEASE' || payment.type === 'MILESTONE_PAYMENT') return 'Escrow System';
    if (payment.paymentId && payment.paymentId.startsWith('razorpay_')) return 'Razorpay Gateway';
    if (payment.paymentId && payment.paymentId.startsWith('pay_')) return 'Razorpay Payment';
    if (payment.paymentId) return 'Online Payment';
    return 'Platform Transfer';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PAYMENT_MADE': return 'text-red-600';
      case 'ESCROW_RELEASE': 
      case 'MILESTONE_PAYMENT': return 'text-green-600';
      case 'WITHDRAWAL': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPaymentHistory}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {payments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No payment history found</p>
          <p className="text-sm text-gray-400">Your payment transactions will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {payments.map((payment, index) => (
            <motion.div
              key={payment.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getTypeIcon(payment.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {payment.title || 'Payment Transaction'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {payment.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-blue-600 font-medium">
                        via {getPaymentMethod(payment)}
                      </p>
                      {payment.paymentId && payment.paymentId.startsWith('razorpay_') && (
                        <span className="px-1 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                          Razorpay
                        </span>
                      )}
                      {(payment.type === 'ESCROW_RELEASE' || payment.type === 'MILESTONE_PAYMENT') && (
                        <span className="px-1 py-0.5 bg-green-100 text-green-600 rounded text-xs font-medium">
                          Escrow
                        </span>
                      )}
                      {payment.type === 'WITHDRAWAL' && (
                        <span className="px-1 py-0.5 bg-orange-100 text-orange-600 rounded text-xs font-medium">
                          Withdrawal
                        </span>
                      )}
                    </div>
                    {payment.creatorName && (
                      <p className="text-xs text-gray-500 mt-1">
                        From: {payment.creatorName}
                      </p>
                    )}
                    {payment.freelancerName && (
                      <p className="text-xs text-gray-500 mt-1">
                        To: {payment.freelancerName}
                      </p>
                    )}
                    {payment.bankAccount && (
                      <p className="text-xs text-gray-500 mt-1">
                        Bank: ****{payment.bankAccount.slice(-4)} ({payment.ifscCode})
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(payment.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getTypeColor(payment.type)}`}>
                    {payment.type === 'PAYMENT_MADE' ? '-' : '+'}₹{payment.amount.toLocaleString()}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                  {payment.paymentId && (
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {payment.paymentId}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}