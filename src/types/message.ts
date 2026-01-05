import { IEmployee } from "./employee";
import { IShopType } from "./shop";

export interface IConversation {
  id: string;
  title: string;
  created_by: string;
  status: string;
  last_message_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  creator: IShopType;
  last_message: string;
  unread_count: number;
}

export interface IMessage {
  id: string;
  conversation_id: string;
  conversation: any | null;
  is_read: boolean;
  sender_id: string;
  shop_sender: IShopType | null;
  admin_sender: IEmployee | null;
  reply_to_id: string | null;
  replyTo: IMessage | null;
  text: string | null;
  attachment: string | null;
  sender_type: "SHOP" | "ADMIN";
  deleted_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
