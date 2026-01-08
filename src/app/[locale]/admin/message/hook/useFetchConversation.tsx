import { GET_CONVERSATIONS } from "@/api/message";
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

export function useFetchConversations() {
  const [getConversations, { data, loading, error }] = useLazyQuery(GET_CONVERSATIONS, {
    fetchPolicy: "cache-and-network",
  });

  const fetchConversations = useCallback(
    async (options?: {
      where?: { id?: string; keyword?: string; status?: string };
      limit?: number;
      page?: number;
      sortedBy?: string;
    }) => {
      try {
        const variables = cleanVariables({
          where: options?.where,
          limit: options?.limit ?? 10,
          page: options?.page ?? 1,
          sortedBy: options?.sortedBy ?? "created_at_DESC"
        });

        const result = await getConversations({ variables });

        if (result.data?.getConversations?.success) {
          return {
            conversations: result.data.getConversations.data || [],
            total: result.data.getConversations.total || 0,
          };
        } else {
          const errorMsg = result.data?.getConversations?.error?.message || "Failed to fetch conversations";
          console.error("Error fetching conversations:", errorMsg);
          return { conversations: [], total: 0, error: errorMsg };
        }
      } catch (error: any) {
        console.error("Error fetching conversations:", error.message);
        return { conversations: [], total: 0, error: error.message };
      }
    },
    [getConversations]
  );

  return {
    fetchConversations,
    loading,
    error,
    data,
  };
}