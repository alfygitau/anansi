import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import {
  getCustomerById,
  sendWelcomeEmail,
  updateCustomerStatuses,
} from "../../sdks/customer/customer";
import {
  createAccountSavings,
  createAccountShares,
} from "../../sdks/accounts/accounts";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [welcomeEmail, setWelcomeEmail] = useState("");
  const { auth } = useAuth();
  const { showToast } = useToast();

  useQuery({
    queryKey: ["get customer by id"],
    queryFn: async () => {
      const response = await getCustomerById(auth?.user?.id);
      return response.data.data;
    },
    onSuccess: (data) => {
      setWelcomeEmail(data?.email);
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

  const { mutate: sharesMutate } = useMutation({
    mutationKey: ["create shares ac"],
    mutationFn: () =>
      createAccountShares(
        auth?.user?.firstname,
        auth?.user?.lastname,
        auth?.user?.id,
      ),
    onSuccess: () => {
      showToast({
        title: "Terms Accepted",
        type: "success",
        position: "top-right",
        description:
          "Your agreement to the membership terms and privacy policy has been securely recorded.",
      });
      navigate("/home");
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

  const { mutate: savingsMutate } = useMutation({
    mutationKey: ["create savings ac"],
    mutationFn: () =>
      createAccountSavings(
        auth?.user?.firstname,
        auth?.user?.lastname,
        auth?.user?.id,
      ),
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { mutate: welcomeEmailMutate } = useMutation({
    mutationKey: ["welcomeEmail"],
    mutationFn: () => sendWelcomeEmail(welcomeEmail),
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { mutate: updateCustomerMutate, isLoading } = useMutation({
    mutationKey: ["update client"],
    mutationFn: () => updateCustomerStatuses(auth?.user?.id),
    onSuccess: async () => {
      await Promise.all([savingsMutate(), sharesMutate()]);
      await welcomeEmailMutate();
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

  const handleFinish = async () => {
    await updateCustomerMutate();
  };

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-screen relative">
      {/* Sidebar - 20% of 85% layout */}
      <div className="w-[25%] hidden lg:block md:block">
        <MyProgress
          currentTitle="Terms and conditions"
          currentSubtitle="Review and Accept"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:w-[75%] sm:px-5 overflow-y-auto">
        <div className="w-full">
          <h2 className="text-[#042159] text-xl font-bold mb-3">
            General Terms and Conditions
          </h2>
          {/* Scrollable Terms Box */}
          <div className="h-[550px] sm:h-[650px] bg-gray-50 rounded-xl border border-gray-200 overflow-y-auto p-[15px] md:p-[15px]">
            <div className="prose prose-sm text-gray-700">
              <h1 className="text-lg font-bold text-[#042159] mb-4">
                Anansi Sacco User General Terms & Conditions
              </h1>

              <TermsContent />

              <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-bold text-[#042159] mb-2">
                  Contact Information
                </h3>
                <p>Email: anansisacco@gmail.com</p>
                <p>Phone: +254 750 633 766</p>
                <p>Address: Ngong Lane Plaza, Racecourse Nairobi.</p>
              </div>
            </div>
          </div>

          {/* Accept Checkbox */}
          <div
            className="flex items-center gap-3 my-8 group cursor-pointer"
            onClick={() => setChecked(!checked)}
          >
            <div
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-[#042159] border-[#042159]" : "border-gray-300 bg-white group-hover:border-blue-400"}`}
            >
              {checked && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <p className="text-gray-800 text-[14px] font-medium select-none">
              I have read and agreed to the terms and conditions
            </p>
          </div>

          {/* Submit Button */}
          <button
            disabled={!checked || isLoading}
            onClick={handleFinish}
            className={`w-full h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
              checked && !isLoading
                ? "bg-[#042159] text-white shadow-xl shadow-blue-900/20 hover:scale-[1.01] active:scale-[0.99]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
            Agree & Finish
          </button>
        </div>
      </div>
    </div>
  );
};

const TermsContent = () => {
  return (
    <div className="w-full">
      <p className="text-gray-700 mb-6">
        These Terms and Conditions (“Agreement”) govern your use of the Anansi
        Sacco Mobile and Web Application (the “Application” or “Platform”). By
        downloading, accessing, or using the Application, you agree to be bound
        by these terms. If you do not agree with any part of these terms, please
        do not use the Application.
      </p>
      <p className="text-gray-700 mb-6">
        By using our services, you confirm that all information provided is
        accurate, complete, and truthful to the best of your knowledge. Anansi
        Technology reserves the right to verify the information and take
        appropriate action, including suspension or termination of services, if
        any false, misleading, or incomplete details are detected. Anansi
        Technology is not liable for any consequences resulting from inaccurate
        or fraudulent information submitted by users.
      </p>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        1. Introduction
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Anansi Sacco is a member-based Savings and Credit Cooperative (SACCO)
          providing financial services to its members, which may include
          savings, loans, and other services available via the mobile and web
          platforms.
        </li>
        <li>
          The Application allows registered users to access services provided by
          Anansi Sacco, including but not limited to: Shares account, Savings
          account balances, making deposits, applying for loans, and more.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        2. Eligibility
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          To use the Application, you must be a registered member of Anansi
          Sacco. By using the Application, you confirm that you are at least 18
          years of age and have the legal capacity to enter into a binding
          agreement.
        </li>
        <li>
          Users must provide accurate and up-to-date information during
          registration. You are responsible for ensuring the accuracy of your
          account information.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        3. Account Registration
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Account Creation: To access the services on the Application, you must
          create an account by providing the required information, including
          your membership number, full name, email address, phone number, and
          other relevant details as requested by the SACCO.
        </li>
        <li>
          Security: You are responsible for maintaining the confidentiality of
          your login credentials, including your username and password. You
          agree to immediately notify SOJREL SACCO of any unauthorized use of
          your account.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        4. Use of the Application
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Access to Services: By using the Application, you can perform the
          following activities, subject to availability and eligibility:
          <ul className="list-inside pl-4 space-y-1">
            <li>View your account balance and transaction history.</li>
            <li>Apply for loans and make repayments.</li>
            <li>Make deposits.</li>
            <li>Access SACCO notices and announcements.</li>
            <li>Other services as specified by Anansi Sacco.</li>
          </ul>
        </li>
        <li>
          Mobile/Internet Access: You are responsible for ensuring you have a
          compatible device and internet connection to access the Application.
          Anansi Sacco is not liable for any connectivity or device issues that
          may prevent you from using the Platform.
        </li>
        <li>
          Prohibited Use: You agree not to:
          <ul className="list-inside pl-4 space-y-1">
            <li>
              Use the Application for any unlawful or unauthorized purposes.
            </li>
            <li>
              Attempt to gain unauthorized access to the Application, other
              users' accounts, or Anansi Sacco’s systems.
            </li>
            <li>
              Interfere with or disrupt the Application’s services, servers, or
              networks.
            </li>
            <li>
              Transmit malware, viruses, or any other harmful code through the
              Application.
            </li>
          </ul>
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        5. Transactions and Services
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Loan Applications: By using the Application, you can apply for loans
          from Anansi Sacco. All loan applications are subject to approval based
          on the SACCO’s lending criteria. You agree to provide accurate and
          complete information in your loan applications.
        </li>
        <li>
          Transactions: All financial transactions, including deposits,
          transfers, and loan repayments, made through the Application are
          processed in accordance with Anansi Sacco’s internal policies. You
          agree to adhere to all transaction limits and fees as outlined in the
          Application.
        </li>
        <li>
          Fees: Some services offered through the Application may attract fees
          (e.g., loan processing fees, late payment penalties, etc.). The
          applicable fees will be displayed in the Application and/or on your
          account statement. You agree to pay these fees promptly.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        6. Privacy and Data Protection
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Personal Information: By using the Application, you consent to the
          collection, use, and processing of your personal data as outlined in
          Anansi Sacco’s Privacy Policy. Your data will be used to provide the
          services and for other purposes as detailed in the policy.
        </li>
        <li>
          Security: Anansi Sacco employs reasonable measures to protect the
          security of your personal information. However, you understand that no
          system is completely secure, and the SACCO cannot guarantee the
          absolute security of your data.
        </li>
        <li>
          Third-Party Services: The Application may include links to third-party
          websites or services that are not controlled by Anansi Sacco. We are
          not responsible for the content, privacy policies, or practices of any
          third-party websites.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        7. Termination and Suspension of Access
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Termination by You: You may deactivate your account at any time by
          notifying Anansi Sacco. Upon deactivation, your access to the
          Application will be revoked, but any pending transactions or
          obligations will remain valid.
        </li>
        <li>
          Termination by Anansi Sacco: Anansi Sacco reserves the right to
          suspend or terminate your account at any time for reasons including
          but not limited to:
          <ul className="list-inside pl-4 space-y-1">
            <li>Violation of these Terms and Conditions.</li>
            <li>Fraudulent activities or suspicious behavior.</li>
            <li>Non-payment of fees or loan defaults.</li>
            <li>Failure to maintain accurate account information.</li>
          </ul>
        </li>
        <li>
          Effect of Termination: Upon termination of your account, you will no
          longer have access to the services provided by the Application. Any
          outstanding obligations (e.g., loan repayments) will remain due and
          payable.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        8. Limitation of Liability
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          General Limitation: To the maximum extent permitted by law, Anansi
          Sacco will not be liable for any indirect, incidental, special, or
          consequential damages arising from your use or inability to use the
          Application.
        </li>
        <li>
          Service Interruptions: Anansi Sacco does not guarantee uninterrupted
          or error-free access to the Application. In the event of system
          downtime or maintenance, the SACCO will make reasonable efforts to
          restore services as quickly as possible but will not be held
          responsible for any losses incurred during this time.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        9. Amendments to the Terms
      </h3>
      <p className="text-gray-700 mb-4">
        Anansi Sacco reserves the right to modify, update, or amend these Terms
        and Conditions at any time. You will be notified of any material changes
        via email or in-app notifications. Your continued use of the Application
        after such modifications will constitute your acceptance of the updated
        terms.
      </p>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        10. Dispute Resolution
      </h3>
      <ul className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Informal Resolution: Any disputes arising out of or in connection with
          the use of the Application should first be addressed through informal
          negotiations with Anansi Sacco.
        </li>
        <li>
          Arbitration: If a dispute cannot be resolved informally, it will be
          referred to binding arbitration in accordance with the laws of Kenya.
        </li>
      </ul>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        11. Governing Law
      </h3>
      <p className="text-gray-700 mb-4">
        This Agreement will be governed by and construed in accordance with the
        laws of Kenya, without regard to its conflict of law principles.
      </p>

      <h3 className="text-[15px] font-semibold text-bluemain mb-4">
        12. Contact Information
      </h3>
      <p className="text-gray-700 mb-4">
        If you have any questions or concerns about these Terms and Conditions
        or the Application, please contact us at:
      </p>
    </div>
  );
};

export default TermsAndConditions;
