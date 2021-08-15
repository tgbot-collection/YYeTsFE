import axios from "./axiosConfig";

export type NoticeItem = {
  browser: string;
  content: string;
  reply_to_content: string;
  date: string;
  resource_id: number;
  type: "child";
  username: string;
  id: string;
};

interface GetNotificationParams {
  page: number;
  size: number;
}

interface GetNotificationRes {
  username: string;
  read_item: Array<NoticeItem>;
  unread_item: Array<NoticeItem>;
  unread_count: number;
  read_count: number;
}

export function getNotifications(params: GetNotificationParams) {
  return axios.get<GetNotificationRes>("/api/notification", { params });
}

interface PatchNotificationsRes {
  comment_id: string;
  verb: "unread" | "read";
}

export function patchNotifications(params: PatchNotificationsRes) {
  return axios.patch("/api/notification", params);
}
