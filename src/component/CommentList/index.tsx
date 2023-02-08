import * as React from "react";
import { Divider, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import Pagination from "@material-ui/lab/Pagination";
import { Adsense } from "@ctrl/react-adsense";

import { Comment, getComment } from "API";
import { CommentCard } from "../CommentCard";

import { useStyles } from "./styled";
import { formatComment } from "../../utils";

interface CommentListPropTypes {
  id: number;
  loading: boolean;
  commentList: Array<Comment>;
  setCommentList: any;
}

export function CommentList(props: CommentListPropTypes) {
  const { id, loading, commentList, setCommentList } = props;

  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const PAGE_SIZE = 20;
  const [page, setPage] = React.useState<number>(1);
  const [count, setCount] = React.useState<number>(0);
  const [listLoading, setListLoading] = React.useState<boolean>(true);
  // const [commentList, commentList] = React.useState<Array<Comment>>([]);

  const [replyId, setReplyId] = React.useState<number | string>(id);
  const pageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    // if current page equals new page, just scroll to top
    if (page !== value) {
      setListLoading(true);
      setCommentList([]);
      setPage(value);
    }
    document.getElementById("scroll")?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    const requestParams = {
      resource_id: id,
      page,
      size: PAGE_SIZE,
      comment_id: window.location.href.split("#")[1] || undefined,
    };

    getComment(requestParams)
      .then((res) => {
        if (res) {
          // @ts-ignore
          setCommentList((pre) => (page === 1 ? res.data.data : pre.concat(res.data.data)));
          setCount(res.data.count);
        }
        setListLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(`获取评论列表出错: ${error.message}`, { variant: "error" });

        setListLoading(false);
      });
  }, [page, id, enqueueSnackbar, setCommentList]);

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
            <Skeleton variant="rect" className="comment" height={32} />
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
                resourceId={id}
                commentId={comment.id}
                username={comment.username}
                key={comment.id}
                date={comment.date}
                ua={comment.browser}
                floor={count - index}
                content={formatComment(comment.content)}
                group={comment.group}
                childrenComment={comment.children}
                childrenCount={comment.childrenCount}
                parentId={comment.id}
                replyId={replyId}
                setReplyId={setReplyId}
                setCommentList={setCommentList}
              />
            ))}
          </div>

          {process.env.REACT_APP_ADSENSE ? (
            <>
              <Divider className={classes.hr} />

              <Adsense
                className="adsbygoogle"
                client={`ca-pub-${process.env.REACT_APP_ADSENSE}`}
                slot="7052550390"
                style={{ display: "block" }}
                format="autorelaxed"
              />

              <Divider className={classes.hr} />
            </>
          ) : null}

          <div className={classes.hasMore}>
            <Pagination
              count={Math.ceil(count / PAGE_SIZE)}
              page={page}
              onChange={pageChange}
              showFirstButton
              showLastButton
              color="primary"
              shape="rounded"
            />
          </div>
        </>
      )}
    </section>
  );
}
