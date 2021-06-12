import * as React from "react";
import { setTitle } from "utils";
import { Container, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
  })
);

export function MePage() {
  setTitle("个人中心");

  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Typography>个人中心</Typography>

      <Typography>开发中...</Typography>
    </Container>
  );
}
