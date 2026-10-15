import React, { useState } from 'react';
import { useDemoData } from '../../context/DemoDataContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Send, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { submitEnquiry } = useDemoData();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !subject || !message) return;

    submitEnquiry({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    setSubmitted(true);
    setFullName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701525]/10 text-[#701525] text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Support & Enquiries</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#701525] font-display">
          Contact Aurum Gold Finance
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          Have questions regarding illustrative valuation benchmarks or system operations? Send a demo message to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 bg-[#701525] rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div>
              <h3 className="text-2xl font-bold font-display">Simulated Corporate Office</h3>
              <p className="text-xs text-[#E9D6A6] mt-1">
                Aurum Gold Finance Headquarters (Demonstration Sandbox)
              </p>
            </div>

            <div className="space-y-4 text-xs text-white/90">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C9A45C] shrink-0 mt-0.5" />
                <span>Aurum Tower, Ground & 1st Floor, D.N. Road, Fort, Mumbai 400001, Maharashtra</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C9A45C] shrink-0" />
                <span>+91 22 2200 4500 (Demo Support Line)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C9A45C] shrink-0" />
                <span>support@aurum.example</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#C9A45C] shrink-0" />
                <span>Monday – Saturday: 9:30 AM to 6:30 PM IST</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 relative z-10 text-[11px] text-white/70">
            <p>
              *All enquiries are stored locally in browser LocalStorage. No real emails or SMS messages will be transmitted.
            </p>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-lg">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Enquiry Recorded in Local Storage!</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you for your submission. Your enquiry has been saved locally for review in the demonstration environment.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white"
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Saxena"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Query on Gold Valuation & LTV"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Message Content *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your query or feedback..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Demo Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
