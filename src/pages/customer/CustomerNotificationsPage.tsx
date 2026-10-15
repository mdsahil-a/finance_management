import React from 'react';
import { useDemoData } from '../../context/DemoDataContext';
import { formatDateTime } from '../../utils/formatters';
import { Bell, Check, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerNotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useDemoData();

  const customerNotifs = notifications.filter(
    (n) => n.targetRole === 'CUSTOMER' || n.targetRole === 'ALL'
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Activity Notifications</h2>
          <p className="text-xs text-gray-500">Live operational events and status transitions regarding your gold loan files.</p>
        </div>

        {customerNotifs.length > 0 && (
          <button
            onClick={() => markAllNotificationsAsRead('CUSTOMER')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {customerNotifs.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Bell className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500">No notifications in your inbox.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customerNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.read
                  ? 'bg-white border-gray-200 text-gray-600'
                  : 'bg-amber-50/60 border-amber-200 text-gray-900 shadow-2xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#A71930] shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-gray-900">{n.title}</h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {formatDateTime(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 pl-4">{n.message}</p>
                {n.link && (
                  <div className="pl-4 pt-1">
                    <Link
                      to={n.link}
                      className="text-[11px] font-bold text-[#701525] hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
