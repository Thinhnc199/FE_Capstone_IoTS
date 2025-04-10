import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Select, Image, Tag, Button, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getLabAdminPagination,
  getLabStorePagination,
  getLabTrainerPagination,
  getLabCustomerPagination,
} from "./../../../redux/slices/labSlice";
import { fetchCombos } from "./../../../redux/slices/comboSlice";
import debounce from "lodash/debounce";
import ComboDetailModal from "./../../../components/StoreIoT/components/ComboDetailModal";
import { fetchComboDetails } from "./../../../redux/slices/comboSlice";
const { Option } = Select;

const LabsTable = ({ role, comboId, userId, storeId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { labs, loading: labLoading } = useSelector((state) => state.lab);
  const { combos, loading: comboLoading } = useSelector((state) => state.combo);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [advancedFilter, setAdvancedFilter] = useState({
    userId: null,
    storeId: null,
    comboId: null,
    labStatus: null,
  });
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  // Fetch combos when component mounts
  useEffect(() => {
    dispatch(
      fetchCombos({
        pageIndex: 0,
        pageSize: 50,
        searchKeyword: "",
      })
    );
  }, [dispatch]);

  // Fetch labs based on filters and pagination
  useEffect(() => {
    const fetchLabs = () => {
      const params = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        searchKeyword,
      };

      const appliedFilter = {
        ...(comboId && { comboId }),
        ...(userId && { userId }),
        ...(storeId && { storeId }),
        ...(advancedFilter.labStatus !== null && {
          labStatus: advancedFilter.labStatus,
        }),
        ...(advancedFilter.comboId !== null && {
          comboId: advancedFilter.comboId,
        }),
      };

      if (role === "store") {
        dispatch(
          getLabStorePagination({ comboId: appliedFilter.comboId, params })
        );
      } else if (role === "trainer") {
        dispatch(
          getLabTrainerPagination({
            advancedFilter: appliedFilter,
            paginationRequest: params,
          })
        );
      } else if (role === "admin") {
        dispatch(
          getLabAdminPagination({
            advancedFilter: appliedFilter,
            paginationRequest: params,
          })
        );
      } else if (role === "customer") {
        dispatch(getLabCustomerPagination({ paginationRequest: params }));
      }
    };

    fetchLabs();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchKeyword,
    advancedFilter.labStatus,
    advancedFilter.comboId,
    dispatch,
    role,
    comboId,
    userId,
    storeId,
  ]);

  // Debounced combo search
  const debouncedFetchCombos = useCallback(
    debounce((keyword) => {
      dispatch(
        fetchCombos({
          pageIndex: 0,
          pageSize: 50,
          searchKeyword: keyword,
        })
      );
    }, 300),
    [dispatch]
  );

  const handleComboSearch = (value) => {
    debouncedFetchCombos(value);
  };

  const handleShowComboDetail = async (comboId) => {
    try {
      const response = await dispatch(fetchComboDetails(comboId));
      setSelectedCombo(response.payload.data);
      setIsComboModalVisible(true);
    } catch (err) {
      console.error("Error fetching combo details:", err);
      notification.error({
        message: "Error",
        description: "Failed to get combo details.",
      });
    }
  };

  const handleTableChange = (paginationData) => {
    setPagination({
      ...pagination,
      pageIndex: paginationData.current,
      pageSize: paginationData.pageSize,
      totalCount: labs?.totalCount || 0,
    });
  };

  const handleSearch = debounce((value) => {
    setSearchKeyword(value);
    setPagination({ ...pagination, pageIndex: 1 });
  }, 300);

  const handleFilterChange = (key, value) => {
    setAdvancedFilter((prev) => ({
      ...prev,
      [key]: value === undefined ? null : value,
    }));
    setPagination({ ...pagination, pageIndex: 1 });
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="green">Active</Tag>;
      case 2:
        return <Tag color="yellow">Pending</Tag>;
      case 3:
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag color="grey">Draft</Tag>;
    }
  };

  const getDetailPath = (recordId) => {
    // console.log(typeof role, role, role.trim());
    switch (role.trim()) {
      case "store":
        return `/store/detail-labRequest/${recordId}`;
      case "trainer":
        return `/trainer/detail-lab/${recordId}`;
      case "admin":
        return `/admin/detail-lab/${recordId}`;
      case "customer":
        return `/customer/lab-details/${recordId}`;
      default:
        return "#";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <div>
          <Link to={getDetailPath(record.id)}>{text}</Link>
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <Image
          width={50}
          src={url || "https://via.placeholder.com/50"}
          alt="Lab Image"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <Link to={getDetailPath(record.id)}>{text}</Link>
      ),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
    },
    {
      title: "Combo",
      dataIndex: "comboNavigationName",
      key: "comboNavigationName",
      render: (text, record) => (
        <a onClick={() => handleShowComboDetail(record.comboId)}>{text}</a>
      ),
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} VND`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
      filters: [
        { text: "Active", value: 1 },
        { text: "Pending", value: 2 },
        { text: "Rejected", value: 3 },
        { text: "Draft", value: 4 },
      ],
      onFilter: (value, record) => record.status === value,
    },
    ...(role === "trainer"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => {
              const isNotEditable = record.status === 1 || record.status === 2;
              return (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/trainer/update-lab/${record.id}`)}
                  disabled={isNotEditable}
                >
                  Edit
                </Button>
              );
            },
          },
        ]
      : []),
  ];

  const handleCreateLab = () => {
    setTimeout(() => {
      navigate("/trainer/create-lab");
    }, 300);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">
          {/* Labs Management ({role.charAt(0).toUpperCase() + role.slice(1)}) */}
          Labs Management
        </h2>
        {role === "trainer" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateLab}
          >
            Create Lab
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by title..."
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-1/3"
        />
        {(role === "trainer" || role === "admin") && (
          <>
            <Select
              placeholder="Filter by Status"
              allowClear
              onChange={(value) => handleFilterChange("labStatus", value)}
              className="w-1/4"
            >
              <Option value={1}>Active</Option>
              <Option value={2}>Pending</Option>
            </Select>
            <Select
              showSearch
              placeholder="Select or search a combo"
              allowClear
              onChange={(value) => handleFilterChange("comboId", value)}
              onSearch={handleComboSearch}
              filterOption={false} // Disable default filtering, use API search instead
              loading={comboLoading}
              className="w-1/4"
            >
              {combos?.map((combo) => (
                <Option key={combo.id} value={combo.id}>
                  {combo.name}
                </Option>
              ))}
            </Select>
          </>
        )}
      </div>

      <ComboDetailModal
        visible={isComboModalVisible}
        onCancel={() => setIsComboModalVisible(false)}
        combo={selectedCombo}
      />

      {/* Table */}
      <Table
        columns={columns}
        dataSource={labs?.data || []}
        // loading={labLoading}
        pagination={{
          current: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: labs?.totalCount || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          showTotal: (total) => `Total ${total} labs`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white  [&_.ant-pagination]:p-2"
        style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
      />
    </div>
  );
};

LabsTable.propTypes = {
  role: PropTypes.oneOf(["admin", "trainer", "store", "customer"]).isRequired,
  comboId: PropTypes.number,
  userId: PropTypes.number,
  storeId: PropTypes.number,
};

LabsTable.defaultProps = {
  comboId: null,
  userId: null,
  storeId: null,
};

export default LabsTable;
