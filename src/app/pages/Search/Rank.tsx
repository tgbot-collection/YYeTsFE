import * as React from "react";
import { createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import cls from "classnames";

import { MovieInfo } from "API";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        marginTop: theme.spacing(4),
      },
    },
    rankItem: {
      display: "flex",
    },
    rankNum: {
      width: "24px",
      textAlign: "center",
      marginRight: theme.spacing(1),
    },
    bold: {
      fontWeight: "bold",
    },
  })
);

interface RankPropTypes {
  data: Array<MovieInfo>;
  loading: boolean;
}

export function Rank(props: RankPropTypes) {
  const { data = [] } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h6">
        热榜
      </Typography>

      <Grid container>
        {data.map((movieItem: MovieInfo, index) => (
          <Grid item xs={6} sm={4} key={movieItem.id}>
            <Typography className={classes.rankItem}>
              <Typography className={cls(classes.rankNum, { [classes.bold]: index < 3 })} component="span">
                {index + 1}
              </Typography>
              {movieItem.cnname}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
