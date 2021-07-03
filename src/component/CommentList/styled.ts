import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentList: {
      marginTop: theme.spacing(4),

      "& .empty": {
        height: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    hasMore: {
      display: "flex",
      justifyContent: "center",
    },
    sketch: {
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
        width: "40px",
        height: "40px",
      },
      "& .name": {
        gridArea: "name",
      },
      "& .ua": {
        gridArea: "ua",
      },
      "& .comment": {
        gridArea: "comment",
      },
    },
  })
);
