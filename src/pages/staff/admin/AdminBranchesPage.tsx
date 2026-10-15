import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { DemoBranch } from '../../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Edit3, 
  Clock, 
  X,
  CheckCircle2
} from 'lucide-react';

export const AdminBranchesPage: React.FC = () => {
  const { branches, createBranch, updateBranch, toggleBranchActive } = useDemoData();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<DemoBranch | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [operatingHours, setOperatingHours] = useState('Mon - Sat: 9:30 AM - 6:30 PM');
  const [managerName, setManagerName] = useState('');

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingBranch(null);
    setName('');
    setCity('');
    setState('');
    setAddress('');
    setPhone('+91 22 2200 0000 (Demo)');
    setEmail('branch@aurum.example');
    setOperatingHours('Mon - Sat: 9:30 AM - 6:30 PM');
    setManagerName('New Manager');
    setModalOpen(true);
  };

  const openEditModal = (b: DemoBranch) => {
    setEditingBranch(b);
    setName(b.name);
    setCity(b.city);
    setState(b.state);
    setAddress(b.address);
    setPhone(b.phone);
    setEmail(b.email);
    setOperatingHours(b.operatingHours);
    setManagerName(b.managerName);
    setModalOpen(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      updateBranch(editingBranch.id, {
        name,
        city,
        state,
        address,
        phone,
        email,
        operatingHours,
        managerName,
      });
    } else {
      createBranch({
        name,
        city,
        state,
        address,
        phone,
        email,
        operatingHours,
        isActive: true,
        managerName,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Branch Directory & Vault Locations
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure physical branch presence, managers, and service territories.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Demo Branch</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by branch name, code, or city..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Branch Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Branch Manager</th>
                <th className="py-3 px-4">Operating Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                    {branch.code}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{branch.name}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-xs">{branch.address}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {branch.city}, {branch.state}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {branch.managerName}
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                    {branch.operatingHours}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        branch.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(branch)}
                      className="p-1.5 text-gray-500 hover:text-[#701525] rounded-lg hover:bg-gray-100"
                      title="Edit branch"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleBranchActive(branch.id)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                      {branch.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-[#E8E2D8] p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="font-bold text-sm text-[#701525]">
                {editingBranch ? `Edit ${editingBranch.name}` : 'Create New Demo Branch'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Branch Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pune Shivaji Nagar Branch"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Physical Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Landmark, Pincode"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Branch Manager *</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Vinayak Jadhav"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Demo Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#701525] hover:bg-[#58101d]"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
