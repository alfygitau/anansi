import React, { useState } from "react";
import {
  Building2,
  TrendingUp,
  Zap,
  Stethoscope,
  GraduationCap,
  Car,
  Smartphone,
  ShoppingBag,
  Home,
  Plane,
  HeartPulse,
  Briefcase,
  Rocket,
  Landmark,
  Users,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const allProducts = [
    {
      id: 1,
      label: "Development",
      icon: <Building2 />,
      cat: "Business",
      rate: "12%",
    },
    {
      id: 2,
      label: "Jijenge",
      icon: <TrendingUp />,
      cat: "Investment",
      rate: "10%",
    },
    { id: 3, label: "Flash Loan", icon: <Zap />, cat: "Emergency", rate: "5%" },
    {
      id: 4,
      label: "Emergency",
      icon: <Stethoscope />,
      cat: "Emergency",
      rate: "8%",
    },
    {
      id: 5,
      label: "Education",
      icon: <GraduationCap />,
      cat: "Personal",
      rate: "7%",
    },
    {
      id: 6,
      label: "Asset Finance",
      icon: <Car />,
      cat: "Business",
      rate: "11%",
    },
    {
      id: 7,
      label: "Mobile Loan",
      icon: <Smartphone />,
      cat: "Personal",
      rate: "6%",
    },
    {
      id: 8,
      label: "Biashara",
      icon: <ShoppingBag />,
      cat: "Business",
      rate: "13%",
    },
    {
      id: 9,
      label: "Home Refurb",
      icon: <Home />,
      cat: "Personal",
      rate: "9%",
    },
    {
      id: 10,
      label: "Travel Loan",
      icon: <Plane />,
      cat: "Personal",
      rate: "10%",
    },
    {
      id: 11,
      label: "Health Cover",
      icon: <HeartPulse />,
      cat: "Emergency",
      rate: "4%",
    },
    {
      id: 12,
      label: "Start-up Cap",
      icon: <Rocket />,
      cat: "Business",
      rate: "14%",
    },
    {
      id: 13,
      label: "Salary Advance",
      icon: <Briefcase />,
      cat: "Personal",
      rate: "5%",
    },
    {
      id: 14,
      label: "Land Purchase",
      icon: <Landmark />,
      cat: "Investment",
      rate: "11%",
    },
    {
      id: 15,
      label: "Chama Loan",
      icon: <Users />,
      cat: "Investment",
      rate: "9%",
    },
  ];

  const filteredProducts = allProducts.filter((p) =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="py-4">
          <h1 className="text-3xl font-black tracking-tight">
            Loan Products
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Explore our flexible credit facilities tailored for you.
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
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#4DB8E4]/20 focus:border-[#4DB8E4] outline-none transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#042159] transition-colors shadow-sm">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigate={() => navigate("/loan-eligibility")}
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

const ProductCard = ({ product, navigate }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group cursor-pointer relative overflow-hidden">
    {/* Decorative Background Icon */}
    <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
      {React.cloneElement(product.icon, { size: 100 })}
    </div>

    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#042159] group-hover:bg-[#4DB8E4] group-hover:text-white transition-all duration-300">
        {React.cloneElement(product.icon, { size: 28, strokeWidth: 1.5 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-[#4DB8E4] bg-[#4DB8E4]/5 px-3 py-1 rounded-full">
        {product.rate} P.A
      </span>
    </div>

    <div className="relative z-10">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
        {product.cat}
      </p>
      <h3 className="text-lg font-bold group-hover:text-[#4DB8E4] transition-colors">
        {product.label}
      </h3>
    </div>

    <div className="mt-6 flex items-center justify-between relative z-10">
      <span className="text-xs font-bold text-slate-400 group-hover:text-[#042159] transition-colors flex items-center gap-1">
        Learn More <ArrowRight size={14} />
      </span>
      <button
        onClick={navigate}
        className="px-4 py-2 bg-[#042159] text-white text-[10px] font-black uppercase tracking-widest rounded-[7px] shadow-lg shadow-blue-900/10 hover:bg-[#4DB8E4] transition-all active:scale-95"
      >
        Apply Now
      </button>
    </div>
  </div>
);

export default LoanProducts;
