import * as React from "react";
import { Divider, Link, Typography, Select, MenuItem } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import Pagination from "@material-ui/lab/Pagination";

import { Comment, getComment } from "API";
import { CommentCard } from "../CommentCard";

import { useStyles } from "./styled";
import { formatComment, ShowAdsense } from "../../utils";

interface CommentListPropTypes {
  id: number;
  loading: boolean;
  commentList: Array<Comment>;
  setCommentList: any;
}

export function CommentList(props: CommentListPropTypes) {
  const showAdsense = ShowAdsense();
  const { id, loading, commentList, setCommentList } = props;

  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const PAGE_SIZE = 20;
  const [page, setPage] = React.useState<number>(1);
  const [count, setCount] = React.useState<number>(0);
  const [listLoading, setListLoading] = React.useState<boolean>(true);
  // const [commentList, commentList] = React.useState<Array<Comment>>([]);
  const [sort, setSort] = React.useState<string>("newest");
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

  const loadComment = React.useCallback(
    (s: string) => {
      const requestParams = {
        resource_id: id,
        page,
        size: PAGE_SIZE,
        comment_id: window.location.href.split("#")[1] || undefined,
        sort: s,
      };
      getComment(requestParams)
        .then((res) => {
          if (res) {
            setCommentList((pre: any) => (page === 1 ? res.data.data : pre.concat(res.data.data)));
            setCount(res.data.count);
          }
          setListLoading(false);
        })
        .catch((error) => {
          enqueueSnackbar(`获取评论列表出错: ${error.message}`, { variant: "error" });
          setListLoading(false);
        });
    },
    [page, id, enqueueSnackbar, setCommentList],
  );

  const handleSort = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSort(event.target.value as string);
    setListLoading(true);
    loadComment(event.target.value as string);
  };

  React.useEffect(() => {
    loadComment("newest");
  }, [loadComment]);

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
            <Select labelId="sort-select" id="sort-select" value={sort} onChange={handleSort}>
              <MenuItem value="newest">时间降序</MenuItem>
              <MenuItem value="oldest">时间升序</MenuItem>
            </Select>
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
                hasAvatar={comment.hasAvatar}
                hash={comment.hash}
              />
            ))}
          </div>

          <Divider className={classes.hr} />
          <Link href="https://burn.hair/?lang=zh-CN&utm_source=yyets" target="_blank" variant="body1">
            头顶冒火 OpenAI GPT 接口站，稳定快速，使用人工智能提高生产力！
          </Link>
          <br />
          <Link href="https://www.mmy234.com/#/register?code=XHn52jB3" target="_blank" variant="body2">
            搭配猫猫云VPN 月付¥10，100G流量，5设备同时在线，使用更流畅哦
          </Link>
          <Divider className={classes.hr} />

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
