import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    comment: {
      width: "100%",
      borderRadius: "4px",
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      boxSizing: "border-box",

      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(1.5),
      },

      "& textarea": {
        width: "100%",
        outline: "none",
        resize: "none",
        minHeight: "146px",
        borderRadius: "4px",
        padding: theme.spacing(1),
        boxSizing: "border-box",
        border: `1px solid ${theme.palette.background.paper}`,
        backgroundColor: theme.palette.background.paper,
        color: "inherit",

        [theme.breakpoints.up("sm")]: {
          minHeight: "168px",
          fontSize: "18px",
        },

        "&:focus": {
          backgroundColor: theme.palette.background.default,
        },

        "&:hover": {
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    commentFooter: {
      display: "flex",
      marginTop: theme.spacing(0.5),
      justifyContent: "space-between",

      "& .left": {
        display: "flex",
        alignItems: "center",
      },

      "& input": {
        outline: "none",
        border: `1px solid ${theme.palette.background.paper}`,
        padding: theme.spacing(0.5, 1),
        borderRadius: "2px",
        height: "30px",
        lineHeight: "30px",
        width: "80px",
        marginLeft: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        color: "inherit",

        "&:focus": {
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.background.default}`,
        },

        "&:hover": {
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.background.default}`,
        },
      },

      "& img": {
        width: 80,
        height: 30,
        borderRadius: "2px",
      },
    },
    inputError: {
      border: `1px solid ${theme.palette.error.main} !important`,
    },
  })
);
