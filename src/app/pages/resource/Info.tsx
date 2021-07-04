import * as React from "react";
import { Box, Button, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  Explore as ExploreIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as UnFavoriteIcon,
  Share as ShareIcon,
  MovieFilter as MovieFilterIcon,
  Visibility as VisibilityIcon,
} from "@material-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

import { ResourceInfo, patchUser, postMetrics } from "API";
import { useAuth, useLogin } from "hooks";

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

interface InfoPropTypes {
  loading: boolean;
  resourceInfo: ResourceInfo;
  url: string;
  isLike: boolean;
  setIsLike: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

export function InfoComponent(props: InfoPropTypes) {
  const { loading, resourceInfo, url, isLike, setIsLike, id } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const history = useHistory();
  const login = useLogin();

  const { username } = useAuth();

  const [likeLoading, setLikeLoading] = React.useState<boolean>(false);

  const classes = useStyles();

  const handleClickFavorite = () => {
    if (!username) {
      enqueueSnackbar("请先登录", {
        variant: "warning",
        action: (key) => (
          <Button
            onClick={() => {
              closeSnackbar(key);
              history.push(login);
            }}
            color="inherit"
          >
            去登录
          </Button>
        ),
      });
      return;
    }

    if (!isLike) {
      gtag("event", "add_to_favorite", { resource_id: id, form: "resource" });
      postMetrics("favorite").catch();
    } else {
      gtag("event", "remove_from_favorite", { resource_id: id, form: "resource" });
      postMetrics("unFavorite").catch();
    }

    setLikeLoading(true);
    patchUser({ resource_id: id })
      .then((res) => {
        setLikeLoading(false);
        setIsLike((pre) => !pre);

        enqueueSnackbar(res.data, { variant: "success" });
      })
      .catch((error) => {
        setLikeLoading(false);
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  return (
    <div>
      <Box css={{ display: "flex", flexWrap: "wrap" }}>
        <Typography component="h1" variant="h4" className={classes.title}>
          {loading ? <Skeleton variant="rect" width={200} /> : resourceInfo.cnname}
        </Typography>

        <Typography className={classes.enTitle}>
          {loading ? <Skeleton variant="rect" width={100} /> : resourceInfo.enname}
        </Typography>
      </Box>
      <Typography className={classes.alias} variant="body2">
        {loading ? <Skeleton variant="rect" width="100%" /> : resourceInfo.aliasname}
      </Typography>
      <Grid container className={classes.attribute}>
        <Grid item xs={4} sm={3} md={2}>
          <Box display="flex" alignItems="center">
            {loading ? <Skeleton variant="circle" width={24} height={24} /> : <MovieFilterIcon />}
            <Typography className={classes.label}>
              {loading ? <Skeleton variant="rect" width={50} height={24} /> : resourceInfo.channel_cn}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <Box display="flex" alignItems="center">
            {loading ? <Skeleton variant="circle" width={24} height={24} /> : <ExploreIcon />}
            <Typography className={classes.label}>
              {loading ? <Skeleton variant="rect" width={50} height={24} /> : resourceInfo.area}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <Box display="flex" alignItems="center">
            {loading ? <Skeleton variant="circle" width={24} height={24} /> : <VisibilityIcon />}
            <Typography className={classes.label}>
              {loading ? <Skeleton variant="rect" width={50} height={24} /> : resourceInfo.views}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container className={classes.attribute}>
        <Grid item xs={4} sm={3} md={2}>
          {loading ? (
            <Skeleton variant="rect" width={100} height={30} />
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={isLike ? <UnFavoriteIcon /> : <FavoriteIcon />}
              onClick={handleClickFavorite}
              disabled={likeLoading}
            >
              {isLike ? "取消收藏" : "收藏资源"}
            </Button>
          )}
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          {loading ? (
            <Skeleton variant="rect" width={100} height={30} />
          ) : (
            <CopyToClipboard
              text={url}
              onCopy={() => {
                enqueueSnackbar("页面地址复制成功，快去分享给小伙伴吧", { variant: "success" });
                gtag("event", "share", { resource_id: id, form: "resource" });
                postMetrics("share").catch();
              }}
            >
              <Button variant="contained" color="primary" size="small" startIcon={<ShareIcon />}>
                分享页面
              </Button>
            </CopyToClipboard>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
