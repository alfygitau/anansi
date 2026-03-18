import { useState } from "react";
import {
  BellOff,
  ChevronRight,
  Info,
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowUpRight,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotifications } from "../../sdks/notifications/Notifications";
import { useToast } from "../../contexts/ToastProvider";
import { useQuery } from "react-query";
import NotificationsLoader from "../../skeletons/NotificationsLoader";

const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getNotificationIcon = (module) => {
    switch (module) {
      case "request_guarantor":
        return <ShieldCheck className="text-amber-500" size={20} />;
      case "payment":
        return <CreditCard className="text-emerald-500" size={20} />;
      case "security":
        return <ShieldAlert className="text-rose-500" size={20} />;
      default:
        return <Info className="text-[#4DB8E4]" size={20} />;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["get notifications"],
    queryFn: async () => {
      const response = await getNotifications();
      return response.data.data;
    },
    onSuccess: (data) => {
      setNotifications(data);
    },
    onError: (error) => {
      showToast({
        title: "Notification glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const getTimeDifference = (createdAt, updatedAt) => {
    const start = new Date(createdAt);
    const end = new Date(updatedAt);

    // Difference in milliseconds
    const diffInMs = Math.abs(end - start);

    // Conversions
    const mins = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {isLoading ? (
        <NotificationsLoader />
      ) : (
        <div className="max-w-6xl sm:px-4 mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: NOTIFICATION FEED (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#042159] flex items-center gap-3">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] px-2 py-1 rounded-full">
                        {unreadCount} NEW
                      </span>
                    )}
                  </h1>
                  <p className="text-slate-400 text-sm font-medium">
                    Keep track of your Anansi account activity.
                  </p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                  <TabButton
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                    label="All"
                  />
                  <TabButton
                    active={filter === "unread"}
                    onClick={() => setFilter("unread")}
                    label="Unread"
                  />
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-blue-900/5 overflow-hidden">
                {filteredNotifications.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {filteredNotifications.map((notification, index) => {
                        const timeLabel = getTimeDifference(
                          notification?.createdAt,
                          notification?.updatedAt,
                        );
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`group flex items-center gap-4 p-6 cursor-pointer transition-all hover:bg-slate-50/80 ${
                              !notification.is_read ? "bg-blue-50/30" : ""
                            }`}
                          >
                            {/* Icon Container */}
                            <div
                              className={`shrink-0 p-3 rounded-2xl shadow-sm ${!notification.is_read ? "bg-white" : "bg-slate-50"}`}
                            >
                              {getNotificationIcon(notification.module)}
                            </div>

                            {/* Content Container - Added min-w-0 to prevent pushing the chevron out */}
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                <p
                                  className={`text-sm truncate md:whitespace-normal ${!notification.is_read ? "font-bold text-[#042159]" : "text-slate-600"}`}
                                >
                                  {notification.message}
                                </p>
                                <span className="shrink-0 text-[10px] font-black text-slate-300 uppercase whitespace-nowrap pt-1">
                                  {timeLabel}
                                </span>
                              </div>
                            </div>

                            {/* Chevron - Added shrink-0 to ensure it stays visible */}
                            <div className="shrink-0 transition-transform group-hover:translate-x-1">
                              <ChevronRight
                                size={18}
                                className="text-slate-300 group-hover:text-[#4DB8E4] transition-colors"
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: QUICK ACTIONS & INFO (4/12) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* QUICK ACTIONS CARD */}
              <div className="bg-[#042159] rounded-[32px] p-6 text-white shadow-xl shadow-blue-900/20">
                <div className="flex items-center gap-3 mb-6">
                  <Zap size={20} className="text-[#4DB8E4]" />
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    Quick Actions
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <ActionButton
                    label="Apply for Loan"
                    icon={<ArrowUpRight size={16} />}
                    primary
                  />
                  <ActionButton label="Deposit Shares" />
                  <ActionButton label="Manage Guarantors" />
                </div>
              </div>

              {/* STATUS SUMMARY */}
              <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">
                  Account Health
                </h3>
                <div className="space-y-4">
                  <HealthItem
                    label="Verified Identity"
                    status="Completed"
                    color="text-emerald-500"
                  />
                  <HealthItem
                    label="Loan Eligibility"
                    status="High"
                    color="text-[#4DB8E4]"
                  />
                  <HealthItem
                    label="Active Obligations"
                    status="2 Loans"
                    color="text-amber-500"
                  />
                </div>
              </div>

              {/* DISCLAIMER / POLICY CARD */}
              <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-200/50">
                <div className="flex items-center gap-2 mb-3 text-[#042159]">
                  <AlertCircle size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Privacy Notice
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Notifications are kept for 90 days. Anansi uses end-to-end
                  encryption for all financial alerts.
                  <span className="block mt-2 font-bold text-[#042159] underline cursor-pointer">
                    View Data Policy
                  </span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
};

/* --- MINI SUB-COMPONENTS --- */

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? "bg-white text-[#042159] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
  >
    {label}
  </button>
);

const ActionButton = ({ label, icon, primary }) => (
  <button
    className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${primary ? "bg-[#4DB8E4] text-white hover:bg-[#3ba8d3]" : "bg-white/10 text-white hover:bg-white/20"}`}
  >
    {label} {icon}
  </button>
);

const HealthItem = ({ label, status, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-medium text-slate-600">{label}</span>
    <span className={`text-xs font-black uppercase tracking-tighter ${color}`}>
      {status}
    </span>
  </div>
);

const EmptyState = () => (
  <div className="h-[600px] flex flex-col justify-center items-center text-center">
    <BellOff size={40} className="mx-auto text-slate-200 mb-4" />
    <p className="text-slate-400 font-bold">No notifications to show.</p>
  </div>
);

export default Notifications;
