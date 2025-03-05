import { InputNumber, Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAddCarts,
  fetchGetTotalPrice,
  fetchCarts,
} from "../../redux/slices/cartSlice";

const QuantityInput = ({ cartId, quantity, min = 0, max = 100 }) => {
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.carts);

  const handleChange = async (newQuantity) => {
    if (newQuantity < min || newQuantity > max) return;

    await dispatch(updateAddCarts({ cartId, quantity: newQuantity }));
    dispatch(fetchGetTotalPrice());
    dispatch(fetchCarts({ pageIndex, pageSize }));
  };

  return (
    <div className="flex items-center gap-1  rounded-md  w-fit">
      <Button
        icon={<MinusOutlined className="text-xs" />}
        size="small"
        onClick={() => handleChange(quantity - 1)}
        disabled={quantity <= min}
        className="bg-headerBg text-white p-0 w-6 h-6 flex items-center justify-center"
      />
      <InputNumber
        className="w-9 text-center border-none text-xs px-0 py-0"
        min={min}
        max={max}
        value={quantity}
        onChange={handleChange}
        controls={false}
      />
      <Button
        icon={<PlusOutlined className="text-xs" />}
        size="small"
        onClick={() => handleChange(quantity + 1)}
        disabled={quantity >= max}
        className="bg-headerBg text-white p-0 w-6 h-6 flex items-center justify-center"
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
