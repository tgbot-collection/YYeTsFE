import * as React from "react";
import { Typography } from "@material-ui/core";

import { CommentInput, CommentList } from "component";

interface CommentPropTypes {
  id: number;
  loading: boolean;
  title?: string;
}

export function CommentComponent(props: CommentPropTypes) {
  const { id, loading, title = "" } = props;

  return (
    <div>
      {title && (
        <Typography component="h2" variant="h5" style={{ marginBottom: "16px" }}>
          {title}
        </Typography>
      )}

      <CommentInput resourceId={id} />
      <CommentList id={id} loading={loading} />
    </div>
  );
}
