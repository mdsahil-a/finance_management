import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerSession } from '../../../context/CustomerSessionContext';
import { useDemoData } from '../../../context/DemoDataContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  FileText, 
  Plus, 
  X, 
  CheckCircle2, 
  CreditCard,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export const LoanOfficerCustomersPage: React.FC = () => {
  const { applications } = useDemoData();
  const { currentCustomer, loginCustomer } = useCustomerSession();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Default customer database with realistic customer entries
  const [customerList, setCustomerList] = useState([
    {
      id: 'CUST-001',
      fullName: 'John Doe',
      mobile: '+91 98765 43210',
      email: 'john.doe@aurum.example',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Flat 402, Sea Green Apts, Worli Sea Face, Mumbai 400030',
      panNumber: 'ABCPS9842F',
      aadhaarMasked: 'XXXX-XXXX-4892',
      kycStatus: 'Verified',
      activeLoansCount: 1,
    },
    {
      id: 'CUST-002',
      fullName: 'Rajesh Mehra',
      mobile: '+91 98201 12345',
      email: 'rajesh.m@example.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '12 Sunrise Villa, Juhu Tara Road, Mumbai 400049',
      panNumber: 'AQZPM4412K',
      aadhaarMasked: 'XXXX-XXXX-1123',
      kycStatus: 'Verified',
      activeLoansCount: 1,
    },
    {
      id: 'CUST-003',
      fullName: 'Deepika Sen',
      mobile: '+91 97112 34567',
      email: 'deepika.s@example.com',
      city: 'New Delhi',
      state: 'Delhi',
      address: 'B-44, Greater Kailash Part 1, New Delhi 110048',
      panNumber: 'BKNPS7721L',
      aadhaarMasked: 'XXXX-XXXX-8921',
      kycStatus: 'Verified',
      activeLoansCount: 0,
    },
    {
      id: 'CUST-004',
      fullName: 'Venkatesh Naidu',
      mobile: '+91 94401 98765',
      email: 'venkat.n@example.com',
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'Plot 88, Road 12, Jubilee Hills, Hyderabad 500033',
      panNumber: 'CHPNY3319M',
      aadhaarMasked: 'XXXX-XXXX-5541',
      kycStatus: 'Verified',
      activeLoansCount: 1,
    },
    {
      id: 'CUST-005',
      fullName: 'Aakash Verma',
      mobile: '+91 99887 76655',
      email: 'aakash.v@example.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: '15/2 4th Cross, Indiranagar, Bengaluru 560038',
      panNumber: 'DLKPV9912R',
      aadhaarMasked: 'XXXX-XXXX-7729',
      kycStatus: 'Verified',
      activeLoansCount: 0,
    },
  ]);

  // Form states for new customer
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarMasked, setAadhaarMasked] = useState('XXXX-XXXX-');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      alert('Customer name and mobile number are required.');
      return;
    }

    const newCustomer = {
      id: `CUST-${String(customerList.length + 1).padStart(3, '0')}`,
      fullName,
      mobile,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      city,
      state,
      address,
      panNumber: panNumber.toUpperCase(),
      aadhaarMasked,
      kycStatus: 'Verified',
      activeLoansCount: 0,
    };

    setCustomerList([newCustomer, ...customerList]);
    setModalOpen(false);
    alert(`Customer ${fullName} registered with verified status.`);
  };

  const handleStartLoan = (customer: typeof customerList[0]) => {
    loginCustomer({
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      mobile: customer.mobile,
      city: customer.city,
      state: customer.state,
    });
    navigate('/staff/loan-officer/new-application');
  };

  const filteredCustomers = customerList.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Customer Directory & KYC Profiles
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Search registered customers, verify government IDs, and initiate gold loan applications.
          </p>
        </div>

        <button
          onClick={() => {
            setFullName('');
            setMobile('+91 ');
            setEmail('');
            setAddress('');
            setPanNumber('');
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4 text-[#FFE59E]" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Verified Retail Customers</h3>
            <p className="text-xs text-gray-500">{customerList.length} total customer profiles on file</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, mobile, city..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-[#701525] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => (
            <div key={c.id} className="bg-[#FAF8F3] rounded-2xl border border-[#E8E2D8] p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-gray-500 font-bold block">{c.id}</span>
                    <h4 className="font-bold text-gray-900 text-sm">{c.fullName}</h4>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>KYC Verified</span>
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.mobile}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.city}, {c.state}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 block text-[9px]">PAN Card</span>
                    <span className="font-mono font-bold text-gray-800">{c.panNumber || 'Verified'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">Aadhaar Masked</span>
                    <span className="font-mono font-bold text-gray-800">{c.aadhaarMasked}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">
                  Active Facilities: <strong>{c.activeLoansCount}</strong>
                </span>
                <button
                  onClick={() => handleStartLoan(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-2xs flex items-center gap-1"
                >
                  <span>Apply Loan</span>
                  <Plus className="w-3 h-3 text-[#FFE59E]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D8] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#C9A45C]" />
                <h3 className="text-lg font-bold text-[#701525]">Register New Retail Borrower</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Customer Full Name (as per Aadhaar / PAN)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Meenakshi Sundaram"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Residential Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="Building name, Street, Landmark, Pincode"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">PAN Card Number</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Aadhaar (Masked)</label>
                  <input
                    type="text"
                    value={aadhaarMasked}
                    onChange={(e) => setAadhaarMasked(e.target.value)}
                    placeholder="XXXX-XXXX-1234"
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-[#701525] text-white hover:bg-[#58101d]"
                >
                  Save & Verify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
