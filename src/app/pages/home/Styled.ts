import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: theme.palette.primary.main,
      textAlign: "center",
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(8),
      [theme.breakpoints.up("md")]: {
        paddingTop: theme.spacing(16),
        paddingBottom: theme.spacing(8),
        flexDirection: "row",
        alignItems: "flex-start",
        textAlign: "left",
      },
    },
    logo: {
      flexShrink: 0,
      width: 120,
      height: 120,
      borderRadius: "50%",
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        marginRight: theme.spacing(8),
        width: 195,
        height: 195,
      },
    },
    title: {
      marginLeft: -12,
      whiteSpace: "nowrap",
      letterSpacing: ".7rem",
      textIndent: ".7rem",
      fontWeight: theme.typography.fontWeightLight,
      [theme.breakpoints.only("xs")]: {
        fontSize: 28,
      },
    },
    button: {
      marginTop: theme.spacing(4),
    },
    social: {
      padding: theme.spacing(2, 0),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 21,
      boxSizing: "content-box",
    },
    sponsor: {
      margin: "16px 0",
      display: "flex",
      alignItems: "center",

      "& img": {
        width: 40,
        height: 40,
      },
    },
  })
);
