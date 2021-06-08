import * as React from "react";
import { createStyles, Grid, makeStyles, Theme, Typography, useMediaQuery } from "@material-ui/core";
import { Link } from "react-router-dom";

import { MovieInfo, MovieList } from "API";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
      [theme.breakpoints.up("md")]: {
        marginTop: theme.spacing(6),
      },
    },
    title: {
      margin: theme.spacing(1, 0),
    },
    rankItem: {
      display: "flex",
      textDecoration: "none",
      margin: theme.spacing(0.5, 0),
    },
    rankNum: {
      width: "24px",
      textAlign: "center",
      marginRight: theme.spacing(1),
      fontWeight: "bold",
    },
  })
);

interface RankPropTypes {
  data: Array<MovieList>;
  loading: boolean;
}

export function Rank(props: RankPropTypes) {
  const { data = [] } = props;

  const mobile = useMediaQuery("(max-width: 600px)");

  const formatData: (data: Array<MovieList>) => Array<MovieInfo> = (data) => {
    if (mobile) return data.map((item) => item.data.info).slice(0, 10);

    return data.map((item) => item.data.info);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h6" className={classes.title}>
        全站热搜
      </Typography>

      <Grid container>
        {formatData(data).map((movieItem: MovieInfo, index) => (
          <Grid item xs={6} sm={4} key={movieItem.id}>
            <Typography component="div" className={classes.rankItem} color={index < 3 ? "secondary" : "inherit"}>
              <Typography className={classes.rankNum}>{index + 1}</Typography>
              <Typography
                noWrap
                component={Link}
                to={{
                  pathname: "/resource",
                  search: `?id=${movieItem.id}`,
                }}
                color={index < 3 ? "secondary" : "inherit"}
                style={{ textDecoration: "none" }}
              >
                {movieItem.cnname}
              </Typography>
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
