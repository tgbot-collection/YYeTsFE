import * as React from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import {
  Explore as ExploreIcon,
  MovieFilter as MovieFilterIcon,
  Visibility as VisibilityIcon,
} from "@material-ui/icons";
import queryString from "query-string";

import { getResourceByID, MovieDetail } from "API";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(6),
      },
    },
    title: {
      marginRight: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        marginRight: theme.spacing(4),
      },
    },
    enTitle: {
      alignSelf: "flex-end",
    },
    alias: {
      marginTop: theme.spacing(1),
    },
    attribute: {
      marginTop: theme.spacing(3),
    },
    label: {
      marginLeft: theme.spacing(1),
    },
  })
);

export function ResourcePage() {
  const location = useLocation();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [movieInfo, setMovieInfo] = React.useState<MovieDetail>();

  React.useEffect(() => {
    const { id } = queryString.parse(location.search);
    getResourceByID(id as string).then((res) => {
      if (res) {
        console.log(res.data);
        setMovieInfo(res.data.data.info);
      }
      setLoading(false);
    });
  }, [location.search]);

  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="md">
      <Box css={{ display: "flex", flexWrap: "wrap" }}>
        <Typography component="h1" variant="h4" className={classes.title}>
          {loading ? <Skeleton variant="rect" width={200} /> : movieInfo?.cnname}
        </Typography>

        <Typography className={classes.enTitle}>
          {loading ? <Skeleton variant="rect" width={100} /> : movieInfo?.enname}
        </Typography>
      </Box>
      <Typography className={classes.alias} variant="body2">
        {loading ? <Skeleton variant="rect" width="100%" /> : movieInfo?.aliasname}
      </Typography>

      <Grid container className={classes.attribute}>
        <Grid item xs={4} sm={3} md={2}>
          <Box display="flex" alignItems="center">
            <MovieFilterIcon />
            <Typography className={classes.label}>
              {loading ? <Skeleton variant="rect" width={50} height={24} /> : movieInfo?.channel_cn}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <Box display="flex" alignItems="center">
            <ExploreIcon />
            <Typography className={classes.label}>
              {loading ? <Skeleton variant="rect" width={50} height={24} /> : movieInfo?.area}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <Box display="flex" alignItems="center">
            <VisibilityIcon />
            <Typography className={classes.label}>
              {loading ? <Skeleton variant="rect" width={50} height={24} /> : movieInfo?.views}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
