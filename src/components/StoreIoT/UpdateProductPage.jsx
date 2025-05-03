import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Card, message } from "antd";
import { fetchAllMaterialCategories } from "../../redux/slices/materialCategorySlice";
import BreadcrumbNav from "../common/BreadcrumbNav";
import {
  updateProducts,
  fetchProductDetails,
} from "../../redux/slices/productSlice";
import ProductForm from "./components/ProductForm";

const UpdateProductPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { ProductsDetail } = useSelector((state) => state.products);
  const { paginatedData } = useSelector((state) => state.materialCategory);
  useEffect(() => {
    dispatch(fetchProductDetails({ id }));
  }, [dispatch, id]);
  useEffect(() => {
    dispatch(fetchAllMaterialCategories());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(updateProducts({ id, ...values })).unwrap();
      message.success("Product updated successfully");
      navigate("/store/list-product");
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div className="container mx-auto ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/" },
            { label: "store", path: "/store" },
            { label: "list product ", path: "/store/list-product" },
            { label: "edit " },
          ]}
        />
      </div>
      <Card title="Update Product" bordered={false}>
        <ProductForm
          form={form}
          onFinish={handleSubmit}
          loading={ProductsDetail.loading}
          isEditMode={true}
          initialValues={ProductsDetail.data}
          categories={paginatedData}
        />
      </Card>
    </div>
  );
};

export default UpdateProductPage;
