import React, { useState } from 'react';
import { FAQS_DATA } from '../../data/initialData';
import { FAQItem } from '../../types';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export const FAQsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-6']);

  const categories = [
    'ALL',
    'Basics',
    'Purity & Valuation',
    'Interest & Charges',
    'Repayment',
    'Application & Tracking',
    'Privacy & Demo',
  ];

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701525]/10 text-[#701525] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#701525] font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          Comprehensive answers covering gold purity evaluation, illustrative interest benchmarks, repayment models, and prototype workflow rules.
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-md space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords (e.g. LTV, purity, repayment, demo)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#701525] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'ALL' ? `All Questions (${FAQS_DATA.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List Accordion */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8] space-y-3">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No Matching FAQs Found</h3>
          <p className="text-xs text-gray-500">
            No questions matched your search criteria. Try a different query or reset filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#701525] text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden transition-all shadow-2xs hover:border-[#C9A45C]"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-[#701525]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF3E0] text-[#701525] shrink-0 border border-[#E8E2D8]">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#701525] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
