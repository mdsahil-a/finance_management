import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDemoData } from '../../context/DemoDataContext';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { useStaffSession } from '../../context/StaffSessionContext';
import { GoldPurity, JewelleryCategory, RepaymentMethod } from '../../types';
import { calculateGoldLoanMetrics } from '../../utils/calculator';
import { formatCurrency, formatGrams } from '../../utils/formatters';
import DocumentUploadWidget, { UploadedDocumentState } from '../../components/DocumentUploadWidget';
import DocumentPreview from '../../components/DocumentPreview';
import { SAMPLE_JEWELLERY_PHOTO_URL, SAMPLE_AADHAAR_CARD_DATA_URL, SAMPLE_PAN_CARD_DATA_URL } from '../../utils/fileUpload';
import { Check, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, User, Scale, CreditCard, FileCheck2, AlertCircle, Copy, Upload } from 'lucide-react';

export const ApplyPage: React.FC = () => {
  const location = useLocation();
  const isWeighterEntry = location.pathname === '/staff/weighter/apply';
  const { submitApplication, settings, branches, schemes } = useDemoData();
  const { currentCustomer } = useCustomerSession();
  const { currentStaff } = useStaffSession();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fullName, setFullName] = useState(currentCustomer?.fullName || 'John Doe');
  const [email, setEmail] = useState(currentCustomer?.email || 'john.doe@aurum.example');
  const [mobile, setMobile] = useState(currentCustomer?.mobile || '+91 98765 43210');
  const [city, setCity] = useState(currentCustomer?.city || 'Mumbai');
  const [appState, setAppState] = useState(currentCustomer?.state || 'Maharashtra');
  const [goldCategory, setGoldCategory] = useState<JewelleryCategory>('Bangles');
  const [itemsCount, setItemsCount] = useState<number>(4);
  const [weight, setWeight] = useState<number>(45);
  const [purity, setPurity] = useState<GoldPurity>('22K');
  const [loanPurpose, setLoanPurpose] = useState('Business inventory & working capital expansion');
  const [idProofType, setIdProofType] = useState<'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID' | 'Driving License'>('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('XXXX-XXXX-4892');
  const [idProofFile, setIdProofFile] = useState<UploadedDocumentState | null>(null);
  const [jewelleryPhotoFile, setJewelleryPhotoFile] = useState<UploadedDocumentState | null>(null);
  const [addressProofType, setAddressProofType] = useState('Utility Bill');
  const [addressProofFile, setAddressProofFile] = useState<UploadedDocumentState | null>(null);
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(schemes[0]?.code || 'AGF-REGULAR');
  const [requestedAmount, setRequestedAmount] = useState<number>(225000);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('Simple Interest');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || 'BR-MUM-01');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('aurum_calc_prefill');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.weight) setWeight(Number(parsed.weight));
        if (parsed.purity) setPurity(parsed.purity);
        if (parsed.amount) setRequestedAmount(Number(parsed.amount));
        if (parsed.tenure) setTenureMonths(Number(parsed.tenure));
        if (parsed.method) setRepaymentMethod(parsed.method);
        sessionStorage.removeItem('aurum_calc_prefill');
      }
    } catch (e) { console.warn('Could not read calculator prefill', e); }
  }, []);

  const valuation = calculateGoldLoanMetrics({ grossWeight: weight, purity, referencePrice24K: settings.goldReferencePrice24K, ltvRatio: settings.maxLtvRatio, tenureMonths, annualInterestRate: settings.defaultAnnualInterestRate, repaymentMethod });
  const categories: JewelleryCategory[] = ['Bangles', 'Necklace', 'Chain', 'Earrings', 'Rings', 'Other Jewellery'];
  const purities: GoldPurity[] = ['18K', '20K', '22K', '24K'];
  const idProofTypes = ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License'] as const;
  const getSampleIdUrl = () => idProofType === 'PAN Card' ? SAMPLE_PAN_CARD_DATA_URL : SAMPLE_AADHAAR_CARD_DATA_URL;
  const getSampleIdFileName = () => idProofType === 'PAN Card' ? 'sample-pan-card.svg' : 'sample-aadhaar-card.svg';

  const validateStep = (step: number): boolean => {
    if (step === 1) return fullName.trim().length > 2 && email.includes('@') && mobile.trim().length >= 10;
    if (step === 2) return weight >= 5 && itemsCount >= 1 && loanPurpose.trim().length > 3;
    if (step === 3) return Boolean(jewelleryPhotoFile && idProofFile && addressProofFile);
    if (step === 4) return requestedAmount > 10000 && tenureMonths >= 3;
    if (step === 5) return declarationAccepted;
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      alert(currentStep === 3
        ? 'Upload a jewellery photo, government ID proof, and address proof before continuing.'
        : 'Please complete all required fields correctly before continuing.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationAccepted || isSubmitting) return;
    if (!jewelleryPhotoFile || !idProofFile || !addressProofFile) {
      alert('The jewellery photo, government ID proof, and address proof are required.');
      setCurrentStep(3);
      return;
    }
    setIsSubmitting(true);
    try {
      const createdApp = submitApplication({
        customer: { fullName, email, mobile, city, state: appState },
        goldDetails: { category: goldCategory, itemsCount, declaredWeight: weight, purity, purpose: loanPurpose, approximateValue: valuation.estimatedGoldValue },
        loanPreferences: { 
          requestedAmount, 
          preferredTenureMonths: tenureMonths, 
          repaymentMethod,
          schemeCode: selectedSchemeCode,
        },
        assignedBranchId: selectedBranchId,
        documents: {
          idProofType, idProofNumberMasked: idProofNumber,
          idProofFileName: idProofFile.name, idProofFileUrl: idProofFile.dataUrl, idProofFileSize: idProofFile.sizeFormatted, idProofFileType: idProofFile.type,
          jewelleryPictureFileName: jewelleryPhotoFile.name, jewelleryPictureUrl: jewelleryPhotoFile.dataUrl, jewelleryPictureFileSize: jewelleryPhotoFile.sizeFormatted, jewelleryPictureFileType: jewelleryPhotoFile.type,
          addressProofType, addressProofFileName: addressProofFile.name, addressProofFileUrl: addressProofFile.dataUrl, addressProofFileSize: addressProofFile.sizeFormatted, addressProofFileType: addressProofFile.type,
          uploadedAt: new Date().toISOString(),
        },
      }, isWeighterEntry ? currentStaff || undefined : undefined);
      setSubmittedRef(createdApp.reference);
      setCurrentStep(6);
    } catch (err) {
      console.error('Failed to submit application', err);
      alert(err instanceof Error ? err.message : 'Error submitting application. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  const copyRefToClipboard = () => {
    if (submittedRef) { navigator.clipboard.writeText(submittedRef); setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  const stepsList = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Gold Details', icon: Scale },
    { num: 3, label: 'Documents', icon: Upload },
    { num: 4, label: 'Loan Terms', icon: CreditCard },
    { num: 5, label: 'Review', icon: FileCheck2 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A71930]">{isWeighterEntry ? 'Gold Weighter Application Entry' : 'Fast Multi-Step Wizard'}</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#701525] font-display">{isWeighterEntry ? 'Create Gold Loan Application' : 'Apply for Gold Loan (Demo)'}</h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">{isWeighterEntry ? 'Enter the customer, pledged jewellery, documents, and requested loan details to register an application in the assessment queue.' : 'Submit your simulated jewellery application to receive a tracking reference and test the staff management workflow.'}</p>
      </div>
      {currentStep < 6 && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E2D8] shadow-xs">
          <div className="grid grid-cols-5 gap-2">
            {stepsList.map((st) => {
              const Icon = st.icon; const isCompleted = currentStep > st.num; const isCurrent = currentStep === st.num;
              return (
                <div key={st.num} className="flex flex-col items-center text-center">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-xs ${
                    isCurrent ? 'bg-[#701525] text-white' : isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold mt-2 truncate max-w-full">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xl">

        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-[#701525] font-display">Step 1: Personal & Contact Information</h3>
              <p className="text-xs text-gray-500 mt-1">Provide fictional contact information for this demo application.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-700">Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. John Doe" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Email Address *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. demo@aurum.example" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Mobile Phone Number *</label>
                <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">City *</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">State *</label>
                <input type="text" value={appState} onChange={(e) => setAppState(e.target.value)} placeholder="e.g. Maharashtra" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>We never ask for real Aadhaar numbers, PAN credentials, or OTPs on this prototype.</span>
            </div>
          </div>
        )}

        {/* STEP 2: Gold Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-[#701525] font-display">Step 2: Pledged Gold Jewellery Details</h3>
              <p className="text-xs text-gray-500 mt-1">Declare the category, items, declared gross weight, and karat purity.</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Jewellery Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {categories.map((cat) => (
                  <button key={cat} type="button" onClick={() => setGoldCategory(cat)}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${goldCategory === cat ? 'border-[#701525] bg-[#701525]/5 text-[#701525]' : 'border-gray-200 hover:border-[#701525]/50'}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Number of Items *</label>
                <input type="number" min="1" max="50" value={itemsCount} onChange={(e) => setItemsCount(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Declared Total Weight (g) *</label>
                <input type="number" min="5" step="0.5" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Hallmark Purity (Karat) *</label>
              <div className="grid grid-cols-4 gap-2">
                {purities.map((p) => (
                  <button key={p} type="button" onClick={() => setPurity(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${purity === p ? 'border-[#701525] bg-[#701525] text-white' : 'border-gray-200 text-gray-700 hover:border-[#701525]'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-700">Loan Purpose *</label>
              <input type="text" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} placeholder="e.g. Business expansion, Agriculture, Personal" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm" />
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E2D8] flex items-center justify-between">
              <div><span className="text-[11px] text-gray-500 block">Calculated Illustrative Gold Value</span><span className="text-lg font-bold text-[#701525]">{formatCurrency(valuation.estimatedGoldValue)}</span></div>
              <div className="text-right"><span className="text-[11px] text-gray-500 block">Max Eligible Loan (75% LTV)</span><span className="text-lg font-black text-emerald-700">{formatCurrency(valuation.estimatedEligibleAmount)}</span></div>
            </div>
          </div>
        )}

        {/* STEP 3: Document Upload */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-[#701525] font-display">Step 3: Upload KYC Documents & Jewellery Photos</h3>
              <p className="text-xs text-gray-500 mt-1">Upload or use pre-loaded sample images. A jewellery photo, government ID, and address proof are required.</p>
            </div>
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-amber-200">
                <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center"><span className="text-amber-800 font-black text-sm">1</span></div>
                <div><p className="text-sm font-bold text-amber-900">Jewellery Photograph</p><p className="text-[10px] text-amber-700">Clear image of the gold ornaments to be pledged</p></div>
              </div>
              <DocumentUploadWidget
                label="Jewellery Photo" required value={jewelleryPhotoFile} onChange={setJewelleryPhotoFile}
                sampleUrl={SAMPLE_JEWELLERY_PHOTO_URL} sampleLabel="Use Sample Jewellery Photo" sampleFileName="sample-jewellery.jpg"
                description="Upload a photograph of the actual gold ornaments. High quality images help expedite physical appraisal."
                acceptedTypes="image/*" id="jewellery-photo-upload" />
            </div>
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-blue-200">
                <div className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center"><span className="text-blue-800 font-black text-sm">2</span></div>
                <div><p className="text-sm font-bold text-blue-900">Government-Issued ID Proof</p><p className="text-[10px] text-blue-700">Aadhaar Card, PAN Card, Passport, Voter ID, or Driving License</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">ID Proof Type *</label>
                  <select value={idProofType} onChange={(e) => setIdProofType(e.target.value as typeof idProofType)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 outline-none text-xs font-semibold bg-white">
                    {idProofTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">ID Number (Masked for Demo)</label>
                  <input type="text" value={idProofNumber} onChange={(e) => setIdProofNumber(e.target.value)} placeholder="XXXX-XXXX-4892" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 outline-none text-sm font-mono" />
                </div>
              </div>
              <DocumentUploadWidget
                label={idProofType + " Document"} required value={idProofFile} onChange={setIdProofFile}
                sampleUrl={getSampleIdUrl()} sampleLabel={"Load Sample " + idProofType} sampleFileName={getSampleIdFileName()}
                description="Upload front page of the ID document. Sample government ID cards are pre-generated for demo use."
                acceptedTypes="image/*,.pdf,application/pdf" accentColor="#1d4ed8" id="id-proof-upload" />
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center"><span className="text-emerald-800 font-black text-sm">3</span></div>
                <div><p className="text-sm font-bold text-emerald-900">Address Proof Document</p><p className="text-[10px] text-emerald-700">Utility Bill, Rental Agreement, Bank Statement, or similar</p></div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Address Proof Type</label>
                <select value={addressProofType} onChange={(e) => setAddressProofType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-500 outline-none text-xs font-semibold bg-white">
                  {['Utility Bill', 'Rental Agreement', 'Bank Statement', 'Passport', 'Aadhaar Card'].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <DocumentUploadWidget
                label="Address Proof Document" required value={addressProofFile} onChange={setAddressProofFile}
                sampleUrl={SAMPLE_AADHAAR_CARD_DATA_URL} sampleLabel="Load Sample Address Proof" sampleFileName="sample-address-proof.svg"
                description="Upload a document confirming your current residential address."
                acceptedTypes="image/*,.pdf,application/pdf" accentColor="#059669" id="address-proof-upload" />
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>All three documents are required. Files are stored in this browser only and are not sent to a server.</span>
            </div>
          </div>
        )}

        {/* STEP 4: Loan Preferences */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-[#701525] font-display">Step 4: Loan Preferences & Branch Selection</h3>
              <p className="text-xs text-gray-500 mt-1">Specify your desired loan amount and servicing schedule.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Select Gold Loan Scheme *</label>
                <select
                  value={selectedSchemeCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setSelectedSchemeCode(code);
                    const matched = schemes.find(s => s.code === code);
                    if (matched) {
                      setRepaymentMethod(
                        matched.interestMethod === 'Reducing Balance EMI'
                          ? 'Reducing Balance EMI'
                          : 'Simple Interest'
                      );
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-xs outline-none focus:border-[#701525]"
                >
                  {schemes.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code}) — {s.annualInterestRate}% p.a. • Max LTV: {s.maxLtvRatio}%
                    </option>
                  ))}
                </select>
                {(() => {
                  const currScheme = schemes.find(s => s.code === selectedSchemeCode);
                  return currScheme ? (
                    <p className="text-[11px] text-[#701525] mt-1 font-medium bg-[#FAF8F3] p-2 rounded-lg border border-[#E8E2D8]">
                      {currScheme.description} (Min: {formatCurrency(currScheme.minLoanAmount)} • Max: {formatCurrency(currScheme.maxLoanAmount)})
                    </p>
                  ) : null;
                })()}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-gray-700">Requested Loan Amount (Rs.) *</label>
                  <span className="font-mono font-bold text-emerald-700 text-sm">{formatCurrency(requestedAmount)}</span>
                </div>
                <input type="number" min="10000" max={valuation.estimatedEligibleAmount || 500000} step="5000" value={requestedAmount} onChange={(e) => setRequestedAmount(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm font-bold" />
                <span className="text-[11px] text-gray-500 mt-1 block">Eligible limit based on gold: up to {formatCurrency(valuation.estimatedEligibleAmount)}</span>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Preferred Loan Tenure (Months) *</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[3, 6, 9, 12, 18, 24].map((t) => (
                    <button key={t} type="button" onClick={() => setTenureMonths(t)}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all ${tenureMonths === t ? 'border-[#701525] bg-[#701525] text-white' : 'border-gray-200 text-gray-700 hover:border-[#701525]'}`}>{t}M</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Preferred Servicing Method *</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Simple Interest', 'Reducing Balance EMI'] as RepaymentMethod[]).map((method) => (
                    <button key={method} type="button" onClick={() => setRepaymentMethod(method)}
                      className={`p-3 rounded-xl border text-left font-bold transition-all ${repaymentMethod === method ? 'border-[#701525] bg-[#701525]/5 text-[#701525]' : 'border-gray-200 hover:border-[#701525]/50'}`}>
                      {method}<span className="block text-[10px] font-normal text-gray-500 mt-0.5">{method === 'Simple Interest' ? 'Pay monthly interest only' : 'Monthly equated installments'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Assigned Service Branch *</label>
                <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-xs font-semibold">
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.city}, {b.state})</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Declaration */}
        {currentStep === 5 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-[#701525] font-display">Step 5: Review Application & Declaration</h3>
              <p className="text-xs text-gray-500 mt-1">Inspect your recorded details prior to demo queue dispatch.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center pb-1 border-b border-gray-200"><span className="font-bold text-[#701525]">Personal Info</span><button type="button" onClick={() => setCurrentStep(1)} className="text-[10px] text-blue-600 underline">Edit</button></div>
                <p><strong>Name:</strong> {fullName}</p><p><strong>Mobile:</strong> {mobile}</p><p><strong>Email:</strong> {email}</p><p><strong>Location:</strong> {city}, {appState}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center pb-1 border-b border-gray-200"><span className="font-bold text-[#701525]">Gold Details</span><button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] text-blue-600 underline">Edit</button></div>
                <p><strong>Category:</strong> {itemsCount} {goldCategory}</p><p><strong>Weight:</strong> {formatGrams(weight)}</p><p><strong>Purity:</strong> {purity}</p><p><strong>Est. Value:</strong> {formatCurrency(valuation.estimatedGoldValue)}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center pb-1 border-b border-gray-200"><span className="font-bold text-[#701525]">Loan Details</span><button type="button" onClick={() => setCurrentStep(4)} className="text-[10px] text-blue-600 underline">Edit</button></div>
                <p><strong>Requested:</strong> {formatCurrency(requestedAmount)}</p><p><strong>Tenure:</strong> {tenureMonths} Months</p><p><strong>Method:</strong> {repaymentMethod}</p><p><strong>Rate:</strong> {settings.defaultAnnualInterestRate}% p.a.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E2D8]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#E8E2D8]">
                <span className="text-xs font-bold text-[#701525]">Attached Documents & Photos</span>
                <button type="button" onClick={() => setCurrentStep(3)} className="text-[10px] text-blue-600 underline">Edit</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  {jewelleryPhotoFile ? (<><img src={jewelleryPhotoFile.dataUrl} alt="Jewellery" className="w-full h-20 object-cover rounded-xl border border-amber-200 mb-1" /><p className="text-[10px] font-bold text-amber-800">Jewellery Photo</p><p className="text-[9px] text-gray-500">{jewelleryPhotoFile.sizeFormatted}</p></>) : (<><div className="w-full h-20 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 flex items-center justify-center mb-1"><span className="text-[10px] text-amber-600">Not Uploaded</span></div><p className="text-[10px] text-amber-700">Jewellery Photo</p></>)}
                </div>
                <div className="text-center">
                  {idProofFile ? (<><img src={idProofFile.dataUrl} alt="ID Proof" className="w-full h-20 object-cover rounded-xl border border-blue-200 mb-1" /><p className="text-[10px] font-bold text-blue-800">{idProofType}</p><p className="text-[9px] text-gray-500">{idProofFile.sizeFormatted}</p></>) : (<><div className="w-full h-20 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 flex items-center justify-center mb-1"><span className="text-[10px] text-blue-600">Not Uploaded</span></div><p className="text-[10px] text-blue-700">{idProofType}</p></>)}
                </div>
                <div className="text-center">
                  {addressProofFile ? (<><img src={addressProofFile.dataUrl} alt="Address" className="w-full h-20 object-cover rounded-xl border border-emerald-200 mb-1" /><p className="text-[10px] font-bold text-emerald-800">Address Proof</p><p className="text-[9px] text-gray-500">{addressProofFile.sizeFormatted}</p></>) : (<><div className="w-full h-20 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 flex items-center justify-center mb-1"><span className="text-[10px] text-emerald-600">Not Uploaded</span></div><p className="text-[10px] text-emerald-700">Address Proof</p></>)}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={declarationAccepted} onChange={(e) => setDeclarationAccepted(e.target.checked)} className="mt-0.5 rounded text-[#701525] focus:ring-[#701525]" required />
                <span className="text-xs text-gray-700 leading-relaxed">{isWeighterEntry ? <>I confirm this is a demonstration application for <strong>AURUM GOLD FINANCE</strong> and that the customer and pledged-gold details entered are fictional. No real financial funds will be transferred.</> : <>I understand that this is an executive demonstration prototype of <strong>AURUM GOLD FINANCE</strong>. I declare that the gold ornament details entered are fictional and acknowledge that no real financial funds will be transferred.</>}</span>
              </label>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button type="button" onClick={handlePrev} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /><span>Back</span></button>
              <button type="submit" disabled={!declarationAccepted || isSubmitting}
                className={`px-8 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md ${!declarationAccepted || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#701525] hover:bg-[#58101d]'}`}>
                <span>{isSubmitting ? 'Recording Demo Application...' : isWeighterEntry ? 'Create Application' : 'Confirm & Submit Demo Application'}</span><Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: Success */}
        {currentStep === 6 && submittedRef && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-10 h-10" /></div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Application Successfully Generated</span>
              <h2 className="text-3xl font-black text-[#701525] font-display">{isWeighterEntry ? 'Application Created Successfully' : 'Demo Application Logged in System'}</h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">{isWeighterEntry ? 'The application and attached documents are registered and dispatched to the Gold Weighter assessment queue.' : 'Your simulated gold loan record has been registered with all attached documents and dispatched into the Gold Weighter\'s physical appraisal queue.'}</p>
            </div>
            <div className="bg-[#FAF8F3] rounded-2xl p-6 border-2 border-dashed border-[#C9A45C] max-w-md mx-auto">
              <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold">Your Unique Tracking Reference</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#701525] mt-1 tracking-wider">{submittedRef}</div>
              <button onClick={copyRefToClipboard} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#701525] hover:bg-[#701525]/10 border border-[#701525]/30 transition-colors">
                <Copy className="w-3.5 h-3.5" /><span>{copied ? 'Copied to Clipboard!' : 'Copy Reference Number'}</span>
              </button>
            </div>
            {(jewelleryPhotoFile || idProofFile || addressProofFile) && (
              <div className="max-w-md mx-auto">
                <p className="text-xs font-bold text-gray-700 mb-2">Documents Attached to Application:</p>
                <div className="grid grid-cols-3 gap-2">
                  {jewelleryPhotoFile && <div className="text-center"><DocumentPreview src={jewelleryPhotoFile.dataUrl} alt="Jewellery" fileName={jewelleryPhotoFile.name} className="h-16 overflow-hidden rounded-xl border border-amber-300" /><p className="text-[9px] text-amber-800 mt-1 font-bold">Jewellery</p></div>}
                  {idProofFile && <div className="text-center"><DocumentPreview src={idProofFile.dataUrl} alt="ID" fileName={idProofFile.name} className="h-16 overflow-hidden rounded-xl border border-blue-300" /><p className="text-[9px] text-blue-800 mt-1 font-bold">{idProofType}</p></div>}
                  {addressProofFile && <div className="text-center"><DocumentPreview src={addressProofFile.dataUrl} alt="Address" fileName={addressProofFile.name} className="h-16 overflow-hidden rounded-xl border border-emerald-300" /><p className="text-[9px] text-emerald-800 mt-1 font-bold">Address</p></div>}
                </div>
              </div>
            )}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 max-w-md mx-auto text-left space-y-1">
              <p className="font-bold text-gray-800">Operational Next Steps:</p>
              <p>1. The application is now in the <strong>Gold Weighter Queue</strong> (Login as WEIGHT001).</p>
              <p>2. Once weighed, it advances to <strong>Final Entry Operator</strong> (ENTRY001).</p>
              <p>3. Super Admin authorizes sanction, then Cashier (CASH001) disburses.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              {isWeighterEntry ? (
                <Link to="/staff/weighter/queue" className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md">Open Assessment Queue</Link>
              ) : (
                <>
                  <Link to={`/track-application?ref=${encodeURIComponent(submittedRef)}`} className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md">Track Live Application Status</Link>
                  <Link to="/dashboard/applications" className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 transition-colors">View in Customer Dashboard</Link>
                  <Link to="/staff/login" className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors">Switch to Staff Console</Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation for Steps 1-4 */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
            {currentStep > 1 ? (
              <button type="button" onClick={handlePrev} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 flex items-center gap-1.5 transition-colors"><ArrowLeft className="w-4 h-4" /><span>Previous Step</span></button>
            ) : <div />}
            <button type="button" onClick={handleNext} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#701525] hover:bg-[#58101d] flex items-center gap-2 transition-colors shadow-md">
              <span>Continue to Next Step</span><ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
