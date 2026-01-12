"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/utils/toast";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";
import { useSelector } from "react-redux";
import { useFetchConversations } from "./hook/useFetchConversation";
import { useFetchMessages } from "./hook/useFetchMessages";
import { IConversation, IMessage } from "@/types/message";
import { useMutation, useSubscription } from "@apollo/client";
import { MUTATION_SEND_MESSAGE, MUTATION_REPLY_MESSAGE, MUTATION_DELETE_MESSAGE, MUTATION_MARKREAD } from "@/api/message";
import { SUBSCRIBE_SENDMESSAGE } from "@/api/subscription";


export default function Message() {
  const { admin } = useSelector((state: any) => state.auth);
  const { successMessage, errorMessage } = useToast();
  const { fetchConversations, loading } = useFetchConversations();
  const { fetchMessages, loading: messagesLoading } = useFetchMessages();
  const [sendMessage] = useMutation(MUTATION_SEND_MESSAGE);
  const [replyToMessage] = useMutation(MUTATION_REPLY_MESSAGE);
  const [deleteMessage] = useMutation(MUTATION_DELETE_MESSAGE);
  const [markAsRead] = useMutation(MUTATION_MARKREAD);


  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);

  const { data: subscriptionData, error } = useSubscription(
    SUBSCRIBE_SENDMESSAGE,
    {
      variables: {
        conversationId: selectedConversation?.id,
      },
      skip: !selectedConversation?.id,
      shouldResubscribe: true,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all', // Continue even if there are GraphQL errors
      onSubscriptionData: ({ subscriptionData: subData }) => {
        // Handle subscription data safely
        if (subData?.data?.sendMessage) {
          const message = subData.data.sendMessage;
          if (!message.id) {
            return;
          }
        }
      },
      
    }
  );

 

  React.useEffect(() => {
    if (!selectedConversation) return;
    const readMessage = async () => {
      const result = await markAsRead({
        variables: {
          conversationId: selectedConversation?.id!
        },
      });

      if (result?.data?.markMessageAsRead) {
        setSelectedConversation(prev => {
          if (!prev) return prev;
          return { ...prev, unread_count: 0 };
        });
      }
    }
    readMessage()
  }, [selectedConversation?.id]);


  React.useEffect(() => {
    try {
      if (!subscriptionData) return;

      console.log('>>> Processing subscription data:', subscriptionData);

      const newMessage = subscriptionData.sendMessage;

      // Validate message has required fields
      if (!newMessage) {
        console.warn('⚠️  Subscription data is empty');
        return;
      }

      if (!newMessage.id) {
        console.error('❌ Invalid message received (missing id):', newMessage);
        return;
      }

      console.log('>>> New message received from subscription:', newMessage);
      console.log('>>> Message conversation_id:', newMessage.conversation_id);
      console.log('>>> Current selected conversation_id:', selectedConversation?.id);

      // Only process messages for the currently selected conversation
      if (newMessage.conversation_id !== selectedConversation?.id) {
        console.log('⚠️  Message is for different conversation, skipping');
        return;
      }

      setAllMessages(prevMessages => {
        if (prevMessages.some(m => m.id === newMessage.id)) {
          console.log('>>> Message already exists, skipping');
          return prevMessages;
        }
        console.log('>>> Adding new message to allMessages');
        // Append new message at the end (newest messages at bottom)
        return [...prevMessages, newMessage];
      });

      // Scroll to bottom when new message arrives
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error('❌ Error processing subscription data:', err);
    }
  }, [subscriptionData, selectedConversation?.id]);

  const messages = allMessages.filter(
    (msg) => msg.conversation_id === selectedConversation?.id
  );

  // Helper functions for message display
  const getSenderName = (message: IMessage): string => {

    if (message.sender_type === "ADMIN") {
      return message.admin_sender
        ? `${message.admin_sender.firstName || ""} ${message.admin_sender.lastName || ""}`.trim() || "Admin"
        : "Admin";
    } else {
      return message.shop_sender?.store_name || message.shop_sender?.email || message.shop_sender?.fullname || "User";
    }
  };

  const isAdminMessage = (message: IMessage): boolean => {
    return message.sender_type === "ADMIN";
  };

  const [messageText, setMessageText] = useState("");
  const [messageTotal, setMessageTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [conversationPage, setConversationPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingMoreConversations, setIsLoadingMoreConversations] = useState(false);
  const [conversationTotal, setConversationTotal] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const conversationsContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  // Fetch conversations from API
  useEffect(() => {
    (async () => {
      setIsLoadingMoreConversations(conversationPage > 1);

      const result = await fetchConversations({
        limit: 20,
        page: conversationPage,
      });

      if (result.conversations && result.conversations.length > 0) {
        setConversations((prev) => {
          if (conversationPage === 1) {
            return result.conversations;
          }
          // Append new conversations for pagination
          const merged = [...prev, ...result.conversations];
          const uniqueConversations = Array.from(
            new Map(merged.map((c) => [c.id, c])).values()
          );
          return uniqueConversations;
        });

        if (result.total) {
          setConversationTotal(result.total);
        }
        setHasMoreConversations(result.conversations.length === 20);
      } else {
        setHasMoreConversations(false);
      }

      setIsLoadingMoreConversations(false);
    })();
  }, [fetchConversations, conversationPage]);

  useEffect(() => {
    if (selectedConversation) {
      if (currentPage === 1) {
        setAllMessages([]);
        setMessageTotal(0);
      }

      (async () => {
        setIsLoadingMore(currentPage > 1);

        if (currentPage > 1 && messagesContainerRef.current) {
          previousScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
        }

        const result = await fetchMessages({
          where: { conversation_id: selectedConversation?.id },
          limit: 5,
          page: currentPage,
        });

        if (result.messages && result.messages.length > 0) {
          const mappedMessages: IMessage[] = result.messages.map((msg: any) => ({
            id: msg.id,
            conversation_id: msg.conversation_id,
            conversation: msg.conversation || null,
            is_read: msg.is_read || false,
            sender_id: msg.sender_id || "",
            shop_sender: msg.shop_sender || null,
            admin_sender: msg.admin_sender || null,
            reply_to_id: msg.reply_to_id || null,
            replyTo: msg.replyTo || null,
            text: msg.text || null,
            sender_type: msg.sender_type,
            deleted_at: msg.deleted_at || null,
            is_active: msg.is_active !== undefined ? msg.is_active : true,
            created_at: msg.created_at,
            updated_at: msg.updated_at,
          }));

          setAllMessages((prev) => {
            const merged: IMessage[] = currentPage === 1
              ? result.messages
              : [...result.messages, ...prev];

            const uniqueMessages = Array.from(
              new Map(merged.map((m: IMessage) => [m.id, m])).values()
            ) as IMessage[];

            return uniqueMessages.sort((a: IMessage, b: IMessage) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });

          if (mappedMessages.length > 0) {
            setMessageTotal(result?.total);
            const lastMsg = mappedMessages[mappedMessages.length - 1];
            setConversations((prevConvs) =>
              prevConvs.map((conv) =>
                conv.id === selectedConversation?.id
                  ? {
                    ...conv,
                    lastMessage: lastMsg.text || "Image",
                    lastMessageTime: lastMsg.created_at,
                  }
                  : conv
              )
            );
          }
        } else {
          if (currentPage === 1) {
            setAllMessages([]);
          }
          setHasMoreMessages(false);
        }

        setIsLoadingMore(false);
      })();
    }
  }, [selectedConversation, fetchMessages, currentPage]);

  useEffect(() => {
    if (messagesContainerRef.current && previousScrollHeightRef.current > 0) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight;
      const scrollDifference = newScrollHeight - previousScrollHeightRef.current;
      messagesContainerRef.current.scrollTop = scrollDifference;
      previousScrollHeightRef.current = 0;
    }
  }, [allMessages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // Load more messages when scrolled to top
    if (target.scrollTop < 10 && !isLoadingMore) {
      if (allMessages.length < messageTotal) {
        setCurrentPage((prev) => prev + 1);
      }
    }

    // Show/hide scroll to bottom button
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 200;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConversationScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    // Load more conversations when scrolled near bottom
    if (scrollBottom < 50 && !isLoadingMoreConversations && hasMoreConversations) {
      if (conversations.length < conversationTotal) {
        setConversationPage((prev) => prev + 1);
      }
    }
  };

  // Auto scroll to bottom only on initial load of conversation
  useEffect(() => {
    if (currentPage === 1 && !isLoadingMore && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [selectedConversation?.id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReply = async (message: IMessage) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await deleteMessage({
        variables: {
          messageId: messageToDelete
        },
      });
      if (result?.data?.deleteMessage?.success) {
        setAllMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageToDelete)
        );
        successMessage({
          message: "Message deleted successfully",
          duration: 2000,
        });
      }
    } catch (error) {
      errorMessage({ message: "Message delete failed", duration: 2000 })
    } finally {
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      errorMessage({
        message: "Please enter a message",
        duration: 2000,
      });
      return;
    }

    setIsUploading(true);

    try {
      let attachmentUrl: string | null = null;

      // Upload image to Cloudinary if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          attachmentUrl = data.secure_url;
        }
      }

      // Determine if this is a reply or a new message
      if (replyingTo) {
        // Use reply mutation
        const result = await replyToMessage({
          variables: {
            data: {
              conversation_id: selectedConversation?.id,
              reply_to_id: replyingTo.id,
              text: messageText || null,
              attachment: attachmentUrl,
            },
          },
        });

        if (result.data?.replyToMessage?.success) {
          const newMsg = result.data.replyToMessage.data;
          // Add the new message to the list
          const newMessage: IMessage = {
            id: newMsg.id,
            conversation_id: selectedConversation?.id || "",
            conversation: null,
            is_read: newMsg.is_read || false,
            sender_id: newMsg.sender_id || admin?.id || "",
            shop_sender: newMsg.shop_sender || null,
            admin_sender: newMsg.admin_sender || admin || null,
            reply_to_id: replyingTo.reply_to_id || null,
            replyTo: replyingTo.replyTo || null,
            text: newMsg.text || null,
            attachment: newMsg.attachment || null,
            sender_type: newMsg.sender_type || "ADMIN",
            deleted_at: newMsg.deleted_at || null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setAllMessages(prevMessages => {
            if (prevMessages.some(msg => msg.id === newMessage.id)) {
              return prevMessages;
            }
            // Append new message at the end (newest messages at bottom)
            return [...prevMessages, newMessage];
          });

        } else {
          throw new Error(result.data?.replyToMessage?.error?.message || "Failed to send reply");
        }
      } else {
        // Use send message mutation
        const result = await sendMessage({
          variables: {
            data: {
              conversation_id: selectedConversation?.id,
              text: messageText || null,
              attachment: attachmentUrl,
            },
          },
        });

        if (result.data?.sendMessage?.success) {
          const newMsg = result.data.sendMessage.data;
          const newMessage: IMessage = {
            id: newMsg.id,
            conversation_id: newMsg.conversation_id,
            conversation: newMsg.conversation || null,
            is_read: false,
            sender_id: newMsg.sender_id || admin?.id || "",
            shop_sender: null,
            admin_sender: admin || null,
            reply_to_id: newMsg.reply_to_id || null,
            replyTo: newMsg.replyTo || null,
            text: newMsg.text || null,
            attachment: newMsg.attachment || null,
            sender_type: newMsg.sender_type || "ADMIN",
            deleted_at: newMsg.deleted_at || null,
            is_active: newMsg.is_active !== undefined ? newMsg.is_active : true,
            created_at: newMsg.created_at,
            updated_at: newMsg.updated_at,
          };
          setAllMessages(prevMessages => {
            if (prevMessages.some(msg => msg.id === newMessage.id)) {
              return prevMessages;
            }
            // Append new message at the end (newest messages at bottom)
            return [...prevMessages, newMessage];
          });

        } else {
          throw new Error(result.data?.sendMessage?.error?.message || "Failed to send message");
        }
      }
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation?.id
            ? {
              ...conv,
              last_message_at: new Date().toISOString(),
            }
            : conv
        )
      );

      setMessageText("");
      setSelectedImage(null);
      setImagePreview("");
      setReplyingTo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      errorMessage({
        message: error.message || "Failed to send message. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLastMessageTime = (date: Date | string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50">
      {/* Left Panel - Conversations List */}
      <div className={`w-full sm:w-80 bg-white border-r flex flex-col ${selectedConversation ? 'hidden sm:flex' : 'flex'}`}>
        {/* Left Panel Header */}
        <div className="border-b px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          {/* <p className="text-xs text-gray-500 mt-1">
            {conversationsLoading ? "Loading..." : `${conversations.length} conversations`}
          </p> */}
        </div>


        {/* Conversations List */}
        <div
          ref={conversationsContainerRef}
          onScroll={handleConversationScroll}
          className="flex-1 overflow-y-auto"
        >
          {loading ? (
            // Skeleton loading UI
            <div className="space-y-0">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="px-4 py-3 border-b animate-pulse">
                  <div className="flex items-start gap-3">
                    {/* Avatar skeleton */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>

                    {/* Content skeleton */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations yet</h3>
              <p className="text-xs text-gray-500">
                Start a conversation with customers
              </p>
            </div>
          ) : (
            conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setCurrentPage(1);
                  setShowScrollButton(false);
                  setSelectedConversation(conversation);
                  setConversations(
                    conversations.map((conv) =>
                      conv.id === conversation.id
                        ? { ...conv, unread_count: 0 }
                        : conv
                    )
                  );
                }}
                className={`px-4 py-3 border-b cursor-pointer transition-colors ${selectedConversation?.id === conversation.id
                  ? "bg-blue-50 border-l-4 border-l-blue-600"
                  : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {conversation?.title?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {conversation.creator?.fullname || conversation.creator?.store_name || conversation.creator?.email}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0"> Message {index + 1}
                        {conversation.last_message_at ? formatLastMessageTime(conversation?.last_message_at) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message}
                      </p>
                      {conversation?.unread_count > 0 && (
                        <span className="ml-2 bg-base text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {conversation.unread_count}
                        </span>
                      )}

                    </div>
                    <div className="mt-1 relative inline-block">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-300 text-green-800">
                        Shop
                      </span>
                      {conversation.creator.shop_vip && (
                        <span className="absolute -top-1 -right-5 bg-primary text-white text-[10px]  p-1 flex items-center justify-center rounded-full">
                          VIP{conversation.creator.shop_vip}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading indicator at bottom for conversation pagination */}
          {isLoadingMoreConversations && (
            <div className="space-y-0">
              {[...Array(3)].map((_, index) => (
                <div key={`loading-${index}`} className="px-4 py-3 border-b animate-pulse">
                  <div className="flex items-start gap-3">
                    {/* Avatar skeleton */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>

                    {/* Content skeleton */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Messages */}
      <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden sm:flex'}`}>
        {selectedConversation ? (
          <>
            {/* Right Panel Header */}
            <div className="bg-white border-b px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Back button for mobile */}
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      {
                        selectedConversation.creator?.store_name || selectedConversation.creator?.fullname || selectedConversation.creator?.email
                      }
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {messages.length} messages
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4"
            >
              {/* Loading indicator at top */}
              {isLoadingMore && (
                <div className="flex justify-center py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading older messages...
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isAdminMessage(message) ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] ${isAdminMessage(message) ? "items-end" : "items-start"
                      } flex flex-col`}
                  >
                    {/* Sender Name */}
                    <span className="text-xs text-gray-500 mb-1 px-2">
                      {getSenderName(message)}
                    </span>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-lg px-3 sm:px-4 py-2 sm:py-3 relative group ${isAdminMessage(message)
                        ? "bg-white text-gray-800 border"
                        : "bg-white text-gray-800 border"
                        }`}
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isAdminMessage(message)
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        title="Delete message"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>

                      {/* Reply Reference */}
                      {message.replyTo && (
                        <div
                          className={`text-xs mb-2 pb-2 border-l-2 pl-2 ${isAdminMessage(message)
                            ? "border-blue-300 bg-blue-500 bg-opacity-30"
                            : "border-gray-300 bg-gray-100"
                            } rounded p-2`}
                        >
                          <div className="font-semibold">
                            Replying to {getSenderName(message.replyTo)}
                          </div>
                          <div className="truncate">{message.replyTo.text}</div>
                        </div>
                      )}

                      {/* Message Text */}
                      {message.text && (
                        <p className="whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                      )}

                      {/* Timestamp */}
                      {message.attachment && (
                        <div
                          className="text-xs mt-1 text-gray-400">
                          <Image src={message.attachment} alt="image" width={250} height={250} className="w-auto object-contain" />
                        </div>
                      )}
                      <div
                        className="text-xs mt-1 text-gray-400">
                        {formatTime(new Date(message.created_at))}
                      </div>
                    </div>

                    {/* Reply Button */}
                    {!isAdminMessage(message) && (
                      <button
                        onClick={() => handleReply(message)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 px-2"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

              {/* Floating Scroll to Bottom Button */}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="fixed bottom-32 right-4 sm:right-8 bg-base text-white rounded-full p-3 shadow-lg hover:bg-opacity-90 transition-all duration-300 z-10"
                  title="Scroll to bottom"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="bg-blue-50 border-t border-b border-blue-200 px-3 sm:px-6 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-gray-600 font-semibold">
                      Replying to {getSenderName(replyingTo)}
                    </span>
                    <p className="text-sm text-gray-700 truncate">
                      {replyingTo.text}
                    </p>
                  </div>
                  <button
                    onClick={handleCancelReply}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="bg-gray-100 border-t px-3 sm:px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={60}
                      height={60}
                      className="rounded border"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedImage?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t px-3 sm:px-6 py-4">
              <div className="flex items-end gap-2 sm:gap-3">
                {/* Image Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  title="Upload image"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Message Input */}
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="text-sm flex-1 resize-none border rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-base text-gray-700"
                  rows={2}
                />

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={isUploading}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-base text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm flex-shrink-0"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Delete Message
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Are you sure you want to delete this message? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No conversation selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a conversation from the list to view messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}