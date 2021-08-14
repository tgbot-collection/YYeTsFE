import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      display: "flex",
      width: "calc(100vw - 24px)",
      maxWidth: 350,
    },
    comment: {
      flex: 1,
      overflow: "hidden",
    },
    rely: {
      borderRadius: 2,
      padding: "0 2px",
      fontSize: "12px",
      width: 50,
      backgroundColor: theme.palette.background.default,
      overflow: "hidden",
      "text-overflow": "ellipsis",
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
      whiteSpace: "normal",
    },
  })
);
