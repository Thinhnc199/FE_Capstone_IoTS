import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "./../../redux/slices/productSlice";
import {
  Card,
  Spin,
  Alert,
  Image,
  Descriptions,
  Divider,
  Table,
  Carousel,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
const DeviceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products || {});
  const { data, loading, error } = productsState.ProductsDetail || {};

  useEffect(() => {
    dispatch(fetchProductDetails({ id }));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Alert
          message="Error"
          description="Failed to load device details."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Alert
          message="No Data"
          description="No device details available."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            <Carousel autoplay className="rounded-lg overflow-hidden">
              <div>
                <Image
                  src={data.imageUrl}
                  alt={data.name}
                  className="w-full h-96 object-contain"
                />
              </div>
              {data.attachments?.map((attachment) => (
                <div key={attachment.id}>
                  <Image
                    src={attachment.imageUrl}
                    alt={attachment.metaData}
                    className="w-full h-96 object-contain"
                  />
                </div>
              ))}
            </Carousel>
            {/* Store Information */}
        <div className="mb-8 *:mt-4">
          <h2 className="text-2xl font-semibold mb-4">Store Information</h2>
          <Link to={`/admin/user-detail/${data.createdBy}`}>
            <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <img
                src={data.storeInfo.imageUrl}
                alt={data.storeInfo.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <p className="text-lg font-medium">{data.storeInfo.name}</p>
                <p className="text-gray-600">ID: {data.storeInfo.id}</p>
                <p className="text-gray-600">
                  Contact: {data.storeInfo.contactNumber}
                </p>
                <p className="text-gray-600">
                  Address: {data.storeInfo.address}
                </p>
              </div>
            </div>
          </Link>
        </div>
          </div>

          {/* Device Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
            {/* <div className="flex items-center mb-4">
              <span className="text-yellow-400 mr-2">
                {[...Array(data.rating)].map((_, i) => (
                  <StarFilled key={i} />
                ))}
              </span>
              <span>({data.rating} stars)</span>
            </div>
            <p className="text-2xl text-green-600 font-semibold mb-4">
              {data.price.toLocaleString()}đ
            </p> */}
            <div className="flex items-center mb-4 space-x-4">
  <div className="flex items-center">
    <span className="text-yellow-400 mr-2">
      {[...Array(data.rating)].map((_, i) => (
        <StarFilled key={i} />
      ))}
    </span>
    <span>({data.rating} stars)</span>
  </div>
  <p className="text-2xl text-green-600 font-semibold">
    {data.price.toLocaleString()}đ
  </p>
</div>
            <p className="text-gray-600 mb-4">{data.summary}</p>
            <Descriptions bordered column={1} size="small" className="mb-4">
              <Descriptions.Item label="Model">{data.model}</Descriptions.Item>
              <Descriptions.Item label="Manufacturer">
                {data.manufacturer}
              </Descriptions.Item>
              <Descriptions.Item label="Serial Number">
                {data.serialNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Application SerialNumber">
                {data.applicationSerialNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                {data.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Warranty">
                {data.warrantyMonth} months
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {data.category.label}
              </Descriptions.Item>
              <Descriptions.Item label="Weight">
                {data.weight}
              </Descriptions.Item>
              <Descriptions.Item label="Created-Date">
  {data.createdDate ? format(new Date(data.createdDate), 'yyyy-MM-dd\'T\'HH-mm-ss') : 'N/A'}
</Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider />

        {/* Detailed Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 ">{data.description}</p>
        </div>

        {/* Specifications */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
          <p className="text-gray-700 mb-4 ">{data.specifications}</p>
          {data.deviceSpecificationsList?.map((spec) => (
            <div key={spec.name} className="mb-4">
              <h3 className="text-xl font-medium">{spec.name}</h3>
              <Table
                dataSource={spec.deviceSpecificationItemsList}
                columns={[
                  {
                    title: "Property",
                    dataIndex: "specificationProperty",
                    key: "specificationProperty",
                    render: (text) => (
                      <span className="font-medium">{text}</span>
                    ),
                  },
                  {
                    title: "Value",
                    dataIndex: "specificationValue",
                    key: "specificationValue",
                  },
                ]}
                pagination={false}
                rowKey={(record) => record.specificationProperty}
                bordered
                size="small"
              />
            </div>
          ))}
        </div>

        {/* Store Information */}
        {/* <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Store Information</h2>
          <Link to={`/admin/user-detail/${data.createdBy}`}>
            <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <img
                src={data.storeInfo.imageUrl}
                alt={data.storeInfo.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="text-lg font-medium">{data.storeInfo.name}</p>
                <p className="text-gray-600">ID: {data.storeInfo.id}</p>
                <p className="text-gray-600">
                  Contact: {data.storeInfo.contactNumber}
                </p>
                <p className="text-gray-600">
                  Address: {data.storeInfo.address}
                </p>
              </div>
            </div>
          </Link>
        </div> */}

        {/* Notes */}
        {data.notes && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notes</h2>
            <p className="text-gray-700">{data.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DeviceDetail;
