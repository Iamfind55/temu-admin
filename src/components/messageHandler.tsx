import { useToast } from "@/utils/toast";
import React, { useRef } from "react";

interface MessageHandlerProps {
  response: any;
}

const MessageHandler: React.FC<MessageHandlerProps> = ({ response }) => {
  const { errorMessage, successMessage } = useToast();
  const hasShownMessage = useRef(false); // Use ref to track message state
  React.useEffect(() => {
    if (response && !hasShownMessage.current) {
      if (response?.errors) {
        errorMessage({ message: response?.errors[0]?.msg, duration: 3000 });
      }
      if (response?.status === 200 || response?.status === 201) {
        successMessage({ message: response?.message, duration: 3000 });
      }
      if (response?.status === 400) {
        errorMessage({ message: response?.message, duration: 3000 });
      }
      if (response?.status === 409) {
        errorMessage({ message: response?.message, duration: 3000 });
      }
      if (response?.status === 404) {
        errorMessage({ message: response?.message, duration: 3000 });
      }
      if (response?.status == 408) {
        errorMessage({ message: response?.message, duration: 3000 });
      }
      if (response?.status == 500) {
        errorMessage({ message: "Something wrong!", duration: 3000 });
      }
      if (response?.status === 429) {
        errorMessage({
          message: "Too many requests from this IP, please try again later.",
          duration: 3000,
        });
      }

      hasShownMessage.current = true;
    }

    return () => {
      hasShownMessage.current = false;
    };
  }, [response]);

  return null;
};

export default MessageHandler;
