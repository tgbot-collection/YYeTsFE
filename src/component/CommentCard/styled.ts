import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentItem: {
      margin: theme.spacing(2, 0),
      display: "grid",
      gridTemplateAreas: `
       'avatar name'
       'avatar comment'
       'avatar ua'
      `,
      gridTemplateColumns: "50px 1fr",
      gridGap: theme.spacing(1),

      "& .avatar": {
        gridArea: "avatar",
        position: "relative",
        width: "40px",
        height: "40px",

        "& .circle": {
          position: "absolute",
          bottom: -2,
          right: -2,
          height: 16,
          width: 16,
        },
      },
      "& .name": {
        gridArea: "name",
      },
      "& .ua": {
        gridArea: "ua",
        paddingBottom: theme.spacing(1),
        position: "relative",
      },
      "& .comment": {
        position: "relative",
        gridArea: "comment",
        wordBreak: "break-all",
        whiteSpace: "pre-wrap",
        fontSize: "0.875rem",
        overflow: "hidden",
        transition: theme.transitions.create("max-height", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),

        "& .at": {
          color: theme.palette.type === "light" ? theme.palette.success.light : theme.palette.success.dark,
        },
      },
      "&:last-child .ua": {
        borderBottom: `none`,
      },
      "& .floor": {
        position: "absolute",
        right: 4,
        bottom: 6,
      },
    },
    bottomBorder: {
      borderBottom: `1px dashed ${theme.palette.divider}`,
    },
    browser: {
      borderRadius: "4px",
      marginRight: theme.spacing(1),

      "&:last-child": {
        marginRight: theme.spacing(0),
      },
    },
    reply: {
      padding: 0,
      fontSize: "0.75rem",
      lineHeight: 1.66,
      minWidth: 40,
    },
    purple: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
    },
    button: {
      position: "absolute",
      bottom: 2,
      right: 0,
      backgroundColor: theme.palette.background.default,
    },
  })
);
