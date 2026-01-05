import { gql } from "@apollo/client";

export const GET_CONVERSATIONS = gql`
query GetConversations($where: ConversationWhereInput, $limit: Int, $page: Int, $sortedBy: BaseOrderByInput) {
  getConversations(where: $where, limit: $limit, page: $page, sortedBy: $sortedBy) {
    success
    total
    data {
      id
      title
      created_by
      status
      last_message_at
      is_active
      created_at
      updated_at
      last_message
      unread_count
      creator {
        email
        id
        fullname
        store_name
        shop_vip
      }
    }
    error {
      code
      message
    }
  }
}`

export const GET_MESSAGE = gql`
query Data($where: MessageWhereInput!, $limit: Int, $page: Int) {
  getMessages(where: $where, limit: $limit, page: $page) {
    data {
      id
      conversation_id
      conversation {
        id
        title
      }
      is_read
      sender_id
      attachment
      shop_sender {
        id
        email
        shop_vip
        store_name
      }
      admin_sender {
        id
        email
        firstName
        lastName
        image
      }
      reply_to_id
      replyTo {
        id
        text
      }
      text
      sender_type
      deleted_at
      is_active
      created_at
      updated_at
    }
    total
    success
    error {
      message
      code
    }
  }
}`

export const MUTATION_SEND_MESSAGE = gql`
mutation SendMessage($data: SendMessageInput!) {
  sendMessage(data: $data) {
    success
    error {
      message
    }
    data {
      id
      conversation_id
      conversation {
        id
        title
      }
      sender_id
      reply_to_id
      replyTo {
        id
      }
      text
      sender_type
      deleted_at
      is_active
      created_at
      updated_at
    }
  }
}`

export const MUTATION_REPLY_MESSAGE = gql`
mutation ReplyToMessage($data: ReplyToMessageInput!) {
  replyToMessage(data: $data) {
    success
    data {
      id
      replyTo {
        reply_to_id
        id
        text
      }
      reply_to_id
      sender_id
      shop_sender {
        id
        email
      }
      text
      admin_sender {
        id
        email
      }
      attachment
      is_read
      sender_type
      type
    }
    error {
      message
    }
  }
}`

export const MUTATION_DELETE_MESSAGE = gql`
mutation DeleteMessage($messageId: ID!) {
  deleteMessage(messageId: $messageId) {
    success
    error {
      message
      code
    }
  }
}`

export const MUTATION_MARKREAD = gql`
mutation MarkMessageAsRead($conversationId: ID!) {
  markMessageAsRead(conversationId: $conversationId) {
    success
  }
}`

export const GET_UNREDMESSAGE = gql`
query GetUnreadMessage {
  getUnreadMessage {
    success
    error {
      message
      code
    }
    total
  }
}`