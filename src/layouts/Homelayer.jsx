import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";

const Homelayer = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <Navigation />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Homelayer;
