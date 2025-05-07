// import { useEffect } from "react";
// import PropTypes from "prop-types";
// import { useSelector, useDispatch } from "react-redux";
// import { Table, Button, Select, InputNumber, notification } from "antd";
// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import { fetchIotDevices } from "../../../redux/slices/comboSlice";

// const DeviceSelectionTable = ({ selectedDevices, setSelectedDevices }) => {
//   const dispatch = useDispatch();
//   const iotDevices = useSelector((state) =>
//     Array.isArray(state.combo.iotDevices) ? state.combo.iotDevices : []
//   );

//   useEffect(() => {
//     dispatch(
//       fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" })
//     );
//   }, [dispatch]);

//   const handleAddDevice = () => {
//     setSelectedDevices((prevDevices) => [
//       ...prevDevices,
//       { iotDeviceId: null, id: null, name: "", amount: 1 },
//     ]);
//   };

//   const handleDeviceChange = (deviceId, index) => {
//     const isAlreadySelected = selectedDevices.some(
//       (device, i) => device.iotDeviceId === deviceId && i !== index
//     );

//     if (isAlreadySelected) {
//       notification.warning({
//         message: "Thiết bị đã được chọn",
//         description: "Thiết bị này đã có trong danh sách. Vui lòng chọn thiết bị khác.",
//       });
//       return;
//     }

//     const selectedDevice = iotDevices.find((device) => device.id === deviceId);

//     if (selectedDevice) {
//       setSelectedDevices((prevDevices) => {
//         const updatedDevices = [...prevDevices];
//         updatedDevices[index] = {
//           id: selectedDevice.id,
//           iotDeviceId: selectedDevice.id,
//           name: selectedDevice.name,
//           amount: updatedDevices[index]?.amount || 1,
//         };

//         return updatedDevices;
//       });
//     }
//   };

//   const handleAmountChange = (value, index) => {
//     setSelectedDevices((prevDevices) => {
//       const updatedDevices = [...prevDevices];
//       updatedDevices[index].amount = value;
//       return updatedDevices;
//     });
//   };

//   const handleRemoveDevice = (index) => {
//     setSelectedDevices((prevDevices) => {
//       const updatedDevices = [...prevDevices];
//       updatedDevices.splice(index, 1);
//       return updatedDevices;
//     });
//   };

//   return (
//     <div>
//       <Table
//         dataSource={selectedDevices}
//         rowKey={(record, index) => index}
//         pagination={false}
//         columns={[
//           {
//             title: "Thiết bị",
//             dataIndex: "id",
//             key: "id",
//             render: (_, record, index) => (
//               <Select
//                 showSearch
//                 placeholder="Chọn thiết bị"
//                 style={{ width: "100%" }}
//                 value={record.id || undefined}
//                 onChange={(value) => handleDeviceChange(value, index)}
//               >
//                 {iotDevices.map((device) => (
//                   <Select.Option
//                     key={device.id}
//                     value={device.id}
//                     disabled={selectedDevices.some((d) => d.iotDeviceId === device.id)}
//                   >
//                     {device.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             ),
//           },
//           {
//             title: "Số lượng",
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
//             title: "Thao tác",
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
//         Thêm thiết bị
//       </Button>
//     </div>
//   );
// };

// DeviceSelectionTable.propTypes = {
//   selectedDevices: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number,
//       name: PropTypes.string,
//       amount: PropTypes.number,
//     })
//   ).isRequired,
//   setSelectedDevices: PropTypes.func.isRequired,
// };

// export default DeviceSelectionTable;

import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Select, InputNumber, notification } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchIotDevices } from "../../../redux/slices/comboSlice";

const DeviceSelectionTable = ({ selectedDevices, setSelectedDevices }) => {
  const dispatch = useDispatch();
  const iotDevices = useSelector((state) =>
    Array.isArray(state.combo.iotDevices) ? state.combo.iotDevices : []
  );

  useEffect(() => {
    dispatch(
      fetchIotDevices({ pageIndex: 0, pageSize: 90, searchKeyword: "" })
    );
  }, [dispatch]);

  const handleAddDevice = () => {
    setSelectedDevices((prevDevices) => [
      ...prevDevices,
      { iotDeviceId: null, id: null, name: "", amount: 1 },
    ]);
  };

  const handleDeviceChange = (deviceId, index) => {
    const isAlreadySelected = selectedDevices.some(
      (device, i) => device.iotDeviceId === deviceId && i !== index
    );

    if (isAlreadySelected) {
      notification.warning({
        message: "Device already selected",
        description:
          "This device is already in the list. Please select another device.",
      });
      return;
    }

    const selectedDevice = iotDevices.find((device) => device.id === deviceId);

    if (selectedDevice) {
      setSelectedDevices((prevDevices) => {
        const updatedDevices = [...prevDevices];
        updatedDevices[index] = {
          id: selectedDevice.id,
          iotDeviceId: selectedDevice.id,
          name: selectedDevice.name,
          amount: updatedDevices[index]?.amount || 1,
        };

        return updatedDevices;
      });
    }
  };

  const handleAmountChange = (value, index) => {
    setSelectedDevices((prevDevices) => {
      const updatedDevices = [...prevDevices];
      updatedDevices[index].amount = value;
      return updatedDevices;
    });
  };

  const handleRemoveDevice = (index) => {
    setSelectedDevices((prevDevices) => {
      const updatedDevices = [...prevDevices];
      updatedDevices.splice(index, 1); // Remove the item at index
      return updatedDevices;
    });
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
                  <Select.Option
                    key={device.id}
                    value={device.id}
                    disabled={selectedDevices.some(
                      (d) => d.iotDeviceId === device.id
                    )}
                  >
                    {device.name}
                  </Select.Option>
                ))}
              </Select>
            ),
          },
          {
            title: "Quantity",
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

DeviceSelectionTable.propTypes = {
  selectedDevices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      amount: PropTypes.number,
    })
  ).isRequired,
  setSelectedDevices: PropTypes.func.isRequired,
};

export default DeviceSelectionTable;
