import * as React from "react";
import clsx from "clsx";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Hidden,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import { formatBrowser, formatComment, formatDate } from "utils";
import { UserGroup, Comment, deleteComment, getChildComment } from "API";
import { useAppSelector, useDomeSize } from "hooks";
import { useStyles } from "./styled";
import { CommentInput } from "../CommentInput";
import { Avatar } from "../Avatar";
import * as tiny from "./tinyIcon";

interface CommentCardPropTypes {
  resourceId: number;
  commentId: string;
  parentId?: string;
  username: string;
  hasAvatar: boolean;
  hash: string;
  date: string;
  ua: string;
  floor?: number;
  content: { text: string; id?: string; name?: string };
  group: Array<UserGroup>;
  childrenComment?: Array<Comment>;
  childrenCount?: number;
  borderBottom?: boolean;
  /* 处于回复状态的id */
  replyId: string | number;
  setReplyId: React.Dispatch<React.SetStateAction<string | number>>;
  setCommentList?: React.Dispatch<React.SetStateAction<Array<Comment>>>;
}

function getIcon(name: string) {
  const browsers = [
    { name: "chrome", src: tiny.chrome },
    { name: "firefox", src: tiny.firefox },
    { name: "safari", src: tiny.safari },
    { name: "edge", src: tiny.edge },
    { name: "opera", src: tiny.opera },
    { name: "chromium", src: tiny.chromium },
    { name: "android", src: tiny.android },
    { name: "ios", src: tiny.apple },
    { name: "ipad", src: tiny.apple },
    { name: "iphone", src: tiny.apple },
    { name: "windows", src: tiny.windows },
    { name: "ubuntu", src: tiny.ubuntu },
    { name: "debian", src: tiny.debian },
    { name: "linux", src: tiny.linux },
    { name: "macos", src: tiny.macos },
    { name: "trident", src: tiny.ie },
    { name: "wechat", src: tiny.wechat },
    { name: "weixin", src: tiny.wechat },
    { name: "micromessenger", src: tiny.wechat },
    { name: "QQ", src: tiny.qq },
    { name: "miui", src: tiny.xiaomi },
  ];

  const browser = browsers.find((b) => name.toLowerCase().includes(b.name));
  const props = { src: browser ? browser.src : tiny.unknown };
  return <img {...props} alt={name} height="10em" />;
}

export function CommentCard(props: CommentCardPropTypes) {
  const {
    username,
    hasAvatar,
    hash,
    ua,
    date,
    floor,
    content,
    group,
    commentId,
    parentId,
    resourceId,
    childrenComment = [],
    childrenCount,
    borderBottom = true,
    replyId,
    setReplyId = () => {},
    setCommentList,
  } = props;

  const { group: userGroup } = useAppSelector((state) => state.user);

  const [showMore, setShowMore] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [childLoading, setChildLoading] = React.useState<boolean>(false);
  const [rect, ref] = useDomeSize();
  const { enqueueSnackbar } = useSnackbar();
  const childPageSize = 3;
  const [childPage, setChildPage] = React.useState(2);

  const handleChildClick = () => {
    setChildLoading(true);

    getChildComment({ parent_id: parentId, size: childPageSize, page: childPage })
      .then((res) => {
        // we can push to it thus trigger rerender
        childrenComment.push(...res.data.data);
        setChildPage((pre) => pre + 1);
      })
      .catch((error) => {
        enqueueSnackbar(`加载楼中楼失败: ${error.response.data}`, { variant: "error" });
      })
      .finally(() => {
        setChildLoading(false);
      });
  };

  const handleClickReply = () => {
    setReplyId((pre) => {
      if (pre === commentId) {
        return 0;
      }
      return commentId;
    });
  };

  const handleClick = () => {
    setShowMore((pre) => !pre);
  };

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteComment = () => {
    deleteComment({ comment_id: commentId })
      .then(() => {
        handleDialogClose();
        enqueueSnackbar("删除成功", { variant: "error" });
      })
      .catch((error) => {
        enqueueSnackbar(`删除出错: ${error.response.data.message}`, { variant: "error" });
      });
  };

  const classes = useStyles();
  const MAX_HEIGHT = 72;
  const { os, browser } = formatBrowser(ua);

  return (
    <>
      <div className={classes.commentItem} id={commentId}>
        <Avatar className="avatar" group={group} username={username} hasAvatar={hasAvatar} hash={hash} />

        <div className="name">
          <Typography component="span" variant="h6" color="textPrimary">
            {username}
          </Typography>
        </div>

        <div className="comment" style={{ maxHeight: showMore ? `${rect.height + 21}px` : MAX_HEIGHT }}>
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
                style={{
                  display: showMore ? "inline-block" : "block",
                  position: showMore ? "static" : "absolute",
                }}
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
          <Hidden smDown>
            {os !== " " && (
              <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
                {getIcon(os)} {os}
              </Typography>
            )}
          </Hidden>

          <Hidden smDown>
            {browser !== " " && (
              <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
                {getIcon(browser)} {browser}
              </Typography>
            )}
          </Hidden>

          <Typography variant="caption" component="span" color="textSecondary" className={classes.browser}>
            {formatDate(date)}
          </Typography>

          <Button className={classes.reply} onClick={handleClickReply}>
            回复
          </Button>

          {userGroup?.includes("admin") && (
            <>
              <Button color="secondary" className={classes.reply} onClick={handleClickDialogOpen}>
                删除
              </Button>

              <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>确认删除这条评论吗？</DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    <Typography>ID: {commentId}</Typography>
                    <Typography>用户: {username}</Typography>
                  </DialogContentText>
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleDialogClose} color="primary">
                    取消
                  </Button>
                  <Button onClick={handleDeleteComment} color="secondary" autoFocus>
                    删除
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          {replyId === commentId && (
            <CommentInput
              resourceId={resourceId}
              style={{ marginTop: "8px" }}
              placeholder={`@${username}`}
              commentId={commentId}
              parentId={parentId}
              replyUser={username}
              setCommentList={setCommentList}
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
                hasAvatar={item.hasAvatar}
                hash={item.hash}
                date={item.date}
                ua={item.browser}
                content={formatComment(item.content)}
                group={item.group}
                borderBottom={false}
                replyId={replyId}
                setReplyId={setReplyId}
              />
            ))}

          {!!childrenCount && childrenComment.length < childrenCount && (
            <div className={classes.hasMore}>
              <Button variant="outlined" onClick={handleChildClick}>
                {childLoading ? "努力加载中..." : "加载更多"}
              </Button>{" "}
            </div>
          )}

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
