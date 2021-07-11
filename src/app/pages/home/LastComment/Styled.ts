import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    purple: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
    },
    source: {
      position: "absolute",
      right: 16,
      bottom: -2,
    },
  })
);
