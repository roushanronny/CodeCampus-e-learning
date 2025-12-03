import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { IoMdChatboxes, IoMdSend } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import { BsInbox } from "react-icons/bs";
import { getCourseByInstructor } from "../../../api/endpoints/course/course";
import { toast } from "react-toastify";

type Props = {};

interface Message {
  id: string;
  from: string;
  message: string;
  timestamp: string;
  courseId?: string;
  senderType?: 'student' | 'instructor';
}

interface Channel {
  id: string;
  name: string;
  courseId: string;
  category?: string;
  unread: number;
}

const InstructorChannels: React.FC<Props> = () => {
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing channels state:", error);
      return [];
    }
  });
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing messages state:", error);
      return [];
    }
  });
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false); // Prevent multiple simultaneous API calls

  // Load courses from API - only once on mount
  useEffect(() => {
    // Prevent multiple simultaneous calls
    if (fetchInProgress.current) {
      return;
    }

    const fetchCourses = async () => {
      if (fetchInProgress.current) {
        return;
      }
      
      fetchInProgress.current = true;
      
      try {
        setLoading(true);
        const response = await getCourseByInstructor();
        const courses = response.data || [];
        
        const courseChannels: Channel[] = courses.map((course: any) => ({
          id: course._id,
          name: course.title,
          courseId: course._id,
          category: course.category,
          unread: 0, // You can calculate this from actual messages
        }));

        setChannels(courseChannels);
        
        // Select first channel if available
        if (courseChannels.length > 0 && !selectedChannel) {
          setSelectedChannel(courseChannels[0].id);
        }
      } catch (error) {
        toast.error("Failed to load courses");
        console.error(error);
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchCourses();
    
    // Cleanup function
    return () => {
      fetchInProgress.current = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Load messages from localStorage when channel changes
  // Use shared storage key so both students and instructors can see messages
  useEffect(() => {
    if (selectedChannel) {
      const storageKey = `course_chat_${selectedChannel}`;
      const storedMessages = localStorage.getItem(storageKey);
      
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            setMessages(parsedMessages);
            console.log(`Loaded ${parsedMessages.length} messages for channel ${selectedChannel}`);
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error("Error parsing messages:", error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  }, [selectedChannel, channels]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return;

    // Ensure messages is always an array
    const currentMessages = Array.isArray(messages) ? messages : [];

    const message: Message = {
      id: Date.now().toString(),
      from: "You",
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
      courseId: selectedChannel,
      senderType: 'instructor', // Mark as instructor message
    };

    // Filter out system welcome message if it exists, then add new message
    const filteredMessages = currentMessages.filter(msg => msg.from !== "System" || msg.id.startsWith("welcome_") === false);
    const updatedMessages = [...filteredMessages, message];
    
    setMessages(updatedMessages);
    
    // Save to shared localStorage key so students can see it
    const storageKey = `course_chat_${selectedChannel}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    console.log(`Saved message to ${storageKey}`, updatedMessages);
    
    setNewMessage("");
    
    // Scroll to bottom after sending (optional)
    setTimeout(() => {
      const messagesContainer = document.querySelector('.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Typography>Loading courses...</Typography>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <IoMdChatboxes className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
          <Typography variant="h5" className="mb-2">
            No courses found
          </Typography>
          <Typography variant="small">
            Create a course to start receiving messages from students
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4 p-4">
      {/* Channels/Inbox Sidebar */}
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <BsInbox className="w-6 h-6 text-blue-600" />
          <Typography variant="h5" className="font-bold">
            Inbox ({channels.length})
          </Typography>
        </div>

        <div className="space-y-2">
          {channels.map((channel) => (
            <Card
              key={channel.id}
              className={`cursor-pointer transition-all ${
                selectedChannel === channel.id
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleChannelSelect(channel.id)}
            >
              <CardBody className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Typography variant="h6" className="text-sm font-semibold">
                      {channel.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {channel.category || "Course"}
                    </Typography>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {channel.unread}
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-gray-600">
            <HiUsers className="w-5 h-5" />
            <Typography variant="small">All Channels</Typography>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md min-h-0">
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-blue-50 rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-2">
                <IoMdChatboxes className="w-5 h-5 text-blue-600" />
                <Typography variant="h6" className="font-semibold">
                  {channels.find((c) => c.id === selectedChannel)?.name}
                </Typography>
              </div>
              <Typography variant="small" className="text-gray-600 mt-1">
                Chat with students enrolled in this course
              </Typography>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-gray-50" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              {!Array.isArray(messages) || messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <IoMdChatboxes className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <Typography>No messages yet. Start a conversation!</Typography>
                    <Typography variant="small" className="mt-2 text-gray-400">
                      Type a message below and press Enter to send
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    // In instructor view:
                    // - Instructor messages (senderType === 'instructor' or from === "You") → Right side (blue)
                    // - Student messages (senderType === 'student') → Left side (gray)
                    const isInstructorMessage = msg.senderType === 'instructor' || (msg.from === "You" && msg.senderType !== 'student');
                    const isStudentMessage = msg.senderType === 'student';
                    const isSystemMessage = msg.from === "System";
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isInstructorMessage 
                            ? "justify-end" 
                            : isSystemMessage 
                            ? "justify-center" 
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isInstructorMessage
                              ? "bg-blue-500 text-white"
                              : isSystemMessage
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <Typography variant="small" className="font-semibold mb-1">
                            {isStudentMessage ? 'Student' : isInstructorMessage ? (msg.from === "You" ? "You" : "Instructor") : msg.from}
                          </Typography>
                          <Typography variant="paragraph">{msg.message}</Typography>
                          <Typography
                            variant="small"
                            className={`text-xs mt-1 ${
                              isInstructorMessage
                                ? "text-blue-100" 
                                : isSystemMessage
                                ? "text-yellow-700"
                                : "text-gray-500"
                            }`}
                          >
                            {msg.timestamp}
                          </Typography>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message Input - Always Visible at Bottom */}
            <div className="p-4 border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white sticky bottom-0 z-10">
              <div className="mb-2">
                <Typography variant="small" className="text-blue-700 font-semibold">
                  💬 Type your message below:
                </Typography>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Type your message here and press Enter to send..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="text-base border-2 focus:border-blue-500"
                    containerProps={{
                      className: "min-w-0",
                    }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`px-6 py-3 ${
                    newMessage.trim()
                      ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white rounded-lg transition-all transform hover:scale-105`}
                  size="md"
                >
                  <IoMdSend className="w-5 h-5 mr-1" />
                  Send
                </Button>
              </div>
              <Typography variant="small" className="text-gray-600 mt-2 text-center">
                Press <span className="font-bold">Enter</span> to send or click the Send button
              </Typography>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <IoMdChatboxes className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <Typography variant="h5" className="mb-2">
                Select a channel to start messaging
              </Typography>
              <Typography variant="small">
                Choose a course channel from the sidebar to view and send messages
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorChannels;
