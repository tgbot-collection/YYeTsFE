import * as React from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { Avatar, Button, SvgIcon, Typography } from "@material-ui/core";

import { formatAvatar, formatBrowser, formatComment } from "utils";
import { UserGroup, Comment } from "API";
import { useStyles } from "./styled";
import { CommentInput } from "../CommentInput";

interface CommentCardPropTypes {
  resourceId: number;
  commentId: string;
  parentId?: string;
  username: string;
  date: string;
  ua: string;
  floor?: number;
  content: { text: string; id?: string; name?: string };
  group: Array<UserGroup>;
  childrenComment?: Array<Comment>;
  borderBottom?: boolean;
}

export function CommentCard(props: CommentCardPropTypes) {
  const {
    username,
    ua,
    date,
    floor,
    content,
    group,
    commentId,
    parentId,
    resourceId,
    childrenComment = [],
    borderBottom = true,
  } = props;

  const [replyState, setReplyState] = React.useState<boolean>(false);

  const { os } = formatBrowser(ua);

  const handleClickReply = () => {
    setReplyState((pre) => !pre);
  };

  const classes = useStyles();

  return (
    <>
      <div className={classes.commentItem} id={commentId}>
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

        <Typography className="comment">
          {content.id && (
            <>
              <a href={`#${content.id}`} className="at">
                @{content.name}
              </a>
              ，
            </>
          )}
          {content.text}
        </Typography>

        <div className={clsx("ua", { [classes.bottomBorder]: borderBottom })}>
          {os !== " " && (
            <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
              {os}
            </Typography>
          )}

          <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
            {dayjs(date).format("YYYY-MM-DD HH:mm")}
          </Typography>

          <Button className={classes.reply} onClick={handleClickReply}>
            回复
          </Button>

          {!!childrenComment.length &&
            childrenComment.map((item) => (
              <CommentCard
                key={item.id}
                resourceId={resourceId}
                commentId={item.id}
                parentId={commentId}
                username={item.username}
                date={item.date}
                ua={item.browser}
                content={formatComment(item.content)}
                group={item.group}
                borderBottom={false}
              />
            ))}

          {floor && (
            <Typography className="floor" variant="body2" component="span" color="textSecondary">
              # {floor}
            </Typography>
          )}

          {replyState && (
            <CommentInput
              resourceId={resourceId}
              style={{ marginTop: "8px" }}
              placeholder={`@${username}`}
              commentId={commentId}
              parentId={parentId}
              replyUser={username}
            />
          )}
        </div>
      </div>
    </>
  );
}
