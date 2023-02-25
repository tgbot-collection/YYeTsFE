import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrap: {
      position: "relative",
      width: 40,
      height: 40,
    },
    avatar: {
      fontSize: "0.875rem",
      height: theme.spacing(10),
      width: theme.spacing(10),
    },
    circle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      height: 20,
      width: 20,
    },
  })
);
