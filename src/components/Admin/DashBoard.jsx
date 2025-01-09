import SearchAndFilter from "./components/Search";
// import { UserOutlined } from "@ant-design/icons";

export default function DashBoard() {
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
              <p className="text-xl font-semibold">246</p>
              <p className="text-sm">User Total</p>
            </div>
          </div>

          {/* Hình chữ nhật 2 */}
          <div className="bg-green-400 rounded-md p-4 flex items-center justify-center">
            <p className="text-white">Total Sales</p>
          </div>

          {/* Hình chữ nhật 3 */}
          <div className="bg-red-400 rounded-md p-4 flex items-center justify-center">
            <p className="text-white">Total Revenue</p>
          </div>

          {/* Hình chữ nhật 4 */}
          <div className="bg-yellow-400 rounded-md p-4 flex items-center justify-center">
            <p className="text-white">Pending Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
