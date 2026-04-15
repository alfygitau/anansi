import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  LayoutGrid,
  Wallet,
  BadgePercent,
  UserCircle,
  ShieldCheck,
  Zap,
  Lock,
} from "lucide-react";

const routeLabels = {
  onboarding: "Membership",
  "personal-information": "Bio Data",
  "next-of-kin": "Beneficiaries",
  "verify-identity": "Identity Guard",
  "facial-identity": "Biometrics",
  "kyc-selfie": "Security Sync",
  "take-photo": "Live Capture",
  "id-manual-entry": "Manual Entry",
  // Dashboard & Treasury
  home: "Dashboard",
  "account-details": "Treasury",
  statements: "Ledger",
  notifications: "Activity",
  profile: "Member Profile",
  // Loans & Credit Build-up
  "loan-products": "Products",
  "apply-loan": "Apply Loan",
  "add-guarantor": "Add Guarantor",
  "loan-eligibility": "Assessment",
  "collateral-registry": "Asset Registry",
  "loan-calculator": "Estimator",
  "all-loans": "Portfolio",
  "all-loan-applications": "Applications",
  guarantorship: "Guarantorship",
};

const getHierarchy = (pathnames) => {
  const hierarchy = [
    { label: "Dashboard", to: "/home", icon: <LayoutGrid size={14} /> },
  ];

  const isLoanFlow = pathnames.some((p) =>
    [
      "loan-products",
      "apply-loan",
      "add-guarantor",
      "loan-eligibility",
      "collateral-registry",
      "all-loans",
    ].includes(p),
  );

  if (isLoanFlow) {
    hierarchy.push({
      label: "Products",
      to: "/loan-products",
      icon: <BadgePercent size={14} />,
    });

    const isDeepLoanAction = pathnames.some((p) =>
      ["apply-loan", "add-guarantor", "collateral-registry"].includes(p),
    );

    if (isDeepLoanAction) {
      hierarchy.push({
        label: "Apply Loan",
        to: "/apply-loan",
        icon: <Wallet size={14} />,
      });
    }
  }

  const isOnboarding = pathnames.some((p) =>
    ["onboarding", "kyc-selfie"].includes(p),
  );
  if (isOnboarding) {
    hierarchy.push({
      label: "Membership",
      to: "/onboarding/continue",
      icon: <ShieldCheck size={14} />,
    });
  }

  const lastSegment = pathnames[pathnames.length - 1];
  const currentLabels = hierarchy.map((i) =>
    i.label.toLowerCase().replace(/\s/g, "-"),
  );
  const cleanLastSegment = lastSegment?.split(":")[0];

  if (
    lastSegment &&
    !currentLabels.includes(cleanLastSegment) &&
    lastSegment !== "home"
  ) {
    hierarchy.push({
      label: routeLabels[lastSegment] || lastSegment.replace(/-/g, " "),
      to: null,
      icon: <UserCircle size={14} />,
    });
  }

  return hierarchy;
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const excludedRoots = [
    "auth",
    "login",
    "register",
    "verify-email",
    "account-success",
  ];
  if (pathnames.length === 0 || excludedRoots.includes(pathnames[0]))
    return null;

  const items = getHierarchy(pathnames);

  return (
    <nav className="w-full bg-gray-50 py-1 z-40 transition-all">
      <div className="max-w-6xl mx-auto py-1 flex items-center gap-4">
        {/* Modern "Live System" Badge */}
        <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-primary/5 text-primary border border-primary/10 shadow-inner">
          <Zap size={16} fill="currentColor" className="opacity-70" />
        </div>

        <ol className="flex items-center flex-nowrap overflow-x-auto no-scrollbar gap-1 py-1">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center flex-shrink-0"
                >
                  {index > 0 && (
                    <ChevronRight
                      size={12}
                      className="mx-2 text-slate-400 flex-shrink-0"
                      strokeWidth={3}
                    />
                  )}

                  {item.to && !isLast ? (
                    <Link
                      to={item.to}
                      className="group flex items-center gap-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
                    >
                      <span className="text-slate-400 group-hover:text-primary transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{item.icon}</span>
                      <span className="text-[13px] font-black text-primary uppercase tracking-[0.15em]">
                        {item.label}
                      </span>
                    </div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
