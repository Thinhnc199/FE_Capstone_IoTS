import SearchAndFilter from "./components/Search";
export default function DashBoard() {
  return (
    <div>
      <SearchAndFilter />
      <div className="bg-white rounded-md p-2 m-2">
        <a className="py-2.5  w-full font-bold">Dashboard</a>
        <div className="totals">
          <div></div>
        </div>
      </div>
    </div>
  );
}
