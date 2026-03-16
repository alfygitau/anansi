import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage/Homepage";
import AccountDetails from "./pages/accounts/AccountDetails";
import LoanProducts from "./pages/products/LoanProducts";
import MyLoans from "./pages/loans/Loans";
import LoanApplications from "./pages/loan-applications/LoanApplications";
import LoanDetails from "./pages/loans/LoanDetails";
import LoanApplicationDetails from "./pages/loan-applications/LoanApplicationDetails";
import EligibilityCheck from "./pages/loan-applications/LoanEligibility";
import ApplyLoan from "./pages/loan-applications/ApplyLoan";
import AddGuarantors from "./pages/loan-applications/AddGuarantor";
import NormalLoanTermsConditions from "./pages/terms-conditions/NormalLoanTerms";
import Login from "./pages/auth/login";
import Registration from "./pages/onboarding/Register";
import VerifyEmail from "./pages/onboarding/VerifyEmail";
import VerifyMobile from "./pages/onboarding/VerifyMobile";
import AccountSuccess from "./pages/onboarding/AccountSuccess";
import IdentityVerification from "./pages/onboarding/VerifyIdentity";
import ReviewIdentity from "./pages/onboarding/ReviewIdentity";
import FacialIdentity from "./pages/onboarding/FacialIdentity";
import ProfileInformation from "./pages/onboarding/PersonalInformation";
import NextOfKin from "./pages/onboarding/NextOfKin";
import TermsAndConditions from "./pages/onboarding/OnboardingTermsConditions";
import OnboardingLayer from "./layouts/OnboardingLayer";
import Statements from "./pages/statements/Statements";
import Homelayer from "./layouts/Homelayer";
import ProfilePage from "./pages/profile/Profile";
import OtpVerification from "./pages/auth/OneTimePassword";
import Notifications from "./pages/notifications/Notifications";
import Guarantorship from "./pages/guarantorship/Guarantorship";
import ForgotPassword from "./pages/forget-password/ForgetEmail";
import ForgotOTPVerification from "./pages/forget-password/ForgotPasswordVerification";
import CreateNewPassword from "./pages/forget-password/SetPassword";
import ProceedOnboarding from "./pages/continue-onboarding/ContinueOnboarding";
import AdminOtpVerification from "./pages/admin-customer/VerifyCustomer";
import CreateUsername from "./pages/admin-customer/CreateUsername";
import SetNewPassword from "./pages/admin-customer/SetNewPassword";
import HelpPage from "./pages/onboarding/OnboardingSupport";
import ManualIdEntry from "./pages/onboarding/ManualIdEntry";
import SelfieQRCode from "./pages/onboarding/ScanQrCode";
import MobileSelfieLanding from "./pages/kyc-selfie/LandingSelfie";
import SelfieCapture from "./pages/kyc-selfie/SelfieCapture";
import FinishCapture from "./pages/kyc-selfie/FinishCapture";
import CaptureFailed from "./pages/kyc-selfie/FailedCapture";
import LoanCalculator from "./pages/calculator/LoanCalculator";
import HelpSupport from "./pages/help-support/Help";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/one-time-password" element={<OtpVerification />} />
        <Route path="/" element={<Registration />} />
        <Route path="/onboarding/verify-email" element={<VerifyEmail />} />
        <Route path="/onboarding/verify-mobile" element={<VerifyMobile />} />

        <Route
          path="/admin-customer/verify"
          element={<AdminOtpVerification />}
        />

        <Route path="/" element={<Homelayer />}>
          <Route
            path="/admin-customer/create-username"
            element={<CreateUsername />}
          />
          <Route
            path="/admin-customer/set-password"
            element={<SetNewPassword />}
          />
        </Route>

        <Route
          path="/onboarding/account-success"
          element={<AccountSuccess />}
        />

        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/set-new-password" element={<CreateNewPassword />} />
        <Route
          path="/auth/forgot-password-verification"
          element={<ForgotOTPVerification />}
        />

        <Route path="/" element={<OnboardingLayer />}>
          <Route path="/onboarding/next-of-kin" element={<NextOfKin />} />
          <Route
            path="/onboarding/terms-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            path="/onboarding/personal-information"
            element={<ProfileInformation />}
          />
          <Route
            path="/onboarding/facial-identity"
            element={<FacialIdentity />}
          />
          <Route
            path="/onboarding/review-identity"
            element={<ReviewIdentity />}
          />
          <Route
            path="/onboarding/verify-identity"
            element={<IdentityVerification />}
          />
          <Route path="/onboarding/continue" element={<ProceedOnboarding />} />
          <Route path="/onboarding/help" element={<HelpPage />} />
          <Route path="/onboarding/scan-qrcode" element={<SelfieQRCode />} />
          <Route
            path="/onboarding/id-manual-entry"
            element={<ManualIdEntry />}
          />
        </Route>

        <Route path="/" element={<Homelayer />}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/account-details/:accountId/:accountNumber"
            element={<AccountDetails />}
          />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/loan-products" element={<LoanProducts />} />
          <Route path="/all-loans" element={<MyLoans />} />
          <Route path="/all-loan-applications" element={<LoanApplications />} />
          <Route path="/loan-details" element={<LoanDetails />} />
          <Route path="/loan-eligibility" element={<EligibilityCheck />} />
          <Route path="/apply-loan" element={<ApplyLoan />} />
          <Route path="/add-guarantor" element={<AddGuarantors />} />
          <Route path="/statements" element={<Statements />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/guarantorship" element={<Guarantorship />} />
          <Route
            path="/normal-loan-terms-conditions"
            element={<NormalLoanTermsConditions />}
          />
          <Route
            path="/loan-application-details"
            element={<LoanApplicationDetails />}
          />
        </Route>

        <Route
          path="/kyc-selfie/selfie-capture"
          element={<MobileSelfieLanding />}
        />
        <Route path="/kyc-selfie/take-photo" element={<SelfieCapture />} />
        <Route
          path="/kyc-selfie/selfie-capture-success"
          element={<FinishCapture />}
        />
        <Route
          path="/kyc-selfie/selfie-capture-fail"
          element={<CaptureFailed />}
        />
      </Routes>
    </>
  );
}

export default App;
