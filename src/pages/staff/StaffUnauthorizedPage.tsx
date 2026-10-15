import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStaffSession } from '../../context/StaffSessionContext';
import { ROLE_LABELS, ROLE_DEFAULT_ROUTES } from '../../utils/permissions';
import { ShieldAlert, ArrowLeft, Users } from 'lucide-react';

export const StaffUnauthorizedPage: React.FC = () => {
  const { currentStaff } = useStaffSession();
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-red-200 shadow-xl max-w-md w-full space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-bold text-red-900 font-display">
          Access Denied (403 Forbidden)
        </h1>

        <p className="text-xs text-gray-600 leading-relaxed">
          Your current authenticated staff role{' '}
          {currentStaff ? (
            <strong className="text-gray-900">({ROLE_LABELS[currentStaff.role]})</strong>
          ) : (
            ''
          )}{' '}
          does not possess the operational permissions required to view or execute actions on this screen.
        </p>

        <div className="pt-2 flex flex-col gap-2">
          {currentStaff && (
            <button
              onClick={() => navigate(ROLE_DEFAULT_ROUTES[currentStaff.role])}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#701525] hover:bg-[#58101d] transition-colors"
            >
              Return to My Role Dashboard
            </button>
          )}

          <Link
            to="/staff/login"
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Switch to Another Demo Staff Role
          </Link>
        </div>
      </div>
    </div>
  );
};
