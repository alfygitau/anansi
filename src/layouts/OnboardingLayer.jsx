import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

const OnboardingLayer = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-[1300px] sm:w-[95%] bg-gray-50 mx-auto bg-white">
        <Navbar />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default OnboardingLayer;
