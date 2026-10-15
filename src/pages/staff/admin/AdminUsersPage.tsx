import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { DemoStaffUser, StaffRole } from '../../../types';
import { ROLE_LABELS } from '../../../utils/permissions';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Building2, 
  Check, 
  X, 
  Edit3, 
  Lock,
  AlertCircle
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { staffUsers, createStaffUser, updateStaffUser, toggleStaffActive, branches } = useDemoData();
  const { currentStaff } = useStaffSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<DemoStaffUser | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<StaffRole>('GOLD_WEIGHTER');
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'BR-MUM-01');

  const filteredStaff = staffUsers.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openCreateModal = () => {
    setEditingStaff(null);
    setFullName('');
    setRole('GOLD_WEIGHTER');
    setEmail('');
    setBranchId(branches[0]?.id || 'BR-MUM-01');
    setModalOpen(true);
  };

  const openEditModal = (staff: DemoStaffUser) => {
    setEditingStaff(staff);
    setFullName(staff.fullName);
    setRole(staff.role);
    setEmail(staff.email);
    setBranchId(staff.branchId);
    setModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const branchObj = branches.find((b) => b.id === branchId);
    const branchName = branchObj ? branchObj.name : 'Mumbai Fort Flagship';

    if (editingStaff) {
      updateStaffUser(editingStaff.id, {
        fullName,
        role,
        email,
        branchId,
        branchName,
      });
    } else {
      createStaffUser({
        fullName,
        role,
        email,
        branchId,
        branchName,
        isActive: true,
      });
    }

    setModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    if (!currentStaff) return;
    const res = toggleStaffActive(id, currentStaff.id);
    if (!res.success) {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Staff & Personnel Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Assign employee roles, manage branch allocations, and control operational permissions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Demo Staff Account</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee by name, ID (e.g. ADMIN001), or email..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Roles ({staffUsers.length})</option>
          <option value="SUPER_ADMIN">Super Administrator</option>
          <option value="CASHIER">Cashier</option>
          <option value="GOLD_WEIGHTER">Gold Weighter</option>
          <option value="FINAL_ENTRY_OPERATOR">Final Entry Operator</option>
          <option value="BRANCH_MANAGER">Branch Manager</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Role & Permissions</th>
                <th className="py-3 px-4">Allocated Branch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                    {staff.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{staff.fullName}</p>
                    <p className="text-[10px] text-gray-400">{staff.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF3E0] text-[#701525] border border-[#E8E2D8]">
                      {ROLE_LABELS[staff.role]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {staff.branchName}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        staff.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${staff.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {staff.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(staff)}
                      className="p-1.5 text-gray-500 hover:text-[#701525] rounded-lg hover:bg-gray-100"
                      title="Edit employee details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(staff.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        staff.isActive
                          ? 'text-rose-700 border-rose-200 hover:bg-rose-50'
                          : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {staff.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit Staff */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-[#E8E2D8] p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="font-bold text-sm text-[#701525]">
                {editingStaff ? `Edit Employee ${editingStaff.id}` : 'Create New Demo Staff User'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Full Legal Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohini Deshmukh"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Corporate Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohini@aurum.example"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Assigned Operational Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525] font-semibold"
                >
                  <option value="SUPER_ADMIN">Super Administrator</option>
                  <option value="CASHIER">Cashier & Disbursements</option>
                  <option value="GOLD_WEIGHTER">Gold Appraiser / Weighter</option>
                  <option value="FINAL_ENTRY_OPERATOR">Final Entry Operator</option>
                  <option value="BRANCH_MANAGER">Branch Manager</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Branch Allocation *</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525] font-semibold"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
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
                  Save Employee Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
