// ChatPage.js
import { useState } from "react";
import { Input, Button, List, Avatar } from "antd";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Bạn khỏe không?",
      user: "User1",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      text: "Chào bạn! Mình khỏe, còn bạn?",
      user: "User2",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        user: "You",
        avatar: "https://i.pravatar.cc/150?img=3",
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-100 font-sans  container mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Chat Room</h1>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item className="flex items-start py-2">
              <Avatar src={item.avatar} />
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{item.user}</p>
                <p className="bg-white p-2 rounded-lg shadow-md text-gray-700">
                  {item.text}
                </p>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onPressEnter={handleSendMessage}
            className="flex-1"
          />
          <Button type="primary" onClick={handleSendMessage}>
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
