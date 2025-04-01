// import { useEffect, useState } from "react";
// import { Input, Button, List, Avatar, Spin } from "antd";

// import api from "../../api/apiConfig";
// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [recentChats, setRecentChats] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedChat, setSelectedChat] = useState(null);

//   useEffect(() => {
//     fetchRecentChats();
//   }, []);

//   const fetchRecentChats = async () => {
//     try {
//       const response = await api.get("/api/Message/recent-chats");
//       setRecentChats(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching recent chats:", error);
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || !selectedChat) return;
//     try {
//       const response = await api.post("/api/Message/Chat-RabbitMQ", {
//         receiverId: selectedChat.userId,
//         content: inputValue,
//       });
//       const newMessage = {
//         id: response.data.id,
//         text: response.data.content,
//         user: "You",
//         avatar: "https://i.pravatar.cc/150?img=3",
//       };
//       setMessages([...messages, newMessage]);
//       setInputValue("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="  p-11 ">
//       {/* Header */}
//       <div className="flex   shadow-md p-0 m-0 ">
//         <div className="w-64 bg-white p-2  rounded-l-md">
//           <h2 className="text-gray-800 font-semibold mb-2">Recent Chats</h2>
//           {loading ? (
//             <Spin />
//           ) : (
//             <List
//               dataSource={recentChats}
//               renderItem={(chat) => (
//                 <List.Item
//                   className={`cursor-pointer p-2 ${
//                     selectedChat?.userId === chat.userId ? "bg-blue-200" : ""
//                   }`}
//                   onClick={() => setSelectedChat(chat)}
//                 >
//                   <Avatar src={chat.imageURL} />
//                   <div className="ml-3">
//                     <p className="font-semibold text-gray-800">
//                       {chat.username}
//                     </p>
//                     <p className="text-gray-500 text-sm truncate w-48">
//                       {chat.lastMessage}
//                     </p>
//                   </div>
//                 </List.Item>
//               )}
//             />
//           )}
//         </div>

//         <div className="flex flex-col h-screen bg-blue-100 font-sans container rounded-r-md  mx-auto">
//           {/* <div className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
//           <h1 className="text-xl font-bold">Chat Room</h1>
//         </div> */}

//           {/* Message List */}
//           <div className="flex-1 overflow-y-auto p-4">
//             <List
//               dataSource={messages}
//               renderItem={(item) => (
//                 <List.Item className="flex items-start py-2">
//                   <Avatar src={item.avatar} />
//                   <div className="ml-3">
//                     <p className="font-semibold text-gray-800">{item.user}</p>
//                     <p className="bg-white p-2 rounded-lg shadow-md text-gray-700">
//                       {item.text}
//                     </p>
//                   </div>
//                 </List.Item>
//               )}
//             />
//           </div>

//           {/* Input Area */}
//           <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
//             <Input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder="Nhập tin nhắn..."
//               onPressEnter={handleSendMessage}
//               className="flex-1"
//             />
//             <Button
//               type="primary"
//               onClick={handleSendMessage}
//               disabled={!selectedChat}
//             >
//               Gửi
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
import { useEffect, useState } from "react";
import { Input, Button, List, Avatar, Spin } from "antd";
import { useLocation } from "react-router-dom";

