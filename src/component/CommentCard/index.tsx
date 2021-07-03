import * as React from "react";
import dayjs from "dayjs";
import { Avatar, SvgIcon, Typography } from "@material-ui/core";

import { formatAvatar, formatBrowser } from "utils";
import { UserGroup } from "API";
import { useStyles } from "./styled";

interface CommentCardPropTypes {
  username: string;
  date: string;
  ua: string;
  floor: number;
  content: string;
  group: Array<UserGroup>;
}

export function CommentCard(props: CommentCardPropTypes) {
  const { username, ua, date, floor, content, group } = props;
  const { os } = formatBrowser(ua);

  const classes = useStyles();

  return (
    <div className={classes.commentItem}>
      <div className="avatar">
        <Avatar style={{ fontSize: "0.875rem" }}>{formatAvatar(username)}</Avatar>
        {group.includes("admin") && (
          <SvgIcon className="circle" viewBox="0 0 1024 1024" titleAccess="管理员">
            ad
            <path
              d="M515.040168 509.675166m-487.499826 0a487.499825 487.499825 0 1 0 974.999651 0 487.499825 487.499825 0 1 0-974.999651 0Z"
              fill="#fecc11"
            />
            <path
              d="M328.695774 497.693329l169.176388 33.799511-140.205379 314.210269L701.563395 472.835487l-194.749563-31.832343 93.35103-267.355921z"
              fill="#FFFFFF"
            />
          </SvgIcon>
        )}
      </div>

      <div className="name">
        <Typography component="span" variant="h5" color="textPrimary">
          {username}
        </Typography>
      </div>

      <div className="ua">
        {os !== " " && (
          <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
            {os}
          </Typography>
        )}

        <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
          {dayjs(date).format("YYYY-MM-DD HH:mm")}
        </Typography>
      </div>

      <Typography className="comment">{content}</Typography>
      <Typography className="floor" variant="body2" component="span" color="textSecondary">
        # {floor}
      </Typography>
    </div>
  );
}
