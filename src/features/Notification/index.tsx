import * as React from "react";
import { Badge, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { Notifications as NotificationsIcon } from "@material-ui/icons";
import { useLocation } from "react-router-dom";

import { getNotifications, NoticeItem } from "API";
import { formatComment, noop } from "utils";
import { useStyles } from "./Styled";

export function Notification() {
  const location = useLocation();
  const noticePopupState = usePopupState({ variant: "popover", popupId: "noticeMenu" });

  const [noticeList, setNoticeList] = React.useState<Array<NoticeItem>>([]);

  React.useEffect(() => {
    getNotifications()
      .then((res) => {
        setNoticeList(res.data.notice);
        console.log(res.data.notice);
      })
      .catch(noop);
  }, [location]);

  const classes = useStyles();

  return (
    <>
      <IconButton color="inherit" {...bindTrigger(noticePopupState)}>
        <Badge badgeContent={noticeList.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        {...bindMenu(noticePopupState)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {noticeList.map((item) => (
          <MenuItem onClick={noticePopupState.close} key={item.id}>
            <div className={classes.item}>
              <div className={classes.comment}>
                <Typography noWrap color="textSecondary" style={{ fontSize: 14 }}>
                  <Typography variant="subtitle1" component="span" color="textPrimary">
                    {item.username}
                  </Typography>{" "}
                  回复了我的评论
                </Typography>
                <Typography variant="body2" noWrap>
                  {formatComment(item.content).text}
                </Typography>
              </div>
              <Typography variant="body2" className={classes.rely} color="textSecondary">
                这是被回复的评论这是被回复的评论这是被回复的评论这是被回复的评论
              </Typography>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
