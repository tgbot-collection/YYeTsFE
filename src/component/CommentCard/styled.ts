import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentItem: {
      margin: theme.spacing(2, 0),
      position: "relative",
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
        borderBottom: `1px dashed ${theme.palette.divider}`,
        paddingBottom: theme.spacing(1),
      },
      "& .comment": {
        gridArea: "comment",
        wordBreak: "break-all",
        fontSize: "0.875rem",

        [theme.breakpoints.up("sm")]: {
          fontSize: "1rem",
        },
      },
      "&:last-child .ua": {
        borderBottom: `none`,
      },
      "& .floor": {
        position: "absolute",
        bottom: 8,
        right: 4,
      },
    },
    browser: {
      borderRadius: "4px",
      marginRight: theme.spacing(1),

      "&:last-child": {
        marginRight: theme.spacing(0),
      },
    },
  })
);
