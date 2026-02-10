import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWalletBalance, requestWithdrawal } from '../../services/walletService';

const Modal = ({ isOpen, onClose, title, message, type = "success" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
        >
          <div className="text-center">
            <div className={`text-4xl mb-4 ${
              type === "success" ? "text-green-500" : "text-red-500"
            }`}>
              {type === "success" ? "✅" : "❌"}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                type === "success" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function WalletBalance() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" });
  const [errors, setErrors] = useState({});

  const validateAmount = (amount) => {
    const num = parseFloat(amount);
    if (!amount || amount.trim() === '') return 'Amount is required';
    if (isNaN(num)) return 'Please enter a valid number';
    if (num <= 0) return 'Amount must be greater than 0';
    if (num < 100) return 'Minimum withdrawal amount is ₹100';
    if (num > (balance?.availableBalance || 0)) return 'Amount exceeds available balance';
    return null;
  };

  const validateBankAccount = (account) => {
    if (!account || account.trim() === '') return 'Bank account number is required';
    if (!/^\d{9,18}$/.test(account.replace(/\s/g, ''))) return 'Please enter a valid bank account number (9-18 digits)';
    return null;
  };

  const validateIFSC = (ifsc) => {
    if (!ifsc || ifsc.trim() === '') return 'IFSC code is required';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return 'Please enter a valid IFSC code (e.g., SBIN0001234)';
    return null;
  };

  const showModal = (title, message, type = "success") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "", type: "success" });
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await getWalletBalance();
      setBalance(data);
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const amountError = validateAmount(withdrawAmount);
    const bankError = validateBankAccount(bankAccount);
    const ifscError = validateIFSC(ifscCode);
    
    const newErrors = {
      amount: amountError,
      bankAccount: bankError,
      ifscCode: ifscError
    };
    
    setErrors(newErrors);
    
    if (amountError || bankError || ifscError) {
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    setWithdrawing(true);
    try {
      await requestWithdrawal({
        amount,
        bankAccount: bankAccount.replace(/\s/g, ''),
        ifscCode: ifscCode.toUpperCase()
      });
      showModal("Success!", "Withdrawal request submitted successfully! Your funds will be processed within 2-3 business days.", "success");
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setBankAccount('');
      setIfscCode('');
      setErrors({});
      fetchBalance();
    } catch (error) {
      console.error('Withdrawal failed:', error);
      showModal("Error", "Withdrawal request failed. Please check your details and try again.", "error");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Wallet Balance</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Available Balance</span>
          <span className="text-lg font-bold text-green-600">
            ₹{(balance?.availableBalance || 0).toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Escrow Balance</span>
          <span className="text-lg font-bold text-yellow-600">
            ₹{(balance?.escrowBalance || 0).toLocaleString()}
          </span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Balance</span>
            <span className="text-xl font-bold text-purple-600">
              ₹{(balance?.totalBalance || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      {(balance?.availableBalance || 0) > 0 && (
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
        >
          💸 Withdraw Funds
        </button>
      )}
      
      {balance?.escrowBalance > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-700">
            💡 Escrow funds will be released to your available balance once projects are completed and approved by clients.
          </p>
        </div>
      )}
    </motion.div>

    {/* Withdrawal Modal */}
    {showWithdrawModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💸 Withdraw Funds</h3>
          
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Amount *
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => {
                  setWithdrawAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                }}
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter amount (min ₹100)"
              />
              {errors.amount && (
                <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Available: ₹{(balance?.availableBalance || 0).toLocaleString()}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Account Number *
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9\s]/g, '');
                  setBankAccount(value);
                  if (errors.bankAccount) setErrors(prev => ({ ...prev, bankAccount: null }));
                }}
                maxLength="20"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.bankAccount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter bank account number"
              />
              {errors.bankAccount && (
                <p className="text-xs text-red-600 mt-1">{errors.bankAccount}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter 9-18 digit account number
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code *
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  setIfscCode(value);
                  if (errors.ifscCode) setErrors(prev => ({ ...prev, ifscCode: null }));
                }}
                maxLength="11"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.ifscCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
              />
              {errors.ifscCode && (
                <p className="text-xs text-red-600 mt-1">{errors.ifscCode}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                11-character code (4 letters + 0 + 6 alphanumeric)
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setErrors({});
                  setWithdrawAmount('');
                  setBankAccount('');
                  setIfscCode('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={withdrawing}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-all"
              >
                {withdrawing ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    
    <Modal
      isOpen={modal.isOpen}
      onClose={closeModal}
      title={modal.title}
      message={modal.message}
      type={modal.type}
    />
  </>
  );
}