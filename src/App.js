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

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={<Registration />} />
        <Route path="/onboarding/verify-email" element={<VerifyEmail />} />
        <Route path="/onboarding/verify-mobile" element={<VerifyMobile />} />
        <Route
          path="/onboarding/account-success"
          element={<AccountSuccess />}
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
        </Route>

        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/loan-products" element={<LoanProducts />} />
        <Route path="/all-loans" element={<MyLoans />} />
        <Route path="/all-loan-applications" element={<LoanApplications />} />
        <Route path="/loan-details" element={<LoanDetails />} />
        <Route path="/loan-eligibility" element={<EligibilityCheck />} />
        <Route path="/apply-loan" element={<ApplyLoan />} />
        <Route path="/add-guarantor" element={<AddGuarantors />} />
        <Route
          path="/normal-loan-terms-conditions"
          element={<NormalLoanTermsConditions />}
        />
        <Route
          path="/loan-application-details"
          element={<LoanApplicationDetails />}
        />
      </Routes>
    </>
  );
}

export default App;
