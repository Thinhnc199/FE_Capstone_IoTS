import { useEffect, useState, useRef } from "react";
import { Avatar, Button, Input } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DynamicBreadcrumb from "../../components/common/DynamicBreadcrumb";
import {
  getAllChat,
  getRecentChat,
  chatRabbit,
  setCurrentChatUser,
} from "../../redux/slices/chatSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const messagesEndRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const { dataRecent, dataAllChat, currentChatUser } = useSelector(
    (state) => state.chats
  );
  const currentUserId = localStorage.getItem("userId");

  const handleChatSelect = (chat) => {
    dispatch(setCurrentChatUser(chat));
    dispatch(getAllChat({ receiverId: chat.userId }));
    navigate(`/chat/${chat.userId}`); // 👉 update URL
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const receiverId = currentChatUser?.userId || id;
    if (!receiverId) return;

    dispatch(
      chatRabbit({
        receiverId,
        content: inputValue,
      })
    );
    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    dispatch(getRecentChat());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const matched = dataRecent.find((c) => String(c.userId) === id);
        if (matched) {
          dispatch(setCurrentChatUser(matched));
        }

        const resultAction = await dispatch(getAllChat({ receiverId: id }));
        const data = resultAction.payload?.data;

        if (!matched && Array.isArray(data) && data.length > 0) {
          const firstMessage = data[0];
          const fallbackUser = {
            userId:
              String(firstMessage.createdBy) === currentUserId
                ? String(firstMessage.receiverId)
                : String(firstMessage.createdBy),
            username: firstMessage.name,
            imageURL: firstMessage.imagUrl,
            lastMessage: firstMessage.content,
          };
          dispatch(setCurrentChatUser(fallbackUser));
        }
      }
    };

    fetchData();
  }, [id, dataRecent, dispatch, currentUserId]);

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
                <Avatar src={chat.imageURL} />
                <div className="ml-3 overflow-hidden">
                  <p className="font-semibold truncate">{chat.username}</p>
                  {/* Chỉ hiện lastMessage nếu không rỗng */}
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
          {/* Header chat */}
          <div className="bg-white p-4 border-b flex items-center">
            {currentChatUser ? (
              <>
                <Avatar src={currentChatUser.imageURL} />
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
                            src={message.imagUrl || currentChatUser?.imageURL}
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

          {/* Ô nhập tin nhắn */}
          <div className="bg-white p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!currentChatUser && !id}
              />
              <Button
                type="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || (!currentChatUser && !id)}
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

export default ChatPage;
