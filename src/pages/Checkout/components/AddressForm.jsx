import { useEffect } from "react";
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
import { Select, Spin, Typography, Row, Col, Alert } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { Text } = Typography;

const AddressForm = ({ onAddressChange, defaultValues }) => {
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
    setSelectedDeliverOption,
  } = addressState;

  // State to display the final selected address

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

      // console.log("Selected Address:", fullAddress);
      onAddressChange(fullAddress, {
        provinceId: selectedProvince?.id || null,
        districtId: selectedDistrict?.id || null,
        wardId: selectedWard?.id || null,
        // prowardId: selectedAddress?.id || null,
        addressId: selectedAddress?.id || null,
        deliver_option: setSelectedDeliverOption,
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
    // console.log("Current prowards:", prowards);
    if (prowards.length === 0) {
      console.warn("prowards is empty after fetchAddressByProwardId");
    }
  }, [prowards]);

  return (
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
          <Text
            className="truncate"
            strong
            style={{ display: "block", marginBottom: 8 }}
          >
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
          <Text
            className="truncate"
            strong
            style={{ display: "block", marginBottom: 8 }}
          >
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
          <Text
            className="truncate"
            strong
            style={{ display: "block", marginBottom: 8 }}
          >
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
          <Text
            className="truncate"
            strong
            style={{ display: "block", marginBottom: 8 }}
          >
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

      {loading && (
        <Spin
          size="small"
          style={{ position: "absolute", top: 10, right: 10 }}
        />
      )}
    </div>
  );
};

AddressForm.propTypes = {
  onAddressChange: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    provinceId: PropTypes.number,
    districtId: PropTypes.number,
    wardId: PropTypes.number,
    addressId: PropTypes.number,
  }),
};

export default AddressForm;
