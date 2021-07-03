import { createStyles, makeStyles, Theme } from "@material-ui/core";

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
        gridArea: "comment",
        wordBreak: "break-all",
        fontSize: "0.875rem",

        [theme.breakpoints.up("sm")]: {
          fontSize: "1rem",
        },
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
  })
);
