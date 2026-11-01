import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  PhoneCall,
  Building2,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export const MyHelpPage: React.FC = () => {
  const { settings } = useFinance();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is monthly interest on my gold loan calculated?',
      a: 'Interest is calculated on a monthly reducing balance basis at your sanctioned monthly rate (e.g. 1.25% per month). You can pay only the monthly interest every month to keep your loan current and protect your gold ornaments.',
    },
    {
      q: 'Can I make partial principal repayments anytime?',
      a: 'Yes! You can pay any amount towards your principal at any time without any prepayment penalty or lock-in fee. As soon as you reduce principal, subsequent monthly interest is automatically reduced.',
    },
    {
      q: 'How do I release and collect my pledged gold ornaments?',
      a: 'Once your outstanding principal and accumulated interest are paid in full, visit your assigned branch during operating hours. Present your original loan sanction slip and Aadhaar/PAN. The branch manager and custodian will retrieve your sealed safe packet in your physical presence.',
    },
    {
      q: 'What is the prompt payment rebate scheme?',
      a: 'Customers who clear their monthly interest on or before the 15th of every month enjoy a 0.25% prompt rebate on their interest rate, saving money on borrowing costs.',
    },
    {
      q: 'Are my pledged gold items safe in the branch vault?',
      a: 'Yes, 100%. All pledged ornaments are sealed in tamper-evident packets in front of you and stored in Grade-A dual-custody safes monitored 24/7 by CCTV and fully insured by National Insurance Co. Ltd.',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Help Desk & Branch Support"
        subtitle="Contact your servicing branch officers, understand loan terms, or request assistance."
        badge={{ label: 'Customer Care Support', color: 'bg-teal-100 text-teal-900 border border-teal-200' }}
        breadcrumbs={[
          { label: 'My Dashboard', to: '/' },
          { label: 'Help' },
        ]}
      />

      {/* Servicing Branch Card */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
          <Building2 className="w-5 h-5 text-amber-700" />
          <h2 className="text-base font-bold text-zinc-950 font-heading">
            Your Servicing Branch Desk
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Branch Location</span>
            <span className="font-bold text-zinc-900 text-sm block">Mumbai Fort Flagship (#101)</span>
            <span className="text-zinc-500 block">42, Veer Nariman Road, Fort, Mumbai - 400001</span>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Branch Manager Contact</span>
            <span className="font-bold text-zinc-900 text-sm block">Amit Verma (Branch Manager)</span>
            <span className="text-emerald-700 font-bold block">+91 98765 43210</span>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Counter Hours</span>
            <span className="font-bold text-zinc-900 text-sm block">9:30 AM &ndash; 6:30 PM</span>
            <span className="text-zinc-500 block">Monday to Saturday (2nd & 4th Sat Holiday)</span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
          <HelpCircle className="w-5 h-5 text-teal-700" />
          <h2 className="text-base font-bold text-zinc-950 font-heading">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-zinc-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs text-zinc-900 flex items-center justify-between gap-3 bg-zinc-50/60 hover:bg-zinc-50 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-teal-700' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="p-4 text-xs text-zinc-600 bg-white border-t border-zinc-100 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
