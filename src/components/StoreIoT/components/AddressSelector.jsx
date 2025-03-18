// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchProvinces,
//   fetchDistricts,
//   fetchWards,
//   setSelectedProvince,
//   setSelectedDistrict,
//   setSelectedWard,
// } from "./../../../redux/slices/addressSlice"; // Adjust path if needed
// import { Select, Spin, Card, Typography, Row, Col } from "antd";
// import PropTypes from "prop-types"; // Import PropTypes

// const { Option } = Select;
// const { Text } = Typography;

// const AddressSelector = ({ onAddressChange, defaultValues }) => {
//   const dispatch = useDispatch();
//   const addressState = useSelector((state) => state.address) || {};
//   const { provinces, districts, wards, selectedProvince, selectedDistrict, selectedWard, loading } = addressState;

//   useEffect(() => {
//     dispatch(fetchProvinces());
//   }, [dispatch]);

//   useEffect(() => {
//     if (defaultValues?.provinceId) {
//       const province = provinces.find((p) => p.id === defaultValues.provinceId);
//       if (province) {
//         dispatch(setSelectedProvince(province));
//         dispatch(fetchDistricts(province.id));
//       }
//     }
//   }, [defaultValues?.provinceId, dispatch, provinces]);

//   useEffect(() => {
//     if (defaultValues?.districtId) {
//       const district = districts.find((d) => d.id === defaultValues.districtId);
//       if (district) {
//         dispatch(setSelectedDistrict(district));
//         dispatch(fetchWards(district.id));
//       }
//     }
//   }, [defaultValues?.districtId, dispatch, districts]);

//   useEffect(() => {
//     if (defaultValues?.wardId) {
//       const ward = wards.find((w) => w.id === defaultValues.wardId);
//       if (ward) {
//         dispatch(setSelectedWard(ward));
//       }
//     }
//   }, [defaultValues?.wardId, dispatch, wards]);

//   useEffect(() => {
//     if (selectedProvince || selectedDistrict || selectedWard) {
//       const fullAddress = [selectedWard?.name, selectedDistrict?.name, selectedProvince?.name]
//         .filter(Boolean)
//         .join(", ");

//       onAddressChange(fullAddress, {
//         provinceId: selectedProvince?.id || null,
//         districtId: selectedDistrict?.id || null,
//         wardId: selectedWard?.id || null,
//       });
//     }
//   }, [selectedProvince, selectedDistrict, selectedWard, onAddressChange]);

//   return (
//     <Card title="Select Address" style={{ maxWidth: 900, margin: "20px auto" }}>
//       <Spin spinning={loading}>
//         <Row gutter={16}>
//           <Col span={8}>
//             <Text strong>Province/City</Text>
//             <Select
//               style={{ width: "100%", marginTop: 8 }}
//               value={selectedProvince?.id}
//               onChange={(value) => {
//                 dispatch(setSelectedProvince(provinces.find((p) => p.id === value)));
//                 dispatch(fetchDistricts(value));
//               }}
//               placeholder="Select Province/City"
//               disabled={loading}
//             >
//               {provinces.map((province) => (
//                 <Option key={province.id} value={province.id}>
//                   {province.name}
//                 </Option>
//               ))}
//             </Select>
//           </Col>

//           <Col span={8}>
//             <Text strong>District</Text>
//             <Select
//               style={{ width: "100%", marginTop: 8 }}
//               value={selectedDistrict?.id}
//               onChange={(value) => {
//                 dispatch(setSelectedDistrict(districts.find((d) => d.id === value)));
//                 dispatch(fetchWards(value));
//               }}
//               placeholder="Select District"
//               disabled={loading || !selectedProvince}
//             >
//               {districts.map((district) => (
//                 <Option key={district.id} value={district.id}>
//                   {district.name}
//                 </Option>
//               ))}
//             </Select>
//           </Col>

//           <Col span={8}>
//             <Text strong>Ward/Commune</Text>
//             <Select
//               style={{ width: "100%", marginTop: 8 }}
//               value={selectedWard?.id}
//               onChange={(value) => {
//                 dispatch(setSelectedWard(wards.find((w) => w.id === value)));
//               }}
//               placeholder="Select Ward/Commune"
//               disabled={loading || !selectedDistrict}
//             >
//               {wards.map((ward) => (
//                 <Option key={ward.id} value={ward.id}>
//                   {ward.name}
//                 </Option>
//               ))}
//             </Select>
//           </Col>
//         </Row>
//       </Spin>
//     </Card>
//   );
// };

// // Define PropTypes
// AddressSelector.propTypes = {
//   onAddressChange: PropTypes.func.isRequired,
//   defaultValues: PropTypes.shape({
//     provinceId: PropTypes.number,
//     districtId: PropTypes.number,
//     wardId: PropTypes.number,
//   }), // Optional default values
// };