import api from "../../api/apiConfig";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chatToId = searchParams.get("chat_to");

  useEffect(() => {
    fetchRecentChats();
    if (chatToId) {
      handleChatTo(chatToId);
    }
  }, [chatToId]);

  const fetchRecentChats = async () => {
    try {
      const response = await api.get("/api/Message/recent-chats");
      setRecentChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
      setLoading(false);
    }
  };

  const fetchChatMessages = async (receiverId) => {
    try {
      const response = await api.get(
        `/api/Message/get-all-chats-sender-reciver?receiverId=${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const formattedMessages = response.data.map((msg) => ({
        id: msg.id,
        text: msg.content,
        user:
          msg.createdBy === parseInt(localStorage.getItem("userId"))
            ? "You"
            : "Them",
        avatar:
          msg.createdBy === parseInt(localStorage.getItem("userId"))
            ? "https://i.pravatar.cc/150?img=3"
            : "https://i.pravatar.cc/150?img=1",
        createdDate: msg.createdDate,
      }));
      setMessages(formattedMessages);
      return formattedMessages.length > 0; // Trả về true nếu có tin nhắn
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedChat) return;
    try {
      const response = await api.post("/api/Message/Chat-RabbitMQ", {
        receiverId: selectedChat.userId,
        content: inputValue,
      });
      const newMessage = {
        id: response.data.id,
        text: response.data.content,
        user: "You",
        avatar: "https://i.pravatar.cc/150?img=3",
        createdDate: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      // Cập nhật recentChats nếu là chat mới
      if (!recentChats.some((chat) => chat.userId === selectedChat.userId)) {
        setRecentChats([
          ...recentChats,
          {
            userId: selectedChat.userId,
            username: selectedChat.username || `User ${selectedChat.userId}`,
            imageURL: "https://i.pravatar.cc/150?img=1",
            lastMessage: inputValue,
          },
        ]);
      }
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchChatMessages(chat.userId);
  };

  const handleChatTo = async (receiverId) => {
    const id = parseInt(receiverId);
    const existingChat = recentChats.find((chat) => chat.userId === id);

    if (existingChat) {
      setSelectedChat(existingChat);
      fetchChatMessages(id);
    } else {
      // Nếu chưa có trong recent chats
      const hasMessages = await fetchChatMessages(id);
      const newChat = {
        userId: id,
        username: `User ${id}`, // Có thể cần API để lấy username thật
        imageURL: "https://i.pravatar.cc/150?img=1",
        lastMessage: hasMessages ? messages[messages.length - 1]?.text : "",
      };
      setSelectedChat(newChat);
      // Chỉ thêm vào recentChats nếu đã có tin nhắn hoặc sau khi gửi tin nhắn
      if (hasMessages) {
        setRecentChats([...recentChats, newChat]);
      }
    }
  };

  return (
    <div className="p-11">
      <div className="flex shadow-md p-0 m-0">
        <div className="w-64 bg-white p-2 rounded-l-md">
          <h2 className="text-gray-800 font-semibold mb-2">Recent Chats</h2>
          {loading ? (
            <Spin />
          ) : (
            <List
              dataSource={recentChats}
              renderItem={(chat) => (
                <List.Item
                  className={`cursor-pointer p-2 ${
                    selectedChat?.userId === chat.userId ? "bg-blue-200" : ""
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <Avatar src={chat.imageURL} />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">
                      {chat.username}
                    </p>
                    <p className="text-gray-500 text-sm truncate w-48">
                      {chat.lastMessage}
                    </p>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>

        <div className="flex flex-col h-screen bg-blue-100 font-sans container rounded-r-md mx-auto">
          <div className="flex-1 overflow-y-auto p-4">
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item
                  className={`flex flex-row-reverse items-start py-2 ${
                    item.user === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={
                      item.user === "You" ? "order-2 ml-3" : "order-1 mr-3"
                    }
                  >
                    {/* <Avatar src={item.avatar} /> */}
                  </div>
                  <div
                    className={
                      item.user === "You"
                        ? " "
                        : "order-2 flex items-end space-x-2"
                    }
                  >
                    {item.user === "You" ? (
                      <div className="flex flex-col ">
                        <p className="font-semibold text-gray-800 self-end">
                          {item.user}
                        </p>
                        <p
                          className={`p-2 rounded-lg shadow-md ${
                            item.user === "You"
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-700"
                          }`}
                        >
                          {item.text}
                        </p>
                      </div>
                    ) : (
                      <div className="flex space-x-2 items-end">
                        <Avatar src={item.avatar} />
                        <div className="flex flex-col ">
                          <p className="font-semibold text-gray-800 self-end">
                            {item.user}
                          </p>
                          <p
                            className={`p-2 rounded-lg shadow-md ${
                              item.user === "You"
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700"
                            }`}
                          >
                            {item.text}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* <div className="flex flex-col ">
                      <p className="font-semibold text-gray-800 self-end">
                        {item.user}
                      </p>
                      <p
                        className={`p-2 rounded-lg shadow-md ${
                          item.user === "You"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {item.text}
                      </p>
                    </div> */}
                  </div>
                </List.Item>
              )}
            />
          </div>

          <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onPressEnter={handleSendMessage}
              className="flex-1"
            />
            <Button
              type="primary"
              onClick={handleSendMessage}
              disabled={!selectedChat}
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
