import { useEffect, useState } from "react";
import { List, Avatar, Button, Input } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DynamicBreadcrumb from "../../components/common/DynamicBreadcrumb";
import {
  getAllChat,
  getRecentChat,
  chatRabbit,
} from "../../redux/slices/chatSlice";
const ChatPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [inputValue, setInputValue] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const { dataRecent, dataAllChat } = useSelector((state) => state.chats);
  const currentUserId = localStorage.getItem("userId");

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    dispatch(getAllChat({ receiverId: chat.userId }));
  };
  console.log("f", dataAllChat);

  useEffect(() => {
    dispatch(getRecentChat());
    if (id) {
      dispatch(getAllChat({ receiverId: id }));
    }
  }, [dispatch, id]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedChat) return;
    dispatch(
      chatRabbit({
        receiverId: selectedChat.userId,
        content: inputValue,
      })
    );

    setInputValue("");
  };

  return (
    <div className="container mx-auto p-8 ">
      <div className=" max-w-6xl mb-4 ">
        <DynamicBreadcrumb />
      </div>
      <div className="flex shadow-md p-0 m-0">
        <div className="w-64 bg-white p-2 rounded-l-md border-r">
          <h2 className="text-gray-800 font-bold text-xl mb-2 font-Mainfont">
            Recent Chats
          </h2>

          <List
            dataSource={dataRecent}
            renderItem={(chat) => (
              <List.Item
                className={`cursor-pointer p-2 ${
                  selectedChat?.userId === chat.userId
                    ? "bg-blue-200 rounded-sm  "
                    : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="px-2 flex space-x-2 justify-center items-center">
                  {" "}
                  <Avatar src={chat.imageURL} />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">
                      {chat.username}
                    </p>
                    <p className="text-gray-500 text-sm truncate w-48">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div className="flex flex-col h-screen bg-blue-100 font-sans container rounded-r-md ">
          <div className="bg-white w-full rounded-r-md p-2">
            {dataAllChat.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p className="font-semibold">No messages found</p>
                <p className="text-sm">
                  Start a conversation by selecting a user.
                </p>
              </div>
            ) : (
              <div className="flex space-x-2  items-center">
                <Avatar src={dataAllChat[0].imagUrl} />

                <p className="font-semibold text-gray-800">
                  {dataAllChat[0].name}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <List
              dataSource={dataAllChat}
              renderItem={(item) => {
                const isCurrentUser = item.createdBy === Number(currentUserId);
                return (
                  <List.Item
                    className={`flex flex-row-reverse items-start py-2 ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={
                        isCurrentUser ? "order-2 ml-3" : "order-1 mr-3"
                      }
                    ></div>
                    <div
                      className={
                        isCurrentUser ? "" : "order-2 flex items-end space-x-2"
                      }
                    >
                      {isCurrentUser ? (
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-800 self-end">
                            You
                          </p>
                          <p
                            className={`p-2 rounded-lg shadow-md ${
                              isCurrentUser
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700"
                            }`}
                          >
                            {item.content}
                          </p>
                        </div>
                      ) : (
                        <div className="flex space-x-2 items-end">
                          <Avatar src={item.imagUrl} />
                          <div className="flex flex-col">
                            <p className="font-semibold text-gray-800 self-end">
                              {item.name}
                            </p>
                            <p
                              className={`p-2 rounded-lg shadow-md ${
                                isCurrentUser
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-gray-700"
                              }`}
                            >
                              {item.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </List.Item>
                );
              }}
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
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
