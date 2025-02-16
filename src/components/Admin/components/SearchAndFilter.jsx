import { Input, Space, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
const { Search } = Input;
// const { RangePicker } = DatePicker;

const SearchAndFilter = ({
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
}) => {
  const dispatch = useDispatch();

  const onSearch = (value) => {
    dispatch(setsearchKeyword(value));
    console.log("Search:", value);
  };

  const onDateChange = (dates, dateStrings) => {
    dispatch(setStartFilterDate(null));
    dispatch(setEndFilterDate(null));
    console.log("Start Date:", dateStrings[0], "End Date:", dateStrings[1]);
  };
  // const onDateChange = (dates, dateStrings) => {
  //   dispatch(setStartFilterDate(dateStrings[0]));
  //   dispatch(setEndFilterDate(dateStrings[1]));
  //   console.log("Start Date:", dateStrings[0], "End Date:", dateStrings[1]);
  // };

  return (
    <Space wrap>
      <Search
        placeholder="input search text"
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      {/* <RangePicker onChange={onDateChange} style={{ width: 300 }} /> */}
    </Space>
  );
};
SearchAndFilter.propTypes = {
  setEndFilterDate: PropTypes.func.isRequired,
  setStartFilterDate: PropTypes.func.isRequired,
  setsearchKeyword: PropTypes.func.isRequired,
  searchKeyword: PropTypes.string,
  startFilterDate: PropTypes.string,
  endFilterDate: PropTypes.string,
};
export default SearchAndFilter;
