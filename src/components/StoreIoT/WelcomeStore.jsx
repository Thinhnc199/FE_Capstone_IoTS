// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import { Spin, Button, Modal } from "antd";
// import { useNavigate } from "react-router-dom";
// import { fetchUserRequest } from "../../redux/slices/storeAuthSlice";

// const WelcomeStore = () => {
//   const dispatch = useDispatch();
//   const { userDetails, loading, userId } = useSelector(
//     (state) => state.userAuth
//   );
//   const [showReRegisterButton, setShowReRegisterButton] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let loginuserId = userId;
//     // let userId = localStorage.getItem("userId");
//     console.log(userId);
//     if (userId && userDetails?.isActive === 2) {
//       const fetchDetails = async () => {
//         const data = await dispatch(fetchUserRequest(loginuserId));
//         console.log(data);

//         const userRequestInfo = data?.userRequestInfo;

//         // Get userresquest ,
//         // UserDetail
//         // StoreDetail
//         // licesense,

//         if (userRequestInfo?.remark) {
//           Modal.info({
//             title: "Important Notice",

//             content: userRequestInfo.remark,
//             okText: "Close",
//           });
//           setShowReRegisterButton(true);
//         } else {
//           setShowReRegisterButton(false);
//         }
//       };

//       fetchDetails();
//     }
//   }, [dispatch, userId, userDetails?.isActive]);

//   const handleReRegister = () => {
//     navigate("/store/register");
//   };

//   if (loading || !userDetails) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <Spin size="large" />
//         <p className="text-center text-gray-600 mt-2">
//           Loading Store details...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold text-blue-600">
//         Welcome, {userDetails?.fullname}!
//       </h1>
//       <p>Email: {userDetails?.email}</p>

//       {/* Re-register Button if remark exists */}
//       {showReRegisterButton && (
//         <Button className="mt-4" type="primary" onClick={handleReRegister}>
//           Re-register
//         </Button>
//       )}
//     </div>
//   );
// };

// export default WelcomeStore;

// -------------------------------------------------------------------------------------------------------------------------

// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import { Spin, Button, Modal } from "antd";
// import { useNavigate } from "react-router-dom";
// import { fetchUserRequest } from "../../redux/slices/userAuthSlice";

// const WelcomeStore = () => {
//   const dispatch = useDispatch();
//   const { userDetails, loading, userId } = useSelector(
//     (state) => state.userAuth
//   );
//   const [showReRegisterButton, setShowReRegisterButton] = useState(false);
//   const navigate = useNavigate();

//   // Get userresquest ,
//         // UserDetail
//         // StoreDetail
//         // licesense,

//  useEffect(() => {
//   if (!userId || userDetails?.isActive !== 2) return;

//   const fetchDetails = async () => {
//     try {
//       const response = await dispatch(fetchUserRequest(userId)).unwrap(); // Ensuring proper handling
//       console.log("User Request Data:", response);

//       const userRequestInfo = response?.userRequestInfo;

//       if (userRequestInfo?.remark) {
//        Modal.info({
//               title: "Important Notice",
//               content: React.createElement("div", null,
//                 userRequestInfo?.userRequestStatus?.label === "Rejected" &&
//                   React.createElement("p", { style: { color: "red", fontWeight: "bold" } }, "Rejected"),
//                 React.createElement("p", null, userRequestInfo.remark)
//               ),
//               okText: "Close",
//             });
//         setShowReRegisterButton(true);
//       } else {
//         setShowReRegisterButton(false);
//       }
//     } catch (error) {
//       console.error("Error fetching user request details:", error);
//     }
//   };

//   fetchDetails();
// }, [dispatch, userId, userDetails?.isActive]);

//   const handleReRegister = () => {
//     navigate("/store/register");
//   };

//   if (loading || !userDetails) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <Spin size="large" />
//         <p className="text-center text-gray-600 mt-2">
//           Loading Store details...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold text-blue-600">
//         Welcome, {userDetails?.fullname}!
//       </h1>
//       <p>Email: {userDetails?.email}</p>

//       {showReRegisterButton && (
//         <Button className="mt-4" type="primary" onClick={handleReRegister}>
//           Re-register
//         </Button>
//       )}
//     </div>
//   );
// };

// export default WelcomeStore;

// ------------------------------------------------------------------------------------------------------
import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchUserRequest } from "../../redux/slices/userAuthSlice";

const WelcomeStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetails, loading, userId } = useSelector(
    (state) => state.userAuth
  );

  useEffect(() => {
    if (!userId || userDetails) return; 

    const fetchDetails = async () => {
      try {
        const response = await dispatch(fetchUserRequest(userId)).unwrap();
        console.log("User Request Data:", response);

        if (response?.userRequestInfo?.remark) {
          Modal.info({
            title: "Important Notice",
            content: (
              <div>
                {response.userRequestInfo?.userRequestStatus?.label ===
                  "Rejected" && (
                  <p style={{ color: "red", fontWeight: "bold" }}>Rejected</p>
                )}
                <p>{response.userRequestInfo.remark}</p>
              </div>
            ),
            okText: "Close",
          });
        }
      } catch (error) {
        console.error("Error fetching user request details:", error);
      }
    };

    fetchDetails();
  }, [dispatch, userId, userDetails]);

  const showReRegisterButton = useMemo(() => {
    return userDetails?.userRequestInfo?.remark ? true : false;
  }, [userDetails?.userRequestInfo]);

  const handleReRegister = () => {
    navigate("/store/register");
  };

  if (loading || !userDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spin size="large" />
        <p className="text-center text-gray-600 mt-2">
          Loading Store details...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-blue-600">
        Welcome, {userDetails?.fullname}!
      </h1>
      <p>Email: {userDetails?.email}</p>

      {showReRegisterButton && (
        <Button className="mt-4" type="primary" onClick={handleReRegister}>
          Re-register
        </Button>
      )}
    </div>
  );
};

export default WelcomeStore;
