import { useState } from "react";
import {
  Zap,
  GraduationCap,
  Car,
  Smartphone,
  Home,
  Plane,
  HeartPulse,
  Briefcase,
  Search,
  Filter,
  Info,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const allProducts = [
    {
      id: "prod_01",
      name: "Flash Emergency",
      cat: "Instant Loan",
      description:
        "Get instant funds for urgent bills and unexpected expenses within minutes.",
      icon: Zap,
      rate: "1.5%",
      maxAmount: "50,000",
      period: "1 Month",
      color: "#F59E0B",
    },
    {
      id: "prod_02",
      name: "Mortgage Plus",
      cat: "Housing",
      description:
        "Flexible financing options to help you own your dream home with ease.",
      icon: Home,
      rate: "9.0%",
      maxAmount: "15,000,000",
      period: "240 Months",
      color: "#042159",
    },
    {
      id: "prod_03",
      name: "Asset Financing",
      cat: "Vehicle",
      description:
        "Drive your ambition with low-interest loans for new and used vehicles.",
      icon: Car,
      rate: "11.5%",
      maxAmount: "3,500,000",
      period: "60 Months",
      color: "#3B82F6",
    },
    {
      id: "prod_04",
      name: "Edu-Advance",
      cat: "Education",
      description:
        "Invest in your future with specialized loans covering tuition and supplies.",
      icon: GraduationCap,
      rate: "8.5%",
      maxAmount: "500,000",
      period: "12 Months",
      color: "#8B5CF6",
    },
    {
      id: "prod_05",
      name: "SME Growth",
      cat: "Business",
      description:
        "Scale your business operations with working capital and equipment loans.",
      icon: Briefcase,
      rate: "13.0%",
      maxAmount: "10,000,000",
      period: "48 Months",
      color: "#10B981",
    },
    {
      id: "prod_06",
      name: "Medi-Shield",
      cat: "Medical",
      description:
        "Comprehensive medical loans to ensure health emergencies never catch you off guard.",
      icon: HeartPulse,
      rate: "7.0%",
      maxAmount: "1,200,000",
      period: "24 Months",
      color: "#EF4444",
    },
    {
      id: "prod_07",
      name: "Global Explorer",
      cat: "Travel",
      description:
        "Finance your vacations or business trips with competitive travel rates.",
      icon: Plane,
      rate: "10.0%",
      maxAmount: "800,000",
      period: "18 Months",
      color: "#06B6D4",
    },
    {
      id: "prod_08",
      name: "Gadget Loan",
      cat: "Electronics",
      description:
        "Upgrade your tech today and pay in easy monthly installments.",
      icon: Smartphone,
      rate: "15.0%",
      maxAmount: "150,000",
      period: "6 Months",
      color: "#6366F1",
    },
    {
      id: "prod_09",
      name: "Agri-Green",
      cat: "Agriculture",
      description:
        "Specially designed loans for farmers to purchase seeds, tools, and equipment.",
      icon: Leaf,
      rate: "6.5%",
      maxAmount: "2,000,000",
      period: "36 Months",
      color: "#15803D",
    },
    {
      id: "prod_10",
      name: "Credit Protector",
      cat: "Insurance",
      description:
        "Refinance existing high-interest debts into one manageable monthly payment.",
      icon: ShieldCheck,
      rate: "12.0%",
      maxAmount: "5,000,000",
      period: "72 Months",
      color: "#475569",
    },
  ];

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header Section */}
        <header className="py-4">
          <h1 className="text-3xl font-black tracking-tight">Loan Products</h1>
          <p className="text-slate-400 text-sm mt-2">
            Whether you're growing your business, funding an education, or
            achieving personal goals, we have options tailored to your needs.
          </p>
          {/* Modern Search Bar */}
          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search for a loan (e.g. Emergency)..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-colors shadow-sm">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <DetailedProductCard
              key={product.id}
              product={product}
              onApply={() => navigate("/loan-eligibility")}
            />
          ))}
        </div>

        {/* Empty State for Search */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">
              No products match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Sub-Component: ProductCard --- */

const DetailedProductCard = ({ product, onApply }) => {
  const {
    name,
    description,
    icon: Icon,
    rate,
    maxAmount,
    period,
    color = "#042159",
  } = product;

  return (
    <div className="group bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all overflow-hidden mb-6">
      {/* Top Section: Icon, Rate, and Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          {/* Main Icon Box */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: `${color}1A`, color: color }} // 1A = 10% opacity
          >
            <Icon size={28} strokeWidth={1.5} />
          </div>

          {/* Rate Badge */}
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            {rate} P.A
          </span>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2 group-hover:text-secondary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Info Grid (Mimicking the Flutter _buildInfoColumn) */}
        <div className="flex items-center justify-between py-4 border-t border-slate-50">
          <InfoColumn label="MAX AMOUNT" value={`KES ${maxAmount}`} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="TENURE" value={period} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="REPAYMENT" value="Monthly" />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
          <Info size={12} />
          <span>Terms & Conditions apply</span>
        </div>

        <button
          onClick={onApply}
          className="px-6 py-2.5 bg-[#042159] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-900/10 hover:bg-slate-800 transition-all active:scale-95"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

// Helper Sub-component for the Info Grid
const InfoColumn = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
      {label}
    </span>
    <span className="text-xs font-bold text-slate-700">{value}</span>
  </div>
);

export default LoanProducts;
