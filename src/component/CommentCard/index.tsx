import * as React from "react";
import clsx from "clsx";
import { Button, Hidden, Typography } from "@material-ui/core";

import { formatBrowser, formatComment, formatDate } from "utils";
import { UserGroup, Comment } from "API";
import { useDomeSize } from "hooks";
import { useStyles } from "./styled";
import { CommentInput } from "../CommentInput";
import { Avatar } from "../Avatar";

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
  /* 处于回复状态的id */
  replyId: string | number;
  setReplyId: (id: string) => void;
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
    replyId,
    setReplyId = () => {},
  } = props;

  const [rect, ref] = useDomeSize();
  console.log(rect);
  const [showMore, setShowMore] = React.useState<boolean>(false);
  const MAX_HEIGHT = 70;

  const { os, browser } = formatBrowser(ua);

  const handleClickReply = () => {
    setReplyId(commentId);
  };

  const classes = useStyles();
  const admin = group.includes("admin");

  const handleClick = () => {
    setShowMore((pre) => !pre);
  };

  return (
    <>
      <div className={classes.commentItem} id={commentId}>
        <Avatar className="avatar" admin={admin} username={username} />

        <div className="name">
          <Typography component="span" variant="h6" color="textPrimary">
            {username}
          </Typography>
        </div>

        <div className="comment" style={{ maxHeight: showMore ? `${rect.height}px` : MAX_HEIGHT }}>
          <Typography ref={ref} component="div">
            {content.id && (
              <>
                <a href={`#${content.id}`} className="at">
                  @{content.name}
                </a>
                ，
              </>
            )}
            {content.text}
            {rect.height > MAX_HEIGHT && (
              <div
                className={classes.button}
                style={{ display: showMore ? "inline-block" : "block", position: showMore ? "static" : "absolute" }}
              >
                <Button
                  onClick={handleClick}
                  color="primary"
                  style={{ padding: "0 4px", minWidth: "auto", lineHeight: "1.43", fontWeight: "bold" }}
                  disableRipple
                >
                  {showMore ? "收起" : "展开"}
                </Button>
              </div>
            )}
          </Typography>
        </div>

        <div className={clsx("ua", { [classes.bottomBorder]: borderBottom })}>
          {os !== " " && (
            <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
              {os}
            </Typography>
          )}
          <Hidden smDown>
            {browser !== " " && (
              <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
                {browser}
              </Typography>
            )}
          </Hidden>

          <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
            {formatDate(date)}
          </Typography>

          <Button className={classes.reply} onClick={handleClickReply}>
            回复
          </Button>

          {replyId === commentId && (
            <CommentInput
              resourceId={resourceId}
              style={{ marginTop: "8px" }}
              placeholder={`@${username}`}
              commentId={commentId}
              parentId={parentId}
              replyUser={username}
            />
          )}

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
                replyId={replyId}
                setReplyId={setReplyId}
              />
            ))}

          {floor && (
            <Typography className="floor" variant="body2" component="span" color="textSecondary">
              # {floor}
            </Typography>
          )}
        </div>
      </div>
    </>
  );
}