// export default AddressSelector;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  fetchAddressByProwardId,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
  setSelectedAddress,
} from "./../../../redux/slices/addressSlice";
import { Select, Spin, Card, Typography, Row, Col, Alert } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { Text } = Typography;

const AddressSelector = ({ onAddressChange, defaultValues }) => {
  const dispatch = useDispatch();
  const addressState = useSelector((state) => state.address) || {};

  const {
    provinces = [],
    districts = [],
    wards = [],
    prowards = [],
    selectedProvince,
    selectedDistrict,
    selectedWard,
    selectedAddress,
    loading,
    error,
  } = addressState;

  // State to display the final selected address
  const [displayAddress, setDisplayAddress] = useState("");

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (defaultValues?.provinceId) {
      const province = provinces.find((p) => p.id === defaultValues.provinceId);
      if (province) {
        dispatch(setSelectedProvince(province));
        dispatch(fetchDistricts(province.id));
      }
    }
  }, [defaultValues?.provinceId, dispatch, provinces]);

  useEffect(() => {
    if (defaultValues?.districtId) {
      const district = districts.find((d) => d.id === defaultValues.districtId);
      if (district) {
        dispatch(setSelectedDistrict(district));
        dispatch(fetchWards(district.id));
      }
    }
  }, [defaultValues?.districtId, dispatch, districts]);

  useEffect(() => {
    if (defaultValues?.wardId) {
      const ward = wards.find((w) => w.id === defaultValues.wardId);
      if (ward) {
        dispatch(setSelectedWard(ward));
        dispatch(fetchAddressByProwardId(ward.id));
      }
    }
  }, [defaultValues?.wardId, dispatch, wards]);

  useEffect(() => {
    if (defaultValues?.addressId) {
      const proward = prowards.find((v) => v.id === defaultValues.addressId);
      if (proward) {
        dispatch(setSelectedAddress(proward));
      }
    }
  }, [defaultValues?.addressId, dispatch, prowards]);

  // Handle address change and log/display the result
  useEffect(() => {
    if (
      selectedProvince ||
      selectedDistrict ||
      selectedWard ||
      selectedAddress
    ) {
      const fullAddress = [
        selectedAddress?.name,
        selectedWard?.name,
        selectedDistrict?.name,
        selectedProvince?.name,
      ]
        .filter(Boolean)
        .join(", ");

      setDisplayAddress(fullAddress);
      console.log("Selected Address:", fullAddress);
      onAddressChange(fullAddress, {
        provinceId: selectedProvince?.id || null,
        districtId: selectedDistrict?.id || null,
        wardId: selectedWard?.id || null,
        // prowardId: selectedAddress?.id || null,
        addressId: selectedAddress?.id || null,
      });
    }
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    selectedAddress,
    onAddressChange,
  ]);

  // Debug prowards state
  useEffect(() => {
    console.log("Current prowards:", prowards);
    if (prowards.length === 0) {
      console.warn("prowards is empty after fetchAddressByProwardId");
    }
  }, [prowards]);

  return (
    // <Card title="Select Address" style={{ maxWidth: 900, margin: "20px auto" }}>
    //   <Spin spinning={loading}>
    //     {error && (
    //       <Alert
    //         message="Error"
    //         description={error.message}
    //         type="error"
    //         showIcon
    //         style={{ marginBottom: 16 }}
    //       />
    //     )}
    //     <Row gutter={16}>
    //       <Col span={8}>
    //         <Text strong>Province/City</Text>
    //         <Select
    //           style={{ width: "100%", marginTop: 8 }}
    //           value={selectedProvince?.id}
    //           onChange={(value) => {
    //             const province = provinces.find((p) => p.id === value);
    //             dispatch(setSelectedProvince(province));
    //             dispatch(fetchDistricts(value));
    //           }}
    //           placeholder="Select Province/City"
    //           disabled={loading}
    //         >
    //           {provinces.map((province) => (
    //             <Option key={province.id} value={province.id}>
    //               {province.name}
    //             </Option>
    //           ))}
    //         </Select>
    //       </Col>

    //       <Col span={8}>
    //         <Text strong>District</Text>
    //         <Select
    //           style={{ width: "100%", marginTop: 8 }}
    //           value={selectedDistrict?.id}
    //           onChange={(value) => {
    //             const district = districts.find((d) => d.id === value);
    //             dispatch(setSelectedDistrict(district));
    //             dispatch(fetchWards(value));
    //           }}
    //           placeholder="Select District"
    //           disabled={loading || !selectedProvince}
    //         >
    //           {districts.map((district) => (
    //             <Option key={district.id} value={district.id}>
    //               {district.name}
    //             </Option>
    //           ))}
    //         </Select>
    //       </Col>

    //       <Col span={8}>
    //         <Text strong>Ward/Commune</Text>
    //         <Select
    //           style={{ width: "100%", marginTop: 8 }}
    //           value={selectedWard?.id}
    //           onChange={(value) => {
    //             const ward = wards.find((w) => w.id === value);
    //             dispatch(setSelectedWard(ward));
    //             dispatch(fetchAddressByProwardId(value));
    //             // console.log("Fetching villages for wardId:", value); // Debug
    //           }}
    //           placeholder="Select Ward/Commune"
    //           disabled={loading || !selectedDistrict}
    //         >
    //           {wards.map((ward) => (
    //             <Option key={ward.id} value={ward.id}>
    //               {ward.name}
    //             </Option>
    //           ))}
    //         </Select>
    //       </Col>
    //       <Col span={8}>
    //         <Text strong>Village</Text>
    //         <Select
    //           style={{ width: "100%", marginTop: 8 }}
    //           value={selectedAddress?.id}
    //           onChange={(value) => {
    //             const proward = prowards.find((v) => v.id === value);
    //             dispatch(setSelectedAddress(proward));
    //           }}
    //           placeholder="Select Village address"
    //           disabled={loading || !selectedWard}
    //           notFoundContent={
    //             prowards.length === 0 ? "No villages found" : null
    //           }
    //         >
    //           {prowards.map((proward) => (
    //             <Option key={proward.id} value={proward.id}>
    //               {proward.name || `Village ID: ${proward.id}`}
    //             </Option>
    //           ))}
    //         </Select>
    //       </Col>
    //     </Row>
    //     {displayAddress && (
    //       <Text strong style={{ marginTop: 16, display: "block" }}>
    //         Selected Address: {displayAddress}
    //       </Text>
    //     )}
    //   </Spin>
    // </Card>
    <Card
      title="Select Your Address"
      style={{
        maxWidth: 900,
        margin: "20px auto",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ position: "relative" }}>
        {error && (
          <Alert
            message="Error"
            description={error.message}
            type="error"
            showIcon
            closable
            style={{
              marginBottom: 24,
              borderRadius: 4,
              padding: "8px 16px",
            }}
          />
        )}
        <Row gutter={[16, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Province/City
            </Text>
            <Select
              style={{ width: "100%" }}
              value={selectedProvince?.id}
              onChange={(value) => {
                const province = provinces.find((p) => p.id === value);
                dispatch(setSelectedProvince(province));
                dispatch(fetchDistricts(value));
              }}
              placeholder="Choose a Province/City"
              disabled={loading}
              loading={loading && !selectedProvince}
              size="large"
            >
              {provinces.map((province) => (
                <Option key={province.id} value={province.id}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              District
            </Text>
            <Select
              style={{ width: "100%" }}
              value={selectedDistrict?.id}
              onChange={(value) => {
                const district = districts.find((d) => d.id === value);
                dispatch(setSelectedDistrict(district));
                dispatch(fetchWards(value));
              }}
              placeholder={
                selectedProvince ? "Choose a District" : "Select Province first"
              }
              disabled={loading || !selectedProvince}
              loading={loading && selectedProvince && !selectedDistrict}
              size="large"
            >
              {districts.map((district) => (
                <Option key={district.id} value={district.id}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Ward/Commune
            </Text>
            <Select
              style={{ width: "100%" }}
              value={selectedWard?.id}
              onChange={(value) => {
                const ward = wards.find((w) => w.id === value);
                dispatch(setSelectedWard(ward));
                dispatch(fetchAddressByProwardId(value));
              }}
              placeholder={
                selectedDistrict ? "Choose a Ward" : "Select District first"
              }
              disabled={loading || !selectedDistrict}
              loading={loading && selectedDistrict && !selectedWard}
              size="large"
            >
              {wards.map((ward) => (
                <Option key={ward.id} value={ward.id}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Village
            </Text>
            <Select
              style={{ width: "100%" }}
              value={selectedAddress?.id}
              onChange={(value) => {
                const proward = prowards.find((v) => v.id === value);
                dispatch(setSelectedAddress(proward));
              }}
              placeholder={
                selectedWard ? "Choose a Village" : "Select Ward first"
              }
              disabled={loading || !selectedWard}
              loading={loading && selectedWard && !selectedAddress}
              size="large"
              notFoundContent={
                prowards.length === 0 ? "No villages available" : null
              }
            >
              {prowards.map((proward) => (
                <Option key={proward.id} value={proward.id}>
                  {proward.name || `Village ID: ${proward.id}`}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {displayAddress && (
          <Text
            strong
            style={{
              marginTop: 24,
              display: "block",
              color: "#52c41a",
              fontSize: 16,
            }}
          >
            Selected Address: {displayAddress}
          </Text>
        )}
        {loading && (
          <Spin
            size="small"
            style={{ position: "absolute", top: 10, right: 10 }}
          />
        )}
      </div>
    </Card>
  );
};

AddressSelector.propTypes = {
  onAddressChange: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    provinceId: PropTypes.number,
    districtId: PropTypes.number,
    wardId: PropTypes.number,
    addressId: PropTypes.number,
  }),
};

export default AddressSelector;
