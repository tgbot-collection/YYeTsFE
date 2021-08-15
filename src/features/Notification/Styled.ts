import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: "calc(100vw - 24px)",
      maxHeight: 316,
      maxWidth: 350,
    },
    item: {
      display: "flex",
      width: "100%",
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    noBorder: {
      border: "none",
    },
    comment: {
      flex: 1,
      overflow: "hidden",
    },
    rely: {
      height: 48,
      borderRadius: 2,
      padding: "0 2px",
      fontSize: "12px",
      width: 54,
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
