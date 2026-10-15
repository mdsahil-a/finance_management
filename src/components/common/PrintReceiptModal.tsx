import React from 'react';
import { DemoTransaction } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface PrintReceiptModalProps {
  transaction: DemoTransaction | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E8E2D8]">
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between p-4 border-b border-gray-100 bg-[#FAF8F3]">
          <div className="flex items-center gap-2 text-sm text-[#701525] font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Simulated Transaction Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 font-sans text-gray-800 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-4 border-[#C9A45C]/30">
            <div>
              <Logo size="sm" showTagline={true} linkTo="" />
              <p className="text-xs text-gray-500 mt-2">
                Aurum Gold Finance Limited (Demo)
                <br />
                Fort Flagship Branch, Mumbai — 400001
                <br />
                Phone: +91 22 2200 4500 | CIN: U65999MH2026PLC000000
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#FAF8F3] px-2.5 py-1 rounded text-xs font-mono font-bold text-[#701525] border border-[#E8E2D8]">
                {transaction.receiptNumber}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">
                Date: {formatDateTime(transaction.recordedAt)}
              </p>
              <span className="inline-block text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold mt-1">
                DEMO TRANSACTION RECEIPT
              </span>
            </div>
          </div>

          {/* Receipt Title */}
          <div className="text-center py-2 bg-gradient-to-r from-[#FAF8F3] via-[#FAF3E0] to-[#FAF8F3] border-y border-[#E8E2D8]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#701525]">
              {transaction.type === 'Disbursement' ? 'Loan Disbursement Acknowledgment' : 'Loan Repayment Receipt'}
            </h3>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <p className="text-gray-500">Customer Name</p>
              <p className="font-bold text-gray-900">{transaction.customerName}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-gray-500">Application Reference</p>
              <p className="font-bold text-[#701525] font-mono">{transaction.applicationReference}</p>
            </div>
            {transaction.loanAccountNumber && (
              <div className="space-y-1.5">
                <p className="text-gray-500">Loan Account Number</p>
                <p className="font-semibold font-mono text-gray-900">{transaction.loanAccountNumber}</p>
              </div>
            )}
            <div className="space-y-1.5">
              <p className="text-gray-500">Payment Mode</p>
              <p className="font-semibold text-gray-900">{transaction.paymentMode}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-gray-500">Transaction Reference</p>
              <p className="font-mono text-gray-700">{transaction.transactionReference}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-gray-500">Processed By Cashier</p>
              <p className="font-medium text-gray-700">
                {transaction.processedByName} ({transaction.processedBy})
              </p>
            </div>
          </div>

          {/* Amount Box */}
          <div className="rounded-xl p-4 bg-[#701525]/5 border border-[#701525]/20 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-medium text-gray-600">
                {transaction.type === 'Disbursement' ? 'Total Disbursed Amount' : 'Repayment Amount Received'}
              </span>
              <p className="text-xs text-gray-500 italic mt-0.5">
                Status: Verified & Processed in Simulated Operations
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#701525]">
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>

          {/* Simulated Disclaimer & Signature Section */}
          <div className="border-t border-dashed border-gray-300 pt-4 flex items-end justify-between">
            <div className="space-y-1 max-w-xs text-[10px] text-gray-500">
              <div className="flex items-center gap-1 text-[#C9A45C] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulated Operational Voucher</span>
              </div>
              <p>
                This document is generated by the Aurum Gold Finance prototype. No actual currency exchange or financial claim has transpired.
              </p>
            </div>
            <div className="text-center">
              <div className="w-28 border-b border-gray-400 mb-1" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Authorized Cashier Seal</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="no-print p-4 border-t border-gray-100 bg-[#FAF8F3] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
