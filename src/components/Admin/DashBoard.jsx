import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import SearchAndFilter from "./components/Search";

export default function DashBoard() {
  const dispatch = useDispatch();

  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [userTotal, setUserTotal] = useState(0);

  useEffect(() => {
    // Fake API calls to fetch data
    setUserTotal(246); // Replace with actual API call
    setTotalSales(123); // Replace with actual API call
    setTotalRevenue(45678); // Replace with actual API call
    setPendingOrders(12); // Replace with actual API call
  }, [dispatch]);

  return (
    <div>
      <SearchAndFilter />
      <div className="bg-white rounded-md p-4 m-4 h-[60vh] overflow-hidden">
        <a className="block py-2.5 w-full font-semibold text-xl">Dashboard</a>

        <div className="totals grid grid-cols-4 gap-4 p-4">
          {/* Hình chữ nhật 1 */}
          <div className="bg-blue-400 rounded-md p-4 flex flex-row items-center justify-between">
            <div className="rounded-full bg-white w-16 h-16 flex items-center justify-center">
              <i className="las la-users text-3xl text-blue-500"></i>
            </div>
            <div className="text-right text-white">
              <p className="text-xl font-semibold">{userTotal}</p>
              <p className="text-sm">User Total</p>
            </div>
          </div>

          {/* Hình chữ nhật 2 */}
          <div className="bg-green-400 rounded-md p-4 flex items-center justify-between">
            <div className="rounded-full bg-white w-16 h-16 flex items-center justify-center">
              <i className="las la-users text-3xl text-green-500"></i>
            </div>
            <div className="text-right text-white">
              <p className="text-xl font-semibold">{totalSales}</p>
              <p className="text-sm">Total Sales</p>
            </div>
          </div>

          {/* Hình chữ nhật 3 */}
          <div className="bg-red-400 rounded-md p-4 flex items-center justify-between">
            <div className="rounded-full bg-white w-16 h-16 flex items-center justify-center">
              <i className="las la-users text-3xl text-red-500"></i>
            </div>
            <div className="text-right text-white">
              <p className="text-xl font-semibold">{totalRevenue}</p>
              <p className="text-sm">Total Revenue</p>
            </div>
          </div>

          {/* Hình chữ nhật 4 */}
          <div className="bg-yellow-400 rounded-md p-4 flex items-center justify-between">
            <div className="rounded-full bg-white w-16 h-16 flex items-center justify-center">
              <i className="las la-users text-3xl text-yellow-500"></i>
            </div>
            <div className="text-right text-white">
              <p className="text-xl font-semibold">{pendingOrders}</p>
              <p className="text-sm">Pending Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
