import * as React from "react";
import { Button, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";

import { Comment, getComment } from "API";
import { CommentCard } from "../CommentCard";

import { useStyles } from "./styled";

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
          <div key={index} className={classes.sketch}>
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
            {commentList.map((comment, index) => (
              <CommentCard
                username={comment.username}
                key={comment.id}
                date={comment.date}
                ua={comment.browser}
                floor={count - index}
                content={comment.content}
                group={comment.group}
              />
            ))}
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
