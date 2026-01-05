import { GET_MESSAGE } from "@/api/message";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

function cleanVariables(obj: any) {
  const result: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  });
  return result;
}

export function useFetchMessages() {
  const [getMessages, { data, loading, error }] = useLazyQuery(GET_MESSAGE, {
    fetchPolicy: "cache-and-network",
  });

  const fetchMessages = useCallback(
    async (options: {
      where: { conversation_id: string };
      limit?: number;
      page?: number;
    }) => {
      try {
        const variables = cleanVariables({
          where: options.where,
          limit: options.limit ?? 10,
          page: options.page ?? 1,
        });

        const result = await getMessages({ variables });

        if (result.data?.getMessages?.success) {
          return {
            messages: result.data.getMessages.data || [],
            total: result.data.getMessages.total || 0,
          };
        } else {
          const errorMsg = result.data?.getMessages?.error?.message || "Failed to fetch messages";
          console.error("Error fetching messages:", errorMsg);
          return { messages: [], total: 0, error: errorMsg };
        }
      } catch (error: any) {
        console.error("Error fetching messages:", error.message);
        return { messages: [], total: 0, error: error.message };
      }
    },
    [getMessages]
  );

  return {
    fetchMessages,
    loading,
    error,
    data,
  };
}
