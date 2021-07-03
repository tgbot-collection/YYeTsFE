import * as React from "react";
import dayjs from "dayjs";
import { Avatar, Typography } from "@material-ui/core";

import { formatBrowser } from "utils";
import { useStyles } from "./styled";

interface CommentCardPropTypes {
  username: string;
  date: string;
  ua: string;
  floor: number;
  content: string;
}

export function CommentCard(props: CommentCardPropTypes) {
  const { username, ua, date, floor, content } = props;
  const { browser, os } = formatBrowser(ua);

  const classes = useStyles();

  return (
    <div className={classes.commentItem}>
      <Avatar className="avatar">{username.substr(0, 3)}</Avatar>

      <div className="name">
        <Typography component="span" variant="h5" color="textPrimary">
          {username}
        </Typography>
        <Typography component="span" variant="body2" color="textSecondary" style={{ marginLeft: "16px" }}>
          {dayjs(date).format("YYYY-MM-DD HH:mm")}
        </Typography>
      </div>
      {browser !== " " && os !== " " && (
        <div className="ua">
          {browser !== " " && (
            <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
              {browser}
            </Typography>
          )}
          {os !== " " && (
            <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
              {os}
            </Typography>
          )}
        </div>
      )}
      <Typography className="comment">{content}</Typography>
      <Typography className="floor" variant="body2" component="span" color="textSecondary">
        # {floor}
      </Typography>
    </div>
  );
}
