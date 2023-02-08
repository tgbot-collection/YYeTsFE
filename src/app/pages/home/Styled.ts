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
      paddingBottom: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        paddingTop: theme.spacing(16),
        paddingBottom: theme.spacing(0),
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
      backgroundImage: "linear-gradient(#0057b7 50%, 50%, #ffd700 100%)",
      WebkitBackgroundClip: "text",
      MozBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    button: {
      marginTop: theme.spacing(2),
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
