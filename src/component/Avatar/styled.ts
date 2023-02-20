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
    },
    circle: {
      position: "absolute",
      bottom: -2,
      right: -2,
      height: 16,
      width: 16,
    },
  })
);
