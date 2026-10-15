import React from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A71930]">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#701525] font-display">
          Privacy Policy & Prototype Data Governance
        </h1>
        <p className="text-xs text-gray-500">
          Last revised: October 11, 2026 • Aurum Gold Finance Ltd. Prototype
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-md space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Important Demonstration Notice:</strong> AURUM GOLD FINANCE is a frontend conceptual software prototype created solely for executive demonstration, architectural review, and operational simulation. No real customer data is sold, transferred, or processed by external third parties.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#701525]">1. LocalStorage Data Persistence</h2>
          <p>
            All submitted loan applications, gold appraisals, customer profiles, staff logs, and transaction receipts are stored exclusively in your local browser’s web storage (`localStorage`). Clearing your browser cookies and site data or using the "Reset Demo Data" action in the admin console permanently purges all demo records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#701525]">2. Simulated Credentials & No Real KYC</h2>
          <p>
            This application does not collect real Aadhaar numbers, Permanent Account Numbers (PAN), bank account pins, or one-time passwords (OTPs). Any numbers entered in the forms are treated as non-sensitive simulation parameters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#701525]">3. No Remote Server Transmission</h2>
          <p>
            There is no backend server or database connected to this prototype. No network requests transmit customer information across the public internet. All workflow state changes occur on the client side.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#701525]">4. Executive Contact for Inquiries</h2>
          <p>
            For design inquiries or further technical discussion regarding this prototype, contact product design at contact@aurum.example.
          </p>
        </section>
      </div>
    </div>
  );
};
