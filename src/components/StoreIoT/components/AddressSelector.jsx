
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
} from "./../../../redux/slices/addressSlice"; // Adjust path if needed
import { Select, Spin, Card, Typography, Row, Col } from "antd";
import PropTypes from "prop-types"; // Import PropTypes

const { Option } = Select;
const { Text } = Typography;

const AddressSelector = ({ onAddressChange, defaultValues }) => {
  const dispatch = useDispatch();
  const addressState = useSelector((state) => state.address) || {};
  const { provinces, districts, wards, selectedProvince, selectedDistrict, selectedWard, loading } = addressState;

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
      }
    }
  }, [defaultValues?.wardId, dispatch, wards]);

  useEffect(() => {
    if (selectedProvince || selectedDistrict || selectedWard) {
      const fullAddress = [selectedWard?.name, selectedDistrict?.name, selectedProvince?.name]
        .filter(Boolean)
        .join(", ");

      onAddressChange(fullAddress, {
        provinceId: selectedProvince?.id || null,
        districtId: selectedDistrict?.id || null,
        wardId: selectedWard?.id || null,
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard, onAddressChange]);

  return (
    <Card title="Select Address" style={{ maxWidth: 900, margin: "20px auto" }}>
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Province/City</Text>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              value={selectedProvince?.id}
              onChange={(value) => {
                dispatch(setSelectedProvince(provinces.find((p) => p.id === value)));
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
              value={selectedDistrict?.id}
              onChange={(value) => {
                dispatch(setSelectedDistrict(districts.find((d) => d.id === value)));
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
              value={selectedWard?.id}
              onChange={(value) => {
                dispatch(setSelectedWard(wards.find((w) => w.id === value)));
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
    </Card>
  );
};

// Define PropTypes
AddressSelector.propTypes = {
  onAddressChange: PropTypes.func.isRequired, 
  defaultValues: PropTypes.shape({
    provinceId: PropTypes.number,
    districtId: PropTypes.number,
    wardId: PropTypes.number,
  }), // Optional default values
};

export default AddressSelector;

