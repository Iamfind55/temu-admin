import { gql } from "@apollo/client";

export const TRANSACTION_SUBSCRIPTION = gql`
  subscription TransactionSubscribe {
    transactionSubscribe {
      notification_type
    }
  }
`;

export const VIP_REQUEST_SUBSCRIPTION = gql`
  subscription SubscribeNewRequestVIP {
    subscribeNewRequestVIP {
      notification_type
    }
  }
`;

export const SUBSCRIPTION_ORDER = gql`
  subscription SubscribeNewOrder($shopId: ID) {
    subscribeNewOrder(shopId: $shopId) {
      notification_type
    }
  }
`;

export const SUBSCRIPTION_UPDATE_ORDER = gql`
  subscription SubscribeUpdateOrderStatus($shopId: ID) {
    subscribeUpdateOrderStatus(shopId: $shopId) {
      success
      message
      error {
        message
        code
        details
      }
    }
  }
`;

export const QUERY_COUNT_NEW_TRANSACTION = gql`
  query CountNewTransaction {
    countNewTransaction {
      total
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const QUERY_COUNT_VIP_REQUEST = gql`
  query CountShopRequestVIP {
    countShopRequestVIP {
      success
      total
      error {
        message
        code
        details
      }
    }
  }
`;

export const QUERY_COUNT_NO_PICK_UP_ORDER = gql`
  query CountNewOrder($orderStatus: OrderStatus!) {
    countNewOrder(order_status: $orderStatus) {
      success
      total
      error {
        message
        code
        details
      }
    }
  }
`;
export const SUBSCRIBE_SENDMESSAGE = gql`subscription SendMessage($conversationId: ID!) {
  sendMessage(conversationId: $conversationId) {
    id
    conversation_id
    conversation {
      id
      title
    }
    sender_id
    shop_sender {
      id
      email
      fullname
      store_name
      shop_vip
    }
    admin_sender {
      id
      firstName
      lastName
      email
      image
    }
    reply_to_id
    replyTo {
      id
      text
      sender_type
    }
    text
    sender_type
    deleted_at
    attachment
    is_active
    is_read
    is_deleted
    created_at
    updated_at
    type
  }
}
`

export const NEW_MESSAGE = gql`
subscription NewMessageForAdmin {
  newMessageForAdmin {
    id
    conversation_id
    conversation {
      id
      title
    }
    sender_id
    shop_sender {
      id
      email
      shop_vip
      store_name
      fullname
    }
    admin_sender {
      id
      firstName
      lastName
      email
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
    attachment
    is_active
    is_read
    is_deleted
    created_at
    updated_at
    type
  }
}`