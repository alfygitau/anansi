import { useState, useEffect } from "react";
import {
  BellOff,
  ChevronRight,
  Info,
  ShieldCheck,
  CreditCard,
  Zap,
  AlertCircle,
  ShieldAlert,
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotifications,
  readNotifications,
} from "../../sdks/notifications/notification";
import { useToast } from "../../contexts/ToastProvider";
import { useQuery, useMutation } from "react-query";
import NotificationsLoader from "../../skeletons/NotificationsLoader";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getNotificationIcon = (module) => {
    switch (module) {
      case "request_guarantor":
        return <ShieldCheck className="text-amber-500" size={18} />;
      case "payment":
        return <CreditCard className="text-emerald-500" size={18} />;
      case "security":
        return <ShieldAlert className="text-rose-500" size={18} />;
      default:
        return <Info className="text-secondary" size={18} />;
    }
  };

  const { mutate: readMyNotification } = useMutation({
    mutationKey: ["read notification"],
    mutationFn: (id) => readNotifications(id),
    onSuccess: () => {
      refetchNotifications();
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { isFetching, refetch: refetchNotifications } = useQuery({
    queryKey: ["get notifications"],
    queryFn: async () => {
      const response = await getNotifications();
      return response.data.data;
    },
    onSuccess: (data) => {
      setNotifications(data);
      if (data.length > 0 && !selectedNotification) {
        setSelectedNotification(data[0]);
      }
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
    const diffInMs = Math.abs(end - start);

    const mins = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleSelectNotification = (item) => {
    setSelectedNotification(item);
    if (!item.is_read) {
      readMyNotification(item?.id);
    }
  };

  return (
    <>
      {isFetching ? (
        <NotificationsLoader />
      ) : (
        <div className="max-w-6xl sm:px-4 mx-auto">
          {/* HEADER CONTROLS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-primary flex items-center gap-3">
                Notifications Center
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {unreadCount} New
                  </span>
                )}
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1">
                Manage and review your account alerts with live context inspector.
              </p>
            </div>
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-fit">
              <TabButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
                label="All Activity"
              />
              <TabButton
                active={filter === "unread"}
                onClick={() => setFilter("unread")}
                label="Unread"
              />
            </div>
          </div>

          {/* ASYMMETRIC SPLIT SCREEN VIEW (40/60 Split -> lg:col-span-4 and lg:col-span-8) */}
          {filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN: MASTER LIST (Narrower ~40% Width -> Col Span 4) */}
              <div className="lg:col-span-4 bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex flex-col h-[600px]">
                <div className="pb-4 mb-3 flex items-center justify-between border-b border-slate-100 shrink-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Inbox Stream ({filteredNotifications.length})
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => {
                      const isSelected = selectedNotification?.id === notification.id;
                      const timeLabel = getTimeDifference(
                        notification?.createdAt,
                        notification?.updatedAt
                      );

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => handleSelectNotification(notification)}
                          className={`group flex items-start gap-3.5 p-3.5 cursor-pointer transition-all duration-200 rounded-2xl border ${
                            isSelected
                              ? "bg-blue-50/70 border-blue-200 shadow-sm"
                              : !notification.is_read
                              ? "bg-slate-50 border-slate-200 hover:bg-slate-100/60"
                              : "bg-white border-slate-100 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="relative shrink-0 mt-0.5">
                            <div
                              className={`flex items-center justify-center size-10 rounded-full transition-colors ${
                                !notification.is_read
                                  ? "bg-blue-100/80 text-primary"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {getNotificationIcon(notification.module)}
                            </div>
                            {!notification.is_read && (
                              <span className="absolute -top-0.5 -right-0.5 block size-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                            )}
                          </div>

                          <div className="flex-grow min-w-0">
                            <p
                              className={`text-xs leading-snug line-clamp-2 ${
                                !notification.is_read
                                  ? "font-bold text-slate-900"
                                  : "font-medium text-slate-700"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1 block">
                              {timeLabel}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT COLUMN: DETAIL INSPECTOR (Wider ~60% Width -> Col Span 8) */}
              <div className="lg:col-span-8 h-[600px]">
                {selectedNotification ? (
                  <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex flex-col h-full justify-between">
                    
                    {/* Top Content Group */}
                    <div className="space-y-6">
                      {/* Detail Top Metadata Bar */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-blue-50 flex items-center justify-center text-primary border border-blue-100">
                            {getNotificationIcon(selectedNotification.module)}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Module Context
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 capitalize">
                              {selectedNotification.module?.replace("_", " ")} Alert
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <Clock size={13} />
                          <span>{new Date(selectedNotification?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Core Message Detail Panel */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Full Message Details
                        </h3>
                        <div className="max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                          <p className="text-slate-800 text-sm leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100 font-medium">
                            {selectedNotification.message}
                          </p>
                        </div>
                      </div>

                      {/* Contextual Action Center Based on Module */}
                      <div className="space-y-2.5 pt-1">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Required Actions & Shortcuts
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                          {selectedNotification.module === "request_guarantor" && (
                            <button
                              onClick={() => navigate("/guarantorship")}
                              className="bg-primary hover:bg-primary/90 text-white font-medium text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all shadow-sm"
                            >
                              <span>Review Request</span>
                              <ExternalLink size={15} />
                            </button>
                          )}

                          {selectedNotification.module === "payment" && (
                            <button
                              onClick={() => navigate("/all-loans")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all shadow-sm"
                            >
                              <span>View Ledger</span>
                              <ExternalLink size={15} />
                            </button>
                          )}

                          <button
                            onClick={() => navigate("/loan-products")}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all"
                          >
                            <span>Apply for Loan</span>
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* System Metadata Verification Footer */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-4 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Log ID: #{selectedNotification.id}</span>
                      </div>
                      <span className="font-semibold text-slate-400 uppercase text-[9px]">
                        Secure Ledger
                      </span>
                    </div>

                  </div>
                ) : (
                  <div className="h-full bg-white rounded-[32px] border border-slate-200/60 flex items-center justify-center text-center p-8">
                    <p className="text-slate-400 text-sm font-medium">
                      Select a notification from the left list to inspect its contents.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
};

/* --- SUB-COMPONENTS --- */
const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
      active
        ? "bg-white text-primary shadow-sm"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
  </button>
);

const EmptyState = () => (
  <div className="h-[520px] bg-white border border-slate-200/60 rounded-[32px] flex flex-col justify-center items-center text-center p-8">
    <div className="relative mb-6 flex items-center justify-center">
      <div className="absolute w-24 h-24 bg-slate-50 rounded-full animate-ping opacity-60 duration-1000" />
      <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center">
        <BellOff size={32} className="text-slate-300" strokeWidth={1.5} />
      </div>
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        Your inbox is clear
      </h3>
      <p className="text-slate-400 font-medium text-sm leading-relaxed">
        No records found matching this category filter.
      </p>
    </div>
  </div>
);

export default Notifications;