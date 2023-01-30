import * as React from "react";
import { Typography } from "@material-ui/core";

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
      <br />
      <div id="scroll" />
      <CommentList id={id} loading={loading} commentList={commentList} setCommentList={setCommentList} />
    </div>
  );
}
