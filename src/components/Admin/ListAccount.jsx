import ProductManageIcon from "../../assets/icons/ProductManageIcon";
export default function ListAccount() {
  return (
    <div>
      <h1>List account</h1>
      {/* Icon Home */}
      <i className="las la-home text-blue-500 text-4xl"></i>

      {/* Icon User */}
      <i className="las la-user text-green-500 text-6xl"></i>

      {/* Icon Shopping Cart */}
      <i className="las la-shopping-cart text-red-500 text-3xl"></i>
      {/* <icon src={Icoinnn} alt="ok" /> */}
      <ProductManageIcon />
    </div>
  );
}
