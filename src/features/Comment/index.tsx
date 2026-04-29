import * as React from "react";
import { Link, Typography } from "@material-ui/core";

import { CommentInput, CommentList } from "component";
import { Comment } from "../../API";

interface CommentPropTypes {
  id: number;
  loading: boolean;
  title?: string;
}

export function CommentComponent(props: CommentPropTypes) {
  const { id, loading, title = "" } = props;
  const [commentList, setCommentList] = React.useState<Array<Comment>>([]);

  return (
    <div>
      {title && (
        <Typography component="h2" variant="h5" style={{ marginBottom: "16px" }}>
          {title}
        </Typography>
      )}

      <CommentInput resourceId={id} setCommentList={setCommentList} />
      <Typography gutterBottom>
        本站推荐使用
        <Link href="https://maomaoyun.org/#/register?code=kscCUYgT"> 猫猫云 VPN </Link>
        以获得最佳浏览体验
      </Typography>
      <br />
      <div id="scroll" />
      <CommentList id={id} loading={loading} commentList={commentList} setCommentList={setCommentList} />
    </div>
  );
}
