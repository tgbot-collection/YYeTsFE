/// <reference types="react-scripts" />
type GtagEvent =
  | "login" // 登陆
  | "logout" // 登出
  | "search" // 搜索
  | "download" // 下载
  | "metrics" // 查看数据统计
  | "back_old" // 返回旧版
  | "comment" // 评论
  | "add_to_favorite" // 添加到收藏
  | "remove_from_favorite" // 从收藏移除
  | "share"; // 分享页面

declare function gtag(event: "event", eventType: GtagEvent, option?: { [key: string]: any });
