import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components";


const Dashboard = () => {
  return (
    <div className="relative">
    <Suspense fallback={<></>}>
      <Outlet />
      <Navbar />
    </Suspense>
    </div>
  );
};

export default Dashboard;
