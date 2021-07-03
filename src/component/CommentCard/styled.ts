import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentItem: {
      margin: theme.spacing(2, 0),
      position: "relative",
      display: "grid",
      gridTemplateAreas: `
       'avatar name'
       'avatar ua'
       'avatar comment'
      `,
      gridTemplateColumns: "44px 1fr",
      gridGap: theme.spacing(1),

      [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "62px 1fr",

        "& .avatar": {
          width: "50px",
          height: "50px",
        },
      },

      "& .avatar": {
        gridArea: "avatar",
        fontSize: "0.875rem",
        width: "40px",
        height: "40px",
      },
      "& .name": {
        gridArea: "name",
      },
      "& .ua": {
        gridArea: "ua",
        position: "relative",
        top: "-4px",
      },
      "& .comment": {
        gridArea: "comment",
        paddingBottom: theme.spacing(2.5),
        borderBottom: `1px dashed ${theme.palette.divider}`,
        wordBreak: "break-all",
        fontSize: "0.875rem",

        [theme.breakpoints.up("sm")]: {
          fontSize: "1rem",
        },
      },
      "&:last-child .comment": {
        borderBottom: `none`,
      },
      "& .floor": {
        position: "absolute",
        bottom: 2,
        right: 4,
      },
    },
    browser: {
      borderRadius: "4px",
      backgroundColor: theme.palette.background.paper,
      margin: theme.spacing(-0.25, -0.5),
      padding: theme.spacing(0.25, 0.5),

      "&:last-child": {
        marginLeft: theme.spacing(1),
      },
    },
  })
);
