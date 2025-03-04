// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Table, Button, Select, InputNumber } from "antd";
// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import { fetchIotDevices } from "../../../redux/slices/comboSlice";

// const DeviceSelectionTable = () => {
//   const dispatch = useDispatch();
//   const iotDevices = useSelector((state) =>
//     Array.isArray(state.combo.iotDevices) ? state.combo.iotDevices : []
//   );

//   const [selectedDevices, setSelectedDevices] = useState([]);

//   // Fetch IoT Devices khi component mount
//   useEffect(() => {
//     dispatch(fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" }));
//   }, [dispatch]);

//   // Thêm một hàng thiết bị mới
//   const handleAddDevice = () => {
//     setSelectedDevices([...selectedDevices, { iotDeviceId: null, amount: 1 }]);
//   };

//   // Chọn thiết bị từ danh sách
//   const handleDeviceChange = (value, index) => {
//     const updatedDevices = [...selectedDevices];
//     updatedDevices[index].iotDeviceId = value;
//     setSelectedDevices(updatedDevices);
//   };

//   // Thay đổi số lượng thiết bị
//   const handleAmountChange = (value, index) => {
//     const updatedDevices = [...selectedDevices];
//     updatedDevices[index].amount = value;
//     setSelectedDevices(updatedDevices);
//   };

//   // Xóa một thiết bị khỏi danh sách
//   const handleRemoveDevice = (index) => {
//     const updatedDevices = selectedDevices.filter((_, i) => i !== index);
//     setSelectedDevices(updatedDevices);
//   };

//   return (
//     <div>
//       <Table
//         dataSource={selectedDevices}
//         rowKey={(record, index) => index}
//         pagination={false}
//         columns={[
//           {
//             title: "Device",
//             dataIndex: "iotDeviceId",
//             key: "iotDeviceId",
//             render: (_, record, index) => (
//               <Select
//                 showSearch
//                 placeholder="Select device"
//                 style={{ width: "100%" }}
//                 value={record.iotDeviceId || undefined}
//                 onChange={(value) => handleDeviceChange(value, index)}
//               >
//                 {iotDevices.map((device) => (
//                   <Select.Option key={device.id} value={device.id}>
//                     {device.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             ),
//           },
//           {
//             title: "Amount",
//             dataIndex: "amount",
//             key: "amount",
//             render: (_, record, index) => (
//               <InputNumber
//                 min={1}
//                 value={record.amount}
//                 onChange={(value) => handleAmountChange(value, index)}
//               />
//             ),
//           },
//           {
//             title: "Actions",
//             key: "actions",
//             render: (_, record, index) => (
//               <Button
//                 type="danger"
//                 icon={<DeleteOutlined />}
//                 onClick={() => handleRemoveDevice(index)}
//               />
//             ),
//           },
//         ]}
//       />

//       <Button
//         onClick={handleAddDevice}
//         icon={<PlusOutlined />}
//         className="mt-2"
//       >
//         Add Device
//       </Button>
//     </div>
//   );
// };

// export default DeviceSelectionTable;
import { useEffect } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes để kiểm tra kiểu dữ liệu
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Select, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchIotDevices } from "../../../redux/slices/comboSlice";

const DeviceSelectionTable = ({ selectedDevices, setSelectedDevices }) => {
  const dispatch = useDispatch();
  const iotDevices = useSelector((state) =>
    Array.isArray(state.combo.iotDevices) ? state.combo.iotDevices : []
  );

  useEffect(() => {
    dispatch(
      fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" })
    );
  }, [dispatch]);

  const handleAddDevice = () => {
    setSelectedDevices([...selectedDevices, { id: null, name: "", amount: 1 }]);
  };

  const handleDeviceChange = (deviceId, index) => {
    const selectedDevice = iotDevices.find((device) => device.id === deviceId);

    if (selectedDevice) {
      const updatedDevices = [...selectedDevices];
      updatedDevices[index] = {
        id: selectedDevice.id,
        iotDeviceId: selectedDevice.id,
        name: selectedDevice.name,
        summary: selectedDevice.summary || "",
        ownerId: selectedDevice.ownerId || null,
        ownerName: selectedDevice.ownerName || "",
        amount: updatedDevices[index]?.amount || 1,
      };
      setSelectedDevices(updatedDevices);
    }
  };

  const handleAmountChange = (value, index) => {
    const updatedDevices = [...selectedDevices];
    updatedDevices[index].amount = value;
    setSelectedDevices(updatedDevices);
  };

  const handleRemoveDevice = (index) => {
    const updatedDevices = selectedDevices.filter((_, i) => i !== index);
    setSelectedDevices(updatedDevices);
  };

  return (
    <div>
      <Table
        dataSource={selectedDevices}
        rowKey={(record, index) => index}
        pagination={false}
        columns={[
          {
            title: "Device",
            dataIndex: "id",
            key: "id",
            render: (_, record, index) => (
              <Select
                showSearch
                placeholder="Select device"
                style={{ width: "100%" }}
                value={record.id || undefined}
                onChange={(value) => handleDeviceChange(value, index)}
              >
                {iotDevices.map((device) => (
                  <Select.Option key={device.id} value={device.id}>
                    {device.name}
                  </Select.Option>
                ))}
              </Select>
            ),
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (_, record, index) => (
              <InputNumber
                min={1}
                value={record.amount}
                onChange={(value) => handleAmountChange(value, index)}
              />
            ),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record, index) => (
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveDevice(index)}
              />
            ),
          },
        ]}
      />

      <Button
        onClick={handleAddDevice}
        icon={<PlusOutlined />}
        className="mt-2"
      >
        Add Device
      </Button>
    </div>
  );
};

// ✅ Thêm PropTypes để kiểm tra kiểu dữ liệu của props
DeviceSelectionTable.propTypes = {
  selectedDevices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      summary: PropTypes.string,
      ownerId: PropTypes.number,
      ownerName: PropTypes.string,
      amount: PropTypes.number,
    })
  ).isRequired,
  setSelectedDevices: PropTypes.func.isRequired,
};

export default DeviceSelectionTable;
