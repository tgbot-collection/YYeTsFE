import * as React from "react";
import * as Bowser from "bowser";
import { Avatar, Button, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

import { Comment, getComment } from "API";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentList: {
      marginTop: theme.spacing(4),

      "& .empty": {
        height: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    commentItem: {
      margin: theme.spacing(2, 0),
      position: "relative",
      display: "grid",
      gridTemplateAreas: `
       'avatar name'
       'avatar ua'
       'avatar comment'
      `,
      gridTemplateColumns: "44px 1fr",
      gridGap: theme.spacing(1),

      [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "62px 1fr",

        "& .avatar": {
          width: "50px",
          height: "50px",
        },
      },

      "& .avatar": {
        gridArea: "avatar",
        fontSize: "0.875rem",
        width: "40px",
        height: "40px",
      },
      "& .name": {
        gridArea: "name",
      },
      "& .ua": {
        gridArea: "ua",
        position: "relative",
        top: "-4px",
      },
      "& .comment": {
        gridArea: "comment",
        paddingBottom: theme.spacing(2.5),
        borderBottom: `1px dashed ${theme.palette.divider}`,
        wordBreak: "break-all",
        fontSize: "0.875rem",

        [theme.breakpoints.up("sm")]: {
          fontSize: "1rem",
        },
      },
      "&:last-child .comment": {
        borderBottom: `none`,
      },
      "& .floor": {
        position: "absolute",
        bottom: 2,
        right: 4,
      },
    },
    hasMore: {
      display: "flex",
      justifyContent: "center",
    },

    browser: {
      borderRadius: "4px",
      backgroundColor: theme.palette.background.paper,
      margin: theme.spacing(-0.25, -0.5),
      padding: theme.spacing(0.25, 0.5),

      "&:last-child": {
        marginLeft: theme.spacing(1),
      },
    },
  })
);

interface CommentListPropTypes {
  id: number;
  loading: boolean;
}

export function CommentList(props: CommentListPropTypes) {
  const { id, loading } = props;

  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const PAGE_SIZE = 20;
  const [page, setPage] = React.useState<number>(1);
  const [count, setCount] = React.useState<number>(0);
  const [hasMore, setHasMore] = React.useState<boolean>(false);
  const [listLoading, setListLoading] = React.useState<boolean>(false);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [commentList, setCommentList] = React.useState<Array<Comment>>([]);

  const handleLoadMore = () => {
    if (hasMore) setPage((pre) => pre + 1);
  };

  const formatBowser = (browser: string) => {
    const result = Bowser.parse(browser);
    return {
      browser: `${result.browser.name} ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
    };
  };

  React.useEffect(() => {
    if (page === 1) setListLoading(true);
    else setLoadingMore(true);

    getComment({ resource_id: id, page, size: PAGE_SIZE })
      .then((res) => {
        if (res) {
          setCommentList((pre) => (page === 1 ? res.data.data : pre.concat(res.data.data)));
          setCount(res.data.count);
          setHasMore(page * PAGE_SIZE < res.data.count);
        }

        setListLoading(false);
        setLoadingMore(false);
      })
      .catch((error) => {
        enqueueSnackbar(`获取评论列表出错: ${error.message}`, { variant: "error" });

        setListLoading(false);
        setLoadingMore(false);
      });
  }, [page, id, enqueueSnackbar]);

  if (loading)
    return (
      <div>
        <Skeleton variant="rect" width={120} height={32} style={{ marginBottom: "16px" }} />
        <Skeleton variant="rect" width="100%" height={253} />
      </div>
    );

  return (
    <section className={classes.commentList}>
      {listLoading &&
        Array.from(new Array(4)).map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={classes.commentItem} key={index}>
            <Skeleton variant="circle" className="avatar" />
            <Skeleton variant="rect" className="name" width={180} height={32} />
            <Skeleton variant="rect" className="ua" width={240} height={18} />
            <Skeleton variant="rect" className="comment" style={{ borderBottom: "none" }} height={72} />
          </div>
        ))}
      {!listLoading && commentList.length === 0 && (
        <div className="empty">
          <Typography color="textSecondary">快来呀，第一条神评就是你啦～</Typography>
        </div>
      )}
      {!listLoading && commentList.length > 0 && (
        <>
          <div>
            {commentList.map((comment, index) => {
              const { browser, os } = formatBowser(comment.browser);

              return (
                <div className={classes.commentItem} key={comment.id}>
                  <Avatar className="avatar">{comment.username.substr(0, 3)}</Avatar>

                  <div className="name">
                    <Typography component="span" variant="h5" color="textPrimary">
                      {comment.username}
                    </Typography>
                    <Typography component="span" variant="body2" color="textSecondary" style={{ marginLeft: "16px" }}>
                      {dayjs(comment.date).format("YYYY-MM-DD HH:mm")}
                    </Typography>
                  </div>
                  {browser !== " " && os !== " " && (
                    <div className="ua">
                      {browser !== " " && (
                        <Typography
                          variant="caption"
                          component="span"
                          color="textSecondary"
                          className={classes.browser}
                        >
                          {browser}
                        </Typography>
                      )}
                      {os !== " " && (
                        <Typography
                          variant="caption"
                          component="span"
                          color="textSecondary"
                          className={classes.browser}
                        >
                          {os}
                        </Typography>
                      )}
                    </div>
                  )}
                  <Typography className="comment">{comment.content}</Typography>
                  <Typography className="floor" variant="body2" component="span" color="textSecondary">
                    # {count - index}
                  </Typography>
                </div>
              );
            })}
          </div>
          {hasMore && (
            <div className={classes.hasMore}>
              <Button onClick={handleLoadMore} disabled={loadingMore} variant="outlined">
                {listLoading ? "努力加载中..." : "加载更多"}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
