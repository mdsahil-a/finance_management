import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { GoldPurity, JewelleryCategory, GoldArticleItem, GoldAssessmentVersion } from '../../../types';
import { PURITY_FACTORS, calculateMultiArticleSummary } from '../../../utils/calculator';
import { formatCurrency, formatGrams, formatDateTime } from '../../../utils/formatters';
import DocumentPreview from '../../../components/DocumentPreview';
import { 
  Scale, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Sparkles,
  Info,
  Clock,
  Plus,
  Trash2,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

export const WeighterAssessmentFormPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const { applications, assessments, saveAssessmentDraft, submitAssessment, settings, goldRates } = useDemoData();
  const { currentStaff } = useStaffSession();

  const application = applications.find(
    (a) => a.reference.toUpperCase() === (reference || '').toUpperCase()
  );

  const existingAssessment = assessments.find(
    (a) => a.applicationReference.toUpperCase() === (reference || '').toUpperCase()
  );

  const latestVersion: GoldAssessmentVersion | undefined = existingAssessment
    ? existingAssessment.versions[existingAssessment.activeVersion - 1] || existingAssessment.versions[existingAssessment.versions.length - 1]
    : undefined;

  const isReassessment = latestVersion?.status === 'Returned' || application?.status === 'Returned for Correction' || application?.status === 'Returned for Gold Correction';

  // Base 24K price selection (can choose latest benchmark)
  const [referencePrice, setReferencePrice] = useState<number>(
    latestVersion?.referencePricePerGram || settings.goldReferencePrice24K
  );

  // Multi-article state initialized from existing assessment or application
  const [articles, setArticles] = useState<Array<Omit<GoldArticleItem, 'netGoldWeight' | 'purityFactor' | 'ratePerGram' | 'valuation'> & {
    netGoldWeight?: number;
    purityFactor?: number;
    ratePerGram?: number;
    valuation?: number;
  }>>(() => {
    if (latestVersion?.articles && latestVersion.articles.length > 0) {
      return latestVersion.articles;
    }
    if (application?.goldDetails.articles && application.goldDetails.articles.length > 0) {
      return application.goldDetails.articles;
    }
    // Default initial single article from application declared gold
    return [
      {
        id: 'ART-1',
        category: application?.goldDetails.category || 'Bangles',
        description: `${application?.goldDetails.purity || '22K'} ${application?.goldDetails.category || 'Bangles'}`,
        itemsCount: application?.goldDetails.itemsCount || 1,
        grossWeight: application?.goldDetails.declaredWeight || 45,
        stoneWeight: 0,
        otherDeductions: 0,
        purity: application?.goldDetails.purity || '22K',
        hallmarkNumber: 'BIS-916-MH',
      },
    ];
  });

  // Assaying test checkboxes
  const [acidTestPassed, setAcidTestPassed] = useState(latestVersion?.acidTestPassed ?? true);
  const [touchstoneTestPassed, setTouchstoneTestPassed] = useState(latestVersion?.touchstoneTestPassed ?? true);
  const [hallmarkVerified, setHallmarkVerified] = useState(latestVersion?.hallmarkVerified ?? true);
  const [notes, setNotes] = useState(latestVersion?.notes || 'Physical weighing, ultrasonic clean, and nitric acid streak test completed.');

  // Live calculated summary across all articles
  const summary = calculateMultiArticleSummary(articles, referencePrice, settings.maxLtvRatio);

  const categories: JewelleryCategory[] = [
    'Bangles',
    'Necklace',
    'Chain',
    'Earrings',
    'Rings',
    'Coins',
    'Other Jewellery',
  ];

  const purities: GoldPurity[] = ['18K', '20K', '22K', '24K'];

  const addArticle = () => {
    const nextId = `ART-${articles.length + 1}`;
    setArticles([
      ...articles,
      {
        id: nextId,
        category: 'Rings',
        description: '22K Gold Article',
        itemsCount: 1,
        grossWeight: 10,
        stoneWeight: 0,
        otherDeductions: 0,
        purity: '22K',
        hallmarkNumber: 'BIS-916',
      },
    ]);
  };

  const removeArticle = (index: number) => {
    if (articles.length === 1) {
      alert('At least one gold article is required for appraisal.');
      return;
    }
    setArticles(articles.filter((_, idx) => idx !== index));
  };

  const updateArticle = (index: number, field: string, value: any) => {
    setArticles((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  if (!application) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Application Not Found</h2>
        <p className="text-xs text-gray-500">No application matches reference {reference}</p>
        <Link to="/staff/weighter/queue" className="text-xs font-bold text-[#701525] hover:underline">
          Return to Weighing Queue
        </Link>
      </div>
    );
  }

  const handleSaveDraft = () => {
    if (!currentStaff) return;
    saveAssessmentDraft(
      {
        recordedBy: currentStaff.id,
        recordedByName: currentStaff.fullName,
        jewelleryCategory: articles[0]?.category || 'Bangles',
        itemsCount: summary.articles.reduce((sum, a) => sum + a.itemsCount, 0),
        grossWeight: summary.totalGrossWeight,
        stoneWeight: summary.totalStoneWeight,
        otherNonGoldWeight: summary.totalOtherDeductions,
        netGoldWeight: summary.totalNetGoldWeight,
        purity: articles[0]?.purity || '22K',
        referencePricePerGram: referencePrice,
        purityFactor: PURITY_FACTORS[articles[0]?.purity || '22K'],
        purityGoldRate: referencePrice * PURITY_FACTORS[articles[0]?.purity || '22K'],
        estimatedGoldValue: summary.totalValuation,
        estimatedEligibleAmount: summary.maxEligibleLoan,
        ltvRatioPercent: Math.round(settings.maxLtvRatio * 100),
        articles: summary.articles,
        acidTestPassed,
        touchstoneTestPassed,
        hallmarkVerified,
        notes,
      },
      application.reference,
      currentStaff
    );
    alert('Assessment draft saved locally in browser storage.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff) return;
    if (summary.totalNetGoldWeight <= 0) {
      alert('Total net gold weight must be greater than zero.');
      return;
    }
    if (summary.totalGrossWeight <= summary.totalStoneWeight + summary.totalOtherDeductions) {
      alert('Total deductions cannot equal or exceed gross weight.');
      return;
    }

    submitAssessment(
      {
        recordedBy: currentStaff.id,
        recordedByName: currentStaff.fullName,
        jewelleryCategory: articles[0]?.category || 'Bangles',
        itemsCount: summary.articles.reduce((sum, a) => sum + a.itemsCount, 0),
        grossWeight: summary.totalGrossWeight,
        stoneWeight: summary.totalStoneWeight,
        otherNonGoldWeight: summary.totalOtherDeductions,
        netGoldWeight: summary.totalNetGoldWeight,
        purity: articles[0]?.purity || '22K',
        referencePricePerGram: referencePrice,
        purityFactor: PURITY_FACTORS[articles[0]?.purity || '22K'],
        purityGoldRate: referencePrice * PURITY_FACTORS[articles[0]?.purity || '22K'],
        estimatedGoldValue: summary.totalValuation,
        estimatedEligibleAmount: summary.maxEligibleLoan,
        ltvRatioPercent: Math.round(settings.maxLtvRatio * 100),
        articles: summary.articles,
        acidTestPassed,
        touchstoneTestPassed,
        hallmarkVerified,
        notes,
      },
      application.reference,
      currentStaff
    );

    alert(`Appraisal v${(existingAssessment?.versions.length || 0) + 1} locked! Application ${application.reference} dispatched to Credit Officer.`);
    navigate('/staff/weighter/queue');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/staff/weighter/queue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#701525] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Weighing Queue</span>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Multi-Article Gold Valuation & Assay
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Application: <strong className="font-mono text-gray-900">{application.reference}</strong> · Borrower: <strong>{application.customer.fullName}</strong>
          </p>
        </div>

        {isReassessment && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Returned for Correction:</strong> {latestVersion?.returnReason || 'Please re-verify deductions and purity.'}
            </span>
          </div>
        )}
      </div>

      {/* Customer & Declared Gold Info Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[10px] text-gray-400 block uppercase font-bold">Borrower</span>
          <span className="font-bold text-gray-900 text-sm">{application.customer.fullName}</span>
          <span className="text-[11px] text-gray-500 block">{application.customer.mobile}</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 block uppercase font-bold">Declared Intake</span>
          <span className="font-bold text-gray-900 text-sm">{application.goldDetails.itemsCount} {application.goldDetails.category}</span>
          <span className="text-[11px] text-gray-500 block">{formatGrams(application.goldDetails.declaredWeight)} declared ({application.goldDetails.purity})</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 block uppercase font-bold">Loan Requested</span>
          <span className="font-bold text-[#701525] text-sm">{formatCurrency(application.loanPreferences.requestedAmount)}</span>
          <span className="text-[11px] text-gray-500 block">{application.loanPreferences.preferredTenureMonths}M · {application.loanPreferences.repaymentMethod}</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 block uppercase font-bold">Assay Benchmark (24K)</span>
          <select
            value={referencePrice}
            onChange={(e) => setReferencePrice(Number(e.target.value))}
            className="w-full mt-0.5 p-1.5 rounded-lg border border-gray-300 font-bold text-xs bg-white text-gray-800"
          >
            {goldRates.map((gr) => (
              <option key={gr.id} value={gr.rate24K}>
                {gr.effectiveDate}: ₹{gr.rate24K.toLocaleString('en-IN')}/g
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Multi-Article Items Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-[#701525]">Gold Articles Breakdown</h3>
              <p className="text-xs text-gray-500">
                Itemize individual jewellery pieces, stone weight deductions, and karat assay readings.
              </p>
            </div>
            <button
              type="button"
              onClick={addArticle}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF8F3] text-[#701525] border border-[#C9A45C]/40 hover:bg-[#FAF8F3]/80 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#C9A45C]" />
              <span>Add Another Gold Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {articles.map((item, index) => {
              const gross = Math.max(0, Number(item.grossWeight) || 0);
              const stone = Math.max(0, Number(item.stoneWeight) || 0);
              const other = Math.max(0, Number(item.otherDeductions) || 0);
              const net = Math.max(0, gross - (stone + other));
              const factor = PURITY_FACTORS[item.purity] || (22 / 24);
              const val = net * referencePrice * factor;

              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-gray-200 bg-[#FAF8F3]/60 space-y-3 relative transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#701525] flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#C9A45C]" />
                      Article #{index + 1}
                    </span>
                    {articles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArticle(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Remove article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => updateArticle(index, 'category', e.target.value as JewelleryCategory)}
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-gray-700">Item Description / Hallmarking Tags</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateArticle(index, 'description', e.target.value)}
                        placeholder="e.g. 22K Hallmarked Antique Bangle with red synthetic stones"
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Pieces</label>
                      <input
                        type="number"
                        min="1"
                        value={item.itemsCount}
                        onChange={(e) => updateArticle(index, 'itemsCount', Number(e.target.value))}
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Gross Wt (g)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.grossWeight}
                        onChange={(e) => updateArticle(index, 'grossWeight', Number(e.target.value))}
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Stones (g)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.stoneWeight}
                        onChange={(e) => updateArticle(index, 'stoneWeight', Number(e.target.value))}
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Wax/Other (g)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.otherDeductions}
                        onChange={(e) => updateArticle(index, 'otherDeductions', Number(e.target.value))}
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Purity</label>
                      <select
                        value={item.purity}
                        onChange={(e) => updateArticle(index, 'purity', e.target.value as GoldPurity)}
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white font-bold text-[#701525]"
                      >
                        {purities.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 bg-white p-2 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 block font-bold">Net Gold / Val</span>
                      <p className="font-black text-gray-900 text-xs truncate">{formatGrams(net)}</p>
                      <p className="font-bold text-[#701525] text-[11px] truncate">{formatCurrency(Math.round(val))}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregate Valuation Summary Card */}
          <div className="p-5 rounded-2xl bg-[#701525] text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFE59E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFE59E]" />
                Aggregate Physical Gold Valuation Summary
              </span>
              <span className="text-[11px] text-gray-300">
                {summary.articles.length} article(s) · Benchmark: ₹{referencePrice.toLocaleString('en-IN')}/g (24K)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-gray-300 uppercase block font-medium">Total Gross Wt</span>
                <span className="text-lg font-black">{formatGrams(summary.totalGrossWeight)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-gray-300 uppercase block font-medium">Deductions</span>
                <span className="text-lg font-black text-rose-300">
                  {formatGrams(summary.totalStoneWeight + summary.totalOtherDeductions)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-gray-300 uppercase block font-medium">Net Fine Gold</span>
                <span className="text-lg font-black text-[#FFE59E]">{formatGrams(summary.totalNetGoldWeight)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-[10px] text-gray-300 uppercase block font-medium">Appraised Value</span>
                <span className="text-lg font-black">{formatCurrency(Math.round(summary.totalValuation))}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/20 border border-[#FFE59E]/40 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#FFE59E] uppercase block font-bold">Max Eligible Loan</span>
                <span className="text-lg font-black text-[#FFE59E]">
                  {formatCurrency(Math.round(summary.maxEligibleLoan))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Assaying & Verification Evidence */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-bold text-gray-900">Technical Assay Protocols & Assayer Certification</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2.5 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 cursor-pointer">
              <input
                type="checkbox"
                checked={acidTestPassed}
                onChange={(e) => setAcidTestPassed(e.target.checked)}
                className="w-4 h-4 text-[#701525] rounded accent-[#701525]"
              />
              <div>
                <span className="font-bold text-gray-900 block">Acid Touchstone Test Passed</span>
                <span className="text-[10px] text-gray-500">Nitric acid streak confirmed</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 cursor-pointer">
              <input
                type="checkbox"
                checked={touchstoneTestPassed}
                onChange={(e) => setTouchstoneTestPassed(e.target.checked)}
                className="w-4 h-4 text-[#701525] rounded accent-[#701525]"
              />
              <div>
                <span className="font-bold text-gray-900 block">Ultrasonic / Density Checked</span>
                <span className="text-[10px] text-gray-500">No hollow core / wax filling</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 cursor-pointer">
              <input
                type="checkbox"
                checked={hallmarkVerified}
                onChange={(e) => setHallmarkVerified(e.target.checked)}
                className="w-4 h-4 text-[#701525] rounded accent-[#701525]"
              />
              <div>
                <span className="font-bold text-gray-900 block">BIS Hallmark Stamp Verified</span>
                <span className="text-[10px] text-gray-500">Laser-engraved karat mark verified</span>
              </div>
            </label>
          </div>

          <div className="space-y-1 pt-2">
            <label className="font-bold text-gray-700">Appraiser Notes & Test Remarks</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-gray-300"
              placeholder="Record any scratch marks, soldered clasps, or gemstone weight considerations..."
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#E8E2D8]">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Appraisal Draft</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/staff/weighter/queue"
              className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FFE59E]" />
              <span>Lock & Submit Appraisal to Credit Desk</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
