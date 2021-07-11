import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    purple: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
    },
    source: {
      position: "absolute",
      right: 16,
      bottom: -2,
    },
    sketch: {
      display: "grid",
      height: 72,
      padding: "8px 16px",
      alignItems: "center",
      gridTemplateAreas: `
       'avatar name'
       'avatar comment'
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

      "& .comment": {
        gridArea: "comment",
      },
    },
  })
);
