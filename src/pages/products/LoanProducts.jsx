import { useState } from "react";
import { Briefcase, Search, Filter, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoanTerms from "../../components/loan-terms-conditions/TermsAndCobditions";
import { useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { getLoanProducts } from "../../sdks/loans/loans";
import LoanProductsLoader from "../../skeletons/LoanProductsLoader";

const LoanProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showLoanTerms, setShowLoanTerms] = useState(false);
  const { showToast } = useToast();
  const [loanProducts, setLoanProducts] = useState([]);

  const { isFetching: loadingProducts } = useQuery({
    queryKey: ["explore products"],
    queryFn: async () => {
      const response = await getLoanProducts();
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanProducts(data);
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

  const filteredProducts = loanProducts.filter((p) =>
    p?.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <LoanTerms
        isOpen={showLoanTerms}
        onClose={() => setShowLoanTerms(false)}
      />

      <div className="min-h-screen bg-slate-50 text-primary pb-20">
        <div className="max-w-6xl sm:px-4 mx-auto">
          {/* Header Section */}
          <header className="py-2 mb-3">
            <h1 className="text-2xl font-medium tracking-tight">
              Loan Products
            </h1>
            <p className="text-slate-400 text-sm">
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
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {loadingProducts ? (
              <LoanProductsLoader />
            ) : filteredProducts?.length > 0 ? (
              filteredProducts?.map((product) => (
                <DetailedProductCard
                  key={product.id}
                  product={product}
                  onApply={() => navigate("/loan-eligibility")}
                  onTerms={() => setShowLoanTerms(true)}
                  onNavigate={() => navigate(`/loan-products/${product?.id}`)}
                />
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-medium">
                  No products match your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* --- Sub-Component: ProductCard --- */
const DetailedProductCard = ({ product, onApply, onTerms, onNavigate }) => {
  const {
    product_name,
    description,
    interest_rate,
    max_amount,
    max_period,
    interest_key,
  } = product;

  return (
    <div
      onClick={onNavigate}
      className="group bg-white cursor-pointer rounded-[32px] border border-slate-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all overflow-hidden mb-6"
    >
      {/* Top Section: Icon, Rate, and Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          {/* Main Icon Box */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: `#0421591A`, color: "#042159" }}
          >
            <Briefcase size={28} strokeWidth={1.5} />
          </div>

          {/* Rate Badge */}
          <span className="text-[11px] font-medium uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            {Number(interest_rate)?.toFixed(1)}% {interest_key}
          </span>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2 group-hover:text-secondary transition-colors">
            {product_name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Info Grid (Mimicking the Flutter _buildInfoColumn) */}
        <div className="flex items-center justify-between py-4 border-t border-slate-50">
          <InfoColumn label="MAX AMOUNT" value={`KES ${max_amount}`} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="TENURE" value={max_period} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="REPAYMENT" value="Monthly" />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <div
          onClick={(event) => {
            event.stopPropagation();
            onTerms();
          }}
          className="flex items-center cursor-pointer gap-1 text-[10px] font-semibold text-slate-400"
        >
          <Info size={12} />
          <span>Terms & Conditions apply</span>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onApply();
          }}
          className="px-6 py-2.5 bg-[#042159] text-white text-[11px] font-medium uppercase tracking-widest rounded-xl shadow-lg shadow-blue-900/10 hover:bg-secondary transition-all active:scale-95"
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
    <span className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
      {label}
    </span>
    <span className="text-xs font-bold text-slate-700">{value}</span>
  </div>
);

export default LoanProducts;
