import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
  })
);
