import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
} from "./../../../redux/slices/addressSlice";

import { Select, Spin, Typography, Row, Col } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { Text } = Typography;

const AddressForm = ({ onAddressChange, defaultValues }) => {
  const dispatch = useDispatch();
  const {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    loading,
  } = useSelector((state) => state.address) || {};

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (defaultValues?.provinceId) {
      const province = provinces.find((p) => p.id === defaultValues.provinceId);
      if (province && province.id !== selectedProvince?.id) {
        dispatch(setSelectedProvince(province));
        dispatch(fetchDistricts(province.id));
      }
    }
    if (defaultValues?.districtId) {
      const district = districts.find((d) => d.id === defaultValues.districtId);
      if (district && district.id !== selectedDistrict?.id) {
        dispatch(setSelectedDistrict(district));
        dispatch(fetchWards(district.id));
      }
    }
    if (defaultValues?.wardId) {
      const ward = wards.find((w) => w.id === defaultValues.wardId);
      if (ward && ward.id !== selectedWard?.id) {
        dispatch(setSelectedWard(ward));
      }
    }
  }, [
    defaultValues,
    dispatch,
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
  ]);

  useEffect(() => {
    if (selectedProvince || selectedDistrict || selectedWard) {
      const fullAddress = [
        selectedWard?.name,
        selectedDistrict?.name,
        selectedProvince?.name,
      ]
        .filter(Boolean)
        .join(", ");

      onAddressChange(fullAddress, {
        provinceId: selectedProvince?.id || null,
        districtId: selectedDistrict?.id || null,
        wardId: selectedWard?.id || null,
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  return (
    // <Card title="Select Address" style={{ maxWidth: 900, margin: "20px auto" }}>
    <Spin spinning={loading}>
      <Row gutter={16}>
        <Col span={8}>
          <Text strong>Province/City</Text>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            className="h-11"
            value={selectedProvince?.id}
            onChange={(value) => {
              const province = provinces.find((p) => p.id === value);
              dispatch(setSelectedProvince(province));
              dispatch(fetchDistricts(value));
            }}
            placeholder="Select Province/City"
            disabled={loading}
          >
            {provinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={8}>
          <Text strong>District</Text>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            className="h-11"
            value={selectedDistrict?.id}
            onChange={(value) => {
              const district = districts.find((d) => d.id === value);
              dispatch(setSelectedDistrict(district));
              dispatch(fetchWards(value));
            }}
            placeholder="Select District"
            disabled={loading || !selectedProvince}
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={8}>
          <Text strong>Ward/Commune</Text>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            className="h-11"
            value={selectedWard?.id}
            onChange={(value) => {
              const ward = wards.find((w) => w.id === value);
              dispatch(setSelectedWard(ward));
            }}
            placeholder="Select Ward/Commune"
            disabled={loading || !selectedDistrict}
          >
            {wards.map((ward) => (
              <Option key={ward.id} value={ward.id}>
                {ward.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Spin>
    // </Card>
  );
};

// Define PropTypes
AddressForm.propTypes = {
  onAddressChange: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    provinceId: PropTypes.number,
    districtId: PropTypes.number,
    wardId: PropTypes.number,
  }),
};

export default AddressForm;
