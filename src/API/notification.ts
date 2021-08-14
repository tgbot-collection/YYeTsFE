import axios from "./axiosConfig";

export type NoticeItem = {
  browser: string;
  content: string;
  date: string;
  resource_id: number;
  status: boolean;
  type: "child";
  username: string;
  id: string;
};

interface GetNotificationRes {
  _id: string;
  username: string;
  notice: Array<NoticeItem>;
}

export function getNotifications() {
  return axios.get<GetNotificationRes>("/api/notification");
}
