import {
  Zap,
  GraduationCap,
  Stethoscope,
  Briefcase,
  Leaf,
  Building2,
} from "lucide-react";

export const myLoanProducts = [
  {
    id: "prod-001",
    name: "Instant M-Pesa Loan",
    description:
      "Get immediate liquidity for your daily needs. Disbursed directly to your mobile wallet within minutes.",
    icon: Zap,
    rate: "1.5%",
    maxAmount: "50,000",
    period: "1 Month",
    color: "#17C6C6", // Anansi Teal
  },
  {
    id: "prod-002",
    name: "Development Loan Plus",
    description:
      "Our flagship product for long-term growth. Ideal for building projects and significant capital investments.",
    icon: Building2,
    rate: "12%",
    maxAmount: "5,000,000",
    period: "48 Months",
    color: "#042159", // Anansi Dark Blue
  },
  {
    id: "prod-003",
    name: "Elimu (Education) Loan",
    description:
      "Invest in your future. Specialized financing for school fees, tuition, and professional certifications.",
    icon: GraduationCap,
    rate: "10%",
    maxAmount: "500,000",
    period: "12 Months",
    color: "#8B5CF6", // Purple
  },
  {
    id: "prod-004",
    name: "Business Biashara Loan",
    description:
      "Scale your enterprise with inventory financing and working capital tailored for SMEs.",
    icon: Briefcase,
    rate: "13.5%",
    maxAmount: "2,000,000",
    period: "24 Months",
    color: "#F59E0B", // Amber
  },
  {
    id: "prod-005",
    name: "Kilimo (Agri) Credit",
    description:
      "Supporting farmers with seasonal financing for seeds, fertilizers, and modern equipment.",
    icon: Leaf,
    rate: "9%",
    maxAmount: "300,000",
    period: "9 Months",
    color: "#10B981", // Green
  },
  {
    id: "prod-006",
    name: "Emergency Afya Loan",
    description:
      "Quick access to funds for medical bills and unexpected health emergencies.",
    icon: Stethoscope,
    rate: "11%",
    maxAmount: "100,000",
    period: "6 Months",
    color: "#EF4444", // Red
  },
];

export const myLoanApplications = [
  {
    reference: "APP-8429-X",
    title: "Development Loan Plus",
    date: "12 May 2026",
    amount: "KES 150,000",
    status: "PENDING",
  },
  {
    reference: "APP-3104-Y",
    title: "School Fees Loan",
    date: "08 May 2026",
    amount: "KES 45,000",
    status: "UNDER REVIEW",
  },
  {
    reference: "APP-2291-Z",
    title: "Emergency Medical Cover",
    date: "01 May 2026",
    amount: "KES 20,000",
    status: "DISBURSED",
  },
];

export const allLoans = [
  {
    title: "Asset Finance (Vehicle)",
    id: "LN-V-2024-08",
    amount: "KES 1,200,000",
    balance: "KES 840,250",
    status: "Active",
    statusColor: "#17C6C6",
    maturityDate: "15 Dec 2028",
  },
  {
    title: "Business Growth Loan",
    id: "LN-B-2025-11",
    amount: "KES 500,000",
    balance: "KES 12,400",
    status: "Arrears",
    statusColor: "#EF4444",
    maturityDate: "10 Jun 2026",
  },
];

export const allMyLoans = [
  {
    title: "Asset Finance (Vehicle)",
    id: "LN-V-2024-08",
    amount: "KES 1,200,000",
    balance: "KES 840,250",
    status: "Active",
    statusColor: "#17C6C6", // Anansi Teal
    maturityDate: "15 Dec 2028",
  },
  {
    title: "Business Growth Loan",
    id: "LN-B-2025-11",
    amount: "KES 500,000",
    balance: "KES 12,400",
    status: "Arrears",
    statusColor: "#EF4444", // Red
    maturityDate: "10 Jun 2026",
  },
  {
    title: "Emergency Salary Advance",
    id: "LN-S-2026-04",
    amount: "KES 45,000",
    balance: "KES 45,000",
    status: "Pending",
    statusColor: "#F59E0B", // Amber
    maturityDate: "01 May 2026",
  },
  {
    title: "Elimu (Education) Loan",
    id: "LN-E-2023-01",
    amount: "KES 150,000",
    balance: "KES 0",
    status: "Fully Paid",
    statusColor: "#10B981", // Emerald
    maturityDate: "15 Jan 2024",
  },
];
