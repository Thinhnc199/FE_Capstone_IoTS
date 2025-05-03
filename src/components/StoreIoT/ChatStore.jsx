import { useEffect, useState, useRef } from "react";
import { Avatar, Button, Input } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DynamicBreadcrumb from "../../components/common/DynamicBreadcrumb";
import {
  getAllChat,
  getRecentChat,
  chatRabbit,
  setCurrentChatUser,
} from "../../redux/slices/chatSlice";

// Ảnh đại diện mặc định nếu không có ảnh
const defaultAvatar =
  "https://ui-avatars.com/api/?name=User&background=ccc&color=555";

const ChatStore = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const messagesEndRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const { dataRecent, dataAllChat, currentChatUser } = useSelector(
    (state) => state.chats
  );
  const currentUserId = localStorage.getItem("userId");

  // Chỉ được chọn chat từ danh sách có sẵn
  const handleChatSelect = (chat) => {
    dispatch(setCurrentChatUser(chat));
    dispatch(getAllChat({ receiverId: chat.userId }));
    // KHÔNG navigate → không tự ý cập nhật URL
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const receiverId = currentChatUser?.userId;
    if (!receiverId) return;

    dispatch(chatRabbit({ receiverId, content: inputValue }));
    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Lấy danh sách chat ban đầu
  useEffect(() => {
    dispatch(getRecentChat());
  }, [dispatch]);

  // Khi có id trên URL → chỉ set chat nếu hợp lệ trong danh sách
  useEffect(() => {
    if (id && dataRecent.length > 0) {
      const matched = dataRecent.find((c) => String(c.userId) === id);
      if (matched) {
        dispatch(setCurrentChatUser(matched));
        dispatch(getAllChat({ receiverId: matched.userId }));
      }
    }
  }, [id, dataRecent, dispatch]);

  return (
    <div
      className="container mx-auto p-4"
      style={{ minHeight: "calc(100vh - 8rem)" }}
    >
      <div className="mb-4">
        <DynamicBreadcrumb />
      </div>
      <div
        className="flex shadow-md"
        style={{ height: "calc(100vh - 12rem)", minHeight: "500px" }}
      >
        {/* Danh sách chat bên trái */}
        <div className="w-64 bg-white p-2 rounded-l-md border-r flex flex-col">
          <h2 className="text-gray-800 font-bold text-xl mb-2 p-2">
            Recent Chats
          </h2>
          <div className="flex-1 overflow-y-auto min-h-0">
            {dataRecent.map((chat) => (
              <div
                key={chat.userId}
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                  currentChatUser?.userId === chat.userId ? "bg-blue-100" : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <Avatar src={chat.imageURL || defaultAvatar} />
                <div className="ml-3 overflow-hidden">
                  <p className="font-semibold truncate">{chat.username}</p>
                  {chat.lastMessage?.trim() && (
                    <p className="text-gray-500 text-sm truncate">
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khung chat bên phải */}
        <div className="flex-1 flex flex-col bg-gray-50 rounded-r-md min-h-0">
          <div className="bg-white p-4 border-b flex items-center">
            {currentChatUser ? (
              <>
                <Avatar src={currentChatUser.imageURL || defaultAvatar} />
                <div className="ml-3">
                  <p className="font-semibold">{currentChatUser.username}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Select a chat to start messaging</p>
            )}
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse min-h-0">
            {dataAllChat.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {currentChatUser
                    ? "No messages yet. Start the conversation!"
                    : "Select a chat to view messages"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...dataAllChat]
                  .filter((msg) => msg.content?.trim())
                  .reverse()
                  .map((message, index) => {
                    const isCurrentUser =
                      message.createdBy === Number(currentUserId);
                    const showAvatar =
                      index === 0 ||
                      dataAllChat[index - 1]?.createdBy !== message.createdBy;

                    return (
                      <div
                        key={index}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isCurrentUser && showAvatar && (
                          <Avatar
                            src={
                              message.imagUrl ||
                              currentChatUser?.imageURL ||
                              defaultAvatar
                            }
                            className="self-end mr-2"
                          />
                        )}
                        {!isCurrentUser && !showAvatar && (
                          <div className="w-8 mr-2"></div>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-800"
                          } shadow`}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Nhập tin nhắn */}
          <div className="bg-white p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!currentChatUser}
              />
              <Button
                type="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !currentChatUser}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatStore;
