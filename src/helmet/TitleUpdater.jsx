import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const baseTitle = "Anansi Sacco";
    const path = location.pathname;

    const routeTitles = {
      // Auth & Registration
      "/": "Create Account",
      "/auth/login": "Login",
      "/auth/one-time-password": "OTP Verification",
      "/auth/forgot-password": "Forgot Password",
      "/auth/set-new-password": "Create New Password",
      "/auth/forgot-password-verification": "Reset Verification",

      // Onboarding Flow
      "/onboarding/verify-email": "Email Verification",
      "/onboarding/verify-mobile": "Mobile Verification",
      "/onboarding/account-success": "Account Created",
      "/onboarding/next-of-kin": "Next of Kin Details",
      "/onboarding/terms-conditions": "Terms & Conditions",
      "/onboarding/personal-information": "Personal Profile",
      "/onboarding/facial-identity": "Selfie Identity",
      "/onboarding/review-identity": "Review Identity",
      "/onboarding/verify-identity": "Identity Verification",
      "/onboarding/continue": "Resume Onboarding",
      "/onboarding/help": "Onboarding Support",
      "/onboarding/scan-qrcode": "Scan QR Code",
      "/onboarding/use-webcamera": "Webcam Capture",
      "/onboarding/email-link": "Verification Link",
      "/onboarding/id-manual-entry": "Manual ID Entry",

      // Core Dashboard & Home
      "/home": "Dashboard",
      "/profile": "My Profile",
      "/help-support": "Help & Support",
      "/loan-calculator": "Loan Calculator",
      "/loan-products": "Loan Products",
      "/all-loans": "My Loans",
      "/all-loan-applications": "Loan Applications",
      "/loan-details": "Loan Details",
      "/loan-eligibility": "Eligibility Check",
      "/apply-loan": "Apply for Loan",
      "/add-guarantor": "Add Guarantors",
      "/add-statements": "Financial Statements",
      "/collateral-registry": "Collateral Registry",
      "/statements": "Account Statements",
      "/notifications": "Notifications",
      "/guarantorship": "Guarantorship",
      "/normal-loan-terms-conditions": "Loan Terms",
      "/loan-application-details": "Application Details",

      // Admin & Customer Setup
      "/admin-customer/verify": "Customer Verification",
      "/admin-customer/create-username": "Create Username",
      "/admin-customer/set-password": "Set Password",

      // Mobile KYC Selfie Flow
      "/kyc-selfie/selfie-capture": "Selfie Landing",
      "/kyc-selfie/take-photo": "Capture Selfie",
      "/kyc-selfie/selfie-capture-success": "Capture Success",
      "/kyc-selfie/selfie-capture-fail": "Capture Failed",
    };

    // 1. Check for exact match
    let pageTitle = routeTitles[path];

    // 2. Fallback for Dynamic Routes (Paths with IDs/Params)
    if (!pageTitle) {
      if (path.startsWith("/account-details")) {
        pageTitle = "Account Details";
      } else {
        pageTitle = "Secure Banking"; // Ultimate fallback
      }
    }

    // 3. Set the actual browser title
    document.title = `${pageTitle} | ${baseTitle}`;
  }, [location]);

  return null;
};

export default TitleUpdater;
