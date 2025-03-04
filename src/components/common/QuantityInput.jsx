import { InputNumber, Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateAddCarts } from "../../redux/slices/cartSlice";
import { fetchCarts } from "../../redux/slices/cartSlice";
const QuantityInput = ({ cartId, quantity, min = 0, max = 100 }) => {
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.carts);
  const handleChange = async (newQuantity) => {
    if (newQuantity < min || newQuantity > max) return;

    await dispatch(updateAddCarts({ cartId, quantity: newQuantity }));
    dispatch(fetchCarts({ pageIndex, pageSize }));
  };

  return (
    <div className="flex items-center gap-2 border border-headerBg rounded-lg px-2 py-1 w-fit">
      <Button
        icon={<MinusOutlined />}
        size="small"
        onClick={() => handleChange(quantity - 1)}
        disabled={quantity <= min}
        className="bg-headerBg text-white"
      />
      <InputNumber
        className="w-10 text-center"
        min={min}
        max={max}
        value={quantity}
        onChange={handleChange}
        controls={false}
      />
      <Button
        icon={<PlusOutlined />}
        size="small"
        onClick={() => handleChange(quantity + 1)}
        disabled={quantity >= max}
        className="bg-headerBg text-white"
      />
    </div>
  );
};

QuantityInput.propTypes = {
  cartId: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default QuantityInput;
