// import PropTypes from "prop-types";
// import { Modal } from "antd";
// import {
//   ExclamationCircleOutlined,
//   PhoneOutlined,
//   UserOutlined,
//   CreditCardOutlined,
//   BankOutlined,
// } from "@ant-design/icons";

// export const CancelOrderModal = ({
//   visible,
//   formData,
//   touched,
//   onChange,
//   onCancel,
//   onConfirm,
// }) => {
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     onChange(name, value);
//   };

//   const handleBlur = (field) => {
//     if (!touched[field]) {
//       onChange("touched", { ...touched, [field]: true });
//     }
//   };

//   return (
//     <Modal
//       title={
//         <div className="flex items-center">
//           <span className="text-lg font-medium">Cancel Order and Refund</span>
//         </div>
//       }
//       visible={visible}
//       onOk={onConfirm}
//       onCancel={onCancel}
//       okText="Confirm Cancel"
//       cancelText="Close"
//       okButtonProps={{ danger: true }}
//       width={600}
//     >
//       <div className="space-y-4">
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
//           <div className="flex items-start">
//             <ExclamationCircleOutlined className="text-yellow-500 text-lg mr-2 mt-0.5" />
//             <div>
//               <p className="text-yellow-800 font-medium">Important Notice</p>
//               <p className="text-yellow-700">
//                 Please carefully verify your bank account information before
//                 submitting. Refunds will be processed to this account.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="flex items-start">
//             <div className="flex-1">
//               <div className="flex items-center mb-1">
//                 <PhoneOutlined className="text-gray-500 mr-2" />
//                 <label className="block text-gray-700">
//                   Contact Number <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 name="contactNumber"
//                 value={formData.contactNumber}
//                 onChange={handleInputChange}
//                 onBlur={() => handleBlur("contactNumber")}
//                 className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                   !formData.contactNumber && touched.contactNumber
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Your phone number"
//               />
//               {!formData.contactNumber && touched.contactNumber && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <ExclamationCircleOutlined className="mr-1" />
//                   Please enter your contact number
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-start">
//             <div className="flex-1">
//               <div className="flex items-center mb-1">
//                 <UserOutlined className="text-gray-500 mr-2" />
//                 <label className="block text-gray-700">
//                   Account Name <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 name="accountName"
//                 value={formData.accountName}
//                 onChange={handleInputChange}
//                 onBlur={() => handleBlur("accountName")}
//                 className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                   !formData.accountName && touched.accountName
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Account holder name"
//               />
//               {!formData.accountName && touched.accountName && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <ExclamationCircleOutlined className="mr-1" />
//                   Please enter account name
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-start">
//             <div className="flex-1">
//               <div className="flex items-center mb-1">
//                 <CreditCardOutlined className="text-gray-500 mr-2" />
//                 <label className="block text-gray-700">
//                   Account Number <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 name="accountNumber"
//                 value={formData.accountNumber}
//                 onChange={handleInputChange}
//                 onBlur={() => handleBlur("accountNumber")}
//                 className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                   !formData.accountNumber && touched.accountNumber
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Bank account number"
//               />
//               {!formData.accountNumber && touched.accountNumber && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <ExclamationCircleOutlined className="mr-1" />
//                   Please enter account number
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-start">
//             <div className="flex-1">
//               <div className="flex items-center mb-1">
//                 <BankOutlined className="text-gray-500 mr-2" />
//                 <label className="block text-gray-700">
//                   Bank Name <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 name="bankName"
//                 value={formData.bankName}
//                 onChange={handleInputChange}
//                 onBlur={() => handleBlur("bankName")}
//                 className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                   !formData.bankName && touched.bankName
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Bank name"
//               />
//               {!formData.bankName && touched.bankName && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <ExclamationCircleOutlined className="mr-1" />
//                   Please enter bank name
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// CancelOrderModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   formData: PropTypes.shape({
//     contactNumber: PropTypes.string,
//     accountName: PropTypes.string,
//     accountNumber: PropTypes.string,
//     bankName: PropTypes.string,
//   }).isRequired,
//   touched: PropTypes.shape({
//     contactNumber: PropTypes.bool,
//     accountName: PropTypes.bool,
//     accountNumber: PropTypes.bool,
//     bankName: PropTypes.bool,
//   }).isRequired,
//   onChange: PropTypes.func.isRequired,
//   onCancel: PropTypes.func.isRequired,
//   onConfirm: PropTypes.func.isRequired,
// };
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Modal, Select, Image } from "antd";
import {
  ExclamationCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  CreditCardOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { fetchBanks } from "../../../redux/slices/bankSlice";

export const CancelOrderModal = ({
  visible,
  formData,
  touched,
  onChange,
  onCancel,
  onConfirm,
}) => {
  const dispatch = useDispatch();
  const { banks, loading: bankLoading } = useSelector((state) => state.banks);

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (name, value) => {
    onChange(name, value);
  };

  const handleBlur = (field) => {
    if (!touched[field]) {
      onChange("touched", { ...touched, [field]: true });
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span className="text-lg font-medium">Cancel Order and Refund</span>
        </div>
      }
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Confirm Cancel"
      cancelText="Close"
      okButtonProps={{ danger: true }}
      width={600}
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
          <div className="flex items-start">
            <ExclamationCircleOutlined className="text-yellow-500 text-lg mr-2 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Important Notice</p>
              <p className="text-yellow-700">
                Please carefully verify your bank account information before
                submitting. Refunds will be processed to this account.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <PhoneOutlined className="text-gray-500 mr-2" />
                <label className="block text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                onBlur={() => handleBlur("contactNumber")}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                  !formData.contactNumber && touched.contactNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Your phone number"
              />
              {!formData.contactNumber && touched.contactNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleOutlined className="mr-1" />
                  Please enter your contact number
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <UserOutlined className="text-gray-500 mr-2" />
                <label className="block text-gray-700">
                  Account Name <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("accountName")}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                  !formData.accountName && touched.accountName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Account holder name"
              />
              {!formData.accountName && touched.accountName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleOutlined className="mr-1" />
                  Please enter account name
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <CreditCardOutlined className="text-gray-500 mr-2" />
                <label className="block text-gray-700">
                  Account Number <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                onBlur={() => handleBlur("accountNumber")}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                  !formData.accountNumber && touched.accountNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Bank account number"
              />
              {!formData.accountNumber && touched.accountNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleOutlined className="mr-1" />
                  Please enter account number
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <BankOutlined className="text-gray-500 mr-2" />
                <label className="block text-gray-700">
                  Bank Name <span className="text-red-500">*</span>
                </label>
              </div>
              <Select
                showSearch
                placeholder="Select a bank"
                optionFilterProp="children"
                loading={bankLoading}
                value={formData.bankName || undefined}
                onChange={(value) => handleSelectChange("bankName", value)}
                onBlur={() => handleBlur("bankName")}
                className={`w-full ${
                  !formData.bankName && touched.bankName ? "border-red-500" : ""
                }`}
                filterOption={(input, option) =>
                  option.children[1]
                    ?.toLowerCase()
                    .includes(input.toLowerCase()) ||
                  option.code?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {banks.map((bank) => (
                  <Select.Option
                    key={bank.id}
                    value={bank.shortName}
                    code={bank.code}
                  >
                    <div className="flex items-center">
                      <Image
                        src={bank.logo}
                        alt={bank.shortName}
                        width={40}
                        height={24}
                        preview={false}
                        className="mr-3"
                      />
                      <span className="flex-1 text-center">
                        {bank.shortName}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
              {!formData.bankName && touched.bankName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleOutlined className="mr-1" />
                  Please select a bank
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

CancelOrderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  formData: PropTypes.shape({
    contactNumber: PropTypes.string,
    accountName: PropTypes.string,
    accountNumber: PropTypes.string,
    bankName: PropTypes.string,
  }).isRequired,
  touched: PropTypes.shape({
    contactNumber: PropTypes.bool,
    accountName: PropTypes.bool,
    accountNumber: PropTypes.bool,
    bankName: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
