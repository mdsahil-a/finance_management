import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Printer } from 'lucide-react';

export const PrintReceiptModal: React.FC = () => {
  const {
    activePrintModal,
    setActivePrintModal,
    selectedLoanForPrint,
    selectedPaymentForPrint,
    settings,
  } = useFinance();

  if (!activePrintModal) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setActivePrintModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Screen only, hidden during print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              {activePrintModal === 'LOAN_SLIP' && 'Print Gold Loan Slip'}
              {activePrintModal === 'PAYMENT_RECEIPT' && 'Print Payment Receipt'}
              {activePrintModal === 'GOLD_RETURN' && 'Print Gold Return Slip'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="overflow-y-auto p-8 flex-1 bg-white print:p-0 print:overflow-visible">
          
          {/* ================= 1. LOAN VOUCHER / SLIP ================= */}
          {activePrintModal === 'LOAN_SLIP' && selectedLoanForPrint && (
            <div className="space-y-6 text-slate-900 border border-slate-200 p-6 rounded-xl print:border-none print:p-0">
              
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  {settings.shopName}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">{settings.shopAddress}</p>
                <p className="text-xs font-semibold text-slate-800">Phone: {settings.shopPhone}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded tracking-wider uppercase">
                  Gold Loan Voucher & Pawn Slip
                </div>
              </div>

              {/* Loan & Customer Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p><strong>Loan No:</strong> <span className="font-mono font-bold text-sm">{selectedLoanForPrint.id}</span></p>
                  <p><strong>Date Given:</strong> {selectedLoanForPrint.loanDate}</p>
                  <p><strong>First Due Date:</strong> {selectedLoanForPrint.dueDate}</p>
                  <p><strong>Safe Locker:</strong> {selectedLoanForPrint.safePacketNumber}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p><strong>Customer Name:</strong> <span className="font-bold">{selectedLoanForPrint.customerName}</span></p>
                  <p><strong>Mobile:</strong> {selectedLoanForPrint.customerPhone}</p>
                  {selectedLoanForPrint.customerAddress && (
                    <p><strong>Address:</strong> {selectedLoanForPrint.customerAddress}</p>
                  )}
                  {selectedLoanForPrint.customerIdProof && (
                    <p><strong>ID Proof:</strong> {selectedLoanForPrint.customerIdProof}</p>
                  )}
                </div>
              </div>

              {/* Gold Ornaments Kept in Safe */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Gold Ornaments Kept as Security:
                </h2>
                <table className="w-full text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300">
                    <tr>
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">Item Description</th>
                      <th className="p-2 text-center">Purity</th>
                      <th className="p-2 text-right">Gross Wt (g)</th>
                      <th className="p-2 text-right">Net Gold Wt (g)</th>
                      <th className="p-2 text-right">Estimated Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedLoanForPrint.goldItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-slate-500">{idx + 1}</td>
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-center">{item.purity}</td>
                        <td className="p-2 text-right">{item.grossWeight.toFixed(2)}</td>
                        <td className="p-2 text-right font-bold">{item.netWeight.toFixed(2)}</td>
                        <td className="p-2 text-right">₹{item.estimatedValue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold border-t border-slate-300">
                      <td colSpan={3} className="p-2 text-right">Total:</td>
                      <td className="p-2 text-right">
                        {selectedLoanForPrint.goldItems.reduce((a, b) => a + b.grossWeight, 0).toFixed(2)} g
                      </td>
                      <td className="p-2 text-right text-slate-950">
                        {selectedLoanForPrint.totalWeightGrams.toFixed(2)} g
                      </td>
                      <td className="p-2 text-right">
                        ₹{selectedLoanForPrint.goldValueTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Loan Money Terms */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">Loan Money Given:</span>
                  <span className="text-lg font-black text-slate-950">
                    ₹{selectedLoanForPrint.loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Monthly Interest:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedLoanForPrint.monthlyInterestRate}% / month (= ₹{selectedLoanForPrint.monthlyInterestAmount.toLocaleString('en-IN')} / month)
                  </span>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="text-[10px] text-slate-600 space-y-1 border-t border-slate-200 pt-3">
                <p>1. The gold ornaments mentioned above are held in safe locker against the loan amount received.</p>
                <p>2. The borrower agrees to pay monthly interest on time. Gold will be returned upon full settlement of principal & interest.</p>
                <p>3. {settings.receiptFooterNote}</p>
              </div>

              {/* Staff Attribution Footer */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-700">
                <div>
                  <span className="text-slate-500 block">Loan Issued By:</span>
                  <span className="font-bold">{selectedLoanForPrint.createdByStaffName || 'Loan Officer'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Gold Appraised By:</span>
                  <span className="font-bold">{selectedLoanForPrint.appraisedByStaffName || 'Gold Appraiser'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Locker Safe In-Charge:</span>
                  <span className="font-bold">{selectedLoanForPrint.vaultedByStaffName || 'Custodian'}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 text-xs border-t border-slate-200">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-6"></div>
                  <p className="mt-1 font-semibold text-slate-800">Borrower Signature</p>
                  <p className="text-[10px] text-slate-500">({selectedLoanForPrint.customerName})</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-6"></div>
                  <p className="mt-1 font-semibold text-slate-800">For {settings.shopName}</p>
                  <p className="text-[10px] text-slate-500">({selectedLoanForPrint.createdByStaffName || 'Authorized Signatory'})</p>
                </div>
              </div>

            </div>
          )}

          {/* ================= 2. PAYMENT RECEIPT ================= */}
          {activePrintModal === 'PAYMENT_RECEIPT' && selectedPaymentForPrint && (
            <div className="space-y-6 text-slate-900 border border-slate-200 p-6 rounded-xl print:border-none print:p-0">
              
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  {settings.shopName}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">{settings.shopAddress}</p>
                <p className="text-xs font-semibold text-slate-800">Phone: {settings.shopPhone}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded tracking-wider uppercase">
                  Official Payment Receipt
                </div>
              </div>

              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p><strong>Receipt No:</strong> <span className="font-mono font-bold text-sm">{selectedPaymentForPrint.receiptNumber}</span></p>
                  <p><strong>Payment Date:</strong> {selectedPaymentForPrint.paymentDate} at {selectedPaymentForPrint.paymentTime}</p>
                  <p><strong>Loan Reference:</strong> <span className="font-mono font-semibold">{selectedPaymentForPrint.loanId}</span></p>
                  <p><strong>Payment Mode:</strong> {selectedPaymentForPrint.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p><strong>Received From:</strong> <span className="font-bold">{selectedPaymentForPrint.customerName}</span></p>
                  <p><strong>Mobile:</strong> {selectedPaymentForPrint.customerPhone}</p>
                  <p><strong>Payment Type:</strong> <span className="font-semibold text-emerald-700">{selectedPaymentForPrint.paymentType}</span></p>
                </div>
              </div>

              {/* Amount Breakdown Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b border-slate-300">
                    <tr>
                      <th className="p-2.5 text-left">Description</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedPaymentForPrint.interestPaid > 0 && (
                      <tr>
                        <td className="p-2.5 font-medium">Interest Payment Received</td>
                        <td className="p-2.5 text-right font-semibold">
                          ₹{selectedPaymentForPrint.interestPaid.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )}
                    {selectedPaymentForPrint.principalPaid > 0 && (
                      <tr>
                        <td className="p-2.5 font-medium">Principal Loan Amount Paid</td>
                        <td className="p-2.5 text-right font-semibold">
                          ₹{selectedPaymentForPrint.principalPaid.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-600">
                      <td className="p-3 text-sm">TOTAL AMOUNT RECEIVED:</td>
                      <td className="p-3 text-right text-base font-black">
                        ₹{selectedPaymentForPrint.totalPaid.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Remaining Balance Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Remaining Loan Balance:</span>
                  <span className="text-base font-bold text-slate-900">
                    ₹{selectedPaymentForPrint.remainingPrincipalAfter.toLocaleString('en-IN')}
                  </span>
                </div>
                {selectedPaymentForPrint.remainingPrincipalAfter === 0 ? (
                  <div className="text-right text-emerald-700 font-bold">
                    ✓ Full Loan Settled! Gold is ready to return.
                  </div>
                ) : (
                  <div className="text-right text-slate-500">
                    Next monthly interest due next month.
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 text-xs border-t border-slate-200">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-6"></div>
                  <p className="mt-1 font-semibold text-slate-800">Customer Signature</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-6"></div>
                  <p className="mt-1 font-semibold text-slate-800">Authorized Cashier Signature</p>
                  <p className="text-[10px] text-slate-500">({selectedPaymentForPrint.receivedByStaffName || settings.shopName})</p>
                </div>
              </div>

            </div>
          )}

          {/* ================= 3. GOLD RETURN GATE PASS ================= */}
          {activePrintModal === 'GOLD_RETURN' && selectedLoanForPrint && (
            <div className="space-y-6 text-slate-900 border border-slate-200 p-6 rounded-xl print:border-none print:p-0">
              
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  {settings.shopName}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">{settings.shopAddress}</p>
                <p className="text-xs font-semibold text-slate-800">Phone: {settings.shopPhone}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded tracking-wider uppercase">
                  Gold Return & Loan Closure Acknowledgment
                </div>
              </div>

              {/* Loan Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p><strong>Loan No:</strong> <span className="font-mono font-bold">{selectedLoanForPrint.id}</span></p>
                  <p><strong>Loan Date:</strong> {selectedLoanForPrint.loanDate}</p>
                  <p><strong>Settlement Date:</strong> {selectedLoanForPrint.returnedDate || new Date().toISOString().split('T')[0]}</p>
                  <p><strong>Safe Packet Released:</strong> {selectedLoanForPrint.safePacketNumber}</p>
                </div>
                <div className="text-right">
                  <p><strong>Customer Name:</strong> <span className="font-bold">{selectedLoanForPrint.customerName}</span></p>
                  <p><strong>Mobile:</strong> {selectedLoanForPrint.customerPhone}</p>
                  <p><strong>Loan Status:</strong> <span className="text-emerald-600 font-bold">Fully Settled (₹0 Due)</span></p>
                </div>
              </div>

              {/* Gold Ornaments Handed Over */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Gold Ornaments Handed Over to Customer:
                </h2>
                <table className="w-full text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300">
                    <tr>
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">Item Name</th>
                      <th className="p-2 text-center">Purity</th>
                      <th className="p-2 text-right">Net Weight (g)</th>
                      <th className="p-2 text-center">Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedLoanForPrint.goldItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-slate-500">{idx + 1}</td>
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-center">{item.purity}</td>
                        <td className="p-2 text-right font-bold">{item.netWeight.toFixed(2)} g</td>
                        <td className="p-2 text-center text-emerald-700 font-semibold">Original / Intact</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold border-t border-slate-300">
                      <td colSpan={3} className="p-2 text-right">Total Weight Returned:</td>
                      <td className="p-2 text-right text-slate-950 font-black">
                        {selectedLoanForPrint.totalWeightGrams.toFixed(2)} g
                      </td>
                      <td className="p-2 text-center text-emerald-700 font-bold">Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Customer Acknowledgment Statement */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Customer Declaration:</p>
                <p>
                  "I, <strong>{selectedLoanForPrint.customerName}</strong>, hereby declare that I have received all my gold ornaments listed above in good, undamaged condition from {settings.shopName}. My loan account {selectedLoanForPrint.id} is fully cleared and settled with no outstanding dues."
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-xs border-t border-slate-200">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-8"></div>
                  <p className="mt-1 font-semibold text-slate-800">Customer Signature (Receiver)</p>
                  <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-8"></div>
                  <p className="mt-1 font-semibold text-slate-800">For {settings.shopName}</p>
                  <p className="text-[10px] text-slate-500">Gold Handed Over By (Locker Custodian)</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
