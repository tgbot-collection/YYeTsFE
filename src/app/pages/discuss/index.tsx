import * as React from "react";
import { setTitle } from "utils";
import { Container, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

import { postMetrics } from "API";
import { CommentComponent } from "features";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
  })
);

export function DiscussPage() {
  setTitle("留言板");

  const classes = useStyles();

  React.useEffect(() => {
    postMetrics("discuss").catch();
  }, []);

  return (
    <Container className={classes.container}>
      <Typography component="h2" variant="h4" gutterBottom>
        留言板
      </Typography>
      <Typography gutterBottom style={{ marginBottom: "32px" }}>
        留下你想说的和建议吧
      </Typography>

      <CommentComponent id={233} loading={false} />
    </Container>
  );
}
