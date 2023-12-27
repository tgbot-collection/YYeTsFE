import * as React from "react";
import { Badge, Button, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { Notifications as NotificationsIcon } from "@material-ui/icons";
import { useLocation } from "react-router-dom";
import clsx from "clsx";

import { getNotifications, NoticeItem, patchNotifications } from "API";
import { formatComment, noop } from "utils";
import { useGoResourcePage } from "hooks";
import { useStyles } from "./Styled";

export function Notification() {
  const location = useLocation();
  const noticePopupState = usePopupState({ variant: "popover", popupId: "noticeMenu" });
  const toResourcePage = useGoResourcePage();

  const SIZE = 5;
  const [page, setPage] = React.useState<number>(1);
  const [readCount, setReadCount] = React.useState<number>(0);
  const [unReadCount, setUnReadCount] = React.useState<number>(0);
  const [readList, setReadList] = React.useState<Array<NoticeItem>>([]);
  const [unreadList, setUnReadList] = React.useState<Array<NoticeItem>>([]);

  const total = readCount + unReadCount;

  React.useEffect(() => {
    getNotifications({ page: 1, size: SIZE })
      .then((res) => {
        setReadList(res.data.read_item);
        setUnReadList(res.data.unread_item);
        setReadCount(res.data.read_count);
        setUnReadCount(res.data.unread_count);
      })
      .catch(noop);
    setPage(1);
  }, [location]);

  React.useEffect(() => {
    if (page !== 1 && page * 5 < total) {
      getNotifications({ page, size: SIZE })
        .then((res) => {
          setReadList((pre) => res.data.read_item.concat(pre));
          setUnReadList((pre) => res.data.unread_item.concat(pre));
        })
        .catch(noop);
    }
  }, [total, page]);

  const handleClickComment = (notice: NoticeItem) => {
    patchNotifications({ comment_id: notice.id, verb: "read" }).catch(noop);
    noticePopupState.close();
    toResourcePage(notice.resource_id, notice.id, "");
  };

  const handleLoadMore = () => {
    setPage((pre) => pre + 1);
  };

  const classes = useStyles();

  return (
    <>
      <IconButton color="inherit" {...bindTrigger(noticePopupState)}>
        <Badge overlap="rectangular" badgeContent={unReadCount > 99 ? "99+" : unReadCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        {...bindMenu(noticePopupState)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        classes={{ list: classes.list }}
      >
        {total === 0 && (
          <Typography align="center" color="textSecondary">
            ╮(╯-╰)╭ 暂无消息
          </Typography>
        )}
        {unreadList.map((item, index) => (
          <MenuItem
            onClick={() => handleClickComment(item)}
            key={item.id}
            classes={{ root: clsx(classes.item, { [classes.noBorder]: index === unreadList.length - 1 }) }}
          >
            <div className={classes.comment}>
              <Typography noWrap color="textSecondary" style={{ fontSize: 14 }}>
                <Typography variant="subtitle1" component="span" color="textPrimary">
                  {item.username}
                </Typography>
                &nbsp;回复了我的评论
              </Typography>
              <Typography variant="body2" noWrap>
                {formatComment(item.content).text}
              </Typography>
            </div>
            <Typography variant="body2" className={classes.rely} color="textSecondary">
              {formatComment(item.reply_to_content).text}
            </Typography>
          </MenuItem>
        ))}

        {unreadList.length > 0 && readList.length > 0 && (
          <Typography align="center" color="primary">
            已读消息
          </Typography>
        )}

        {readList.map((item, index) => (
          <MenuItem
            onClick={() => handleClickComment(item)}
            key={item.id}
            classes={{ root: clsx(classes.item, { [classes.noBorder]: index === readList.length - 1 }) }}
          >
            <div className={classes.comment}>
              <Typography noWrap color="textSecondary" style={{ fontSize: 14 }}>
                <Typography variant="subtitle1" component="span" color="textPrimary">
                  {item.username}
                </Typography>
                &nbsp;回复了我的评论
              </Typography>
              <Typography variant="body2" noWrap>
                {formatComment(item.content).text}
              </Typography>
            </div>
            <Typography variant="body2" className={classes.rely} color="textSecondary">
              {formatComment(item.reply_to_content).text}
            </Typography>
          </MenuItem>
        ))}

        {total > page * SIZE && (
          <Button onClick={handleLoadMore} fullWidth>
            加载更多
          </Button>
        )}
      </Menu>
    </>
  );
}
