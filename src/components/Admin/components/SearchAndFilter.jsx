import { Input, Space, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
const { Search } = Input;
const { RangePicker } = DatePicker;

const SearchAndFilter = ({
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
  currentTab,
}) => {
  const dispatch = useDispatch();

  const onSearch = (value) => {
    dispatch(setsearchKeyword({ tab: currentTab, keyword: value }));
    console.log("Search:", value, "tab", currentTab);
  };

  // const onDateChange = (dates, dateStrings) => {
  //   dispatch(setStartFilterDate(null));
  //   dispatch(setEndFilterDate(null));
  //   console.log("Start Date:", dateStrings[0], "End Date:", dateStrings[1]);
  // };
  // const onDateChange = (dates, dateStrings) => {
  //   dispatch(setStartFilterDate({ tab: currentTab, date: dateStrings[0] })); // Truyền thêm tab
  //   dispatch(setEndFilterDate({ tab: currentTab, date: dateStrings[1] })); // Truyền thêm tab
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
  currentTab: PropTypes.func.isRequired,
  searchKeyword: PropTypes.string,
  startFilterDate: PropTypes.string,
  endFilterDate: PropTypes.string,
};
export default SearchAndFilter;
