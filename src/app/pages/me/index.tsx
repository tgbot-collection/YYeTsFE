import * as React from "react";
import { noop, setTitle, toAbsoluteUrl } from "utils";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { getLike, patchLike, postMetrics, ResourceInfo } from "API";
import { useSnackbar } from "notistack";
import CopyToClipboard from "react-copy-to-clipboard";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
    title: {
      marginBottom: theme.spacing(4),
    },
    section: {
      margin: theme.spacing(2, 0),
    },
    badge: {
      marginLeft: theme.spacing(1),
      backgroundColor: theme.palette.type === "light" ? theme.palette.secondary.light : theme.palette.secondary.dark,
      color: "#fff",
      display: "inline-block",
      textAlign: "center",
      padding: "0 2px",
      minWidth: 20,
      height: 20,
      lineHeight: "20px",
      borderRadius: 20,
      transform: "translate3d(0, -2px, 0)",
    },
    empty: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 360,

      "& img": {
        width: "200px",
        marginBottom: theme.spacing(2),
      },
    },
  })
);

export function MePage() {
  setTitle("个人中心");

  const { enqueueSnackbar } = useSnackbar();

  const [likeList, setLikeList] = React.useState<{ [key: string]: Array<ResourceInfo> }>({});
  const [likeLength, setLikeLength] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);

  const mobile = useMediaQuery("(max-width: 600px)");
  const classes = useStyles();

  React.useEffect(() => {
    setLoading(true);
    postMetrics("me").catch(noop);

    getLike()
      .then((res) => {
        if (res) {
          const category: { [key: string]: Array<ResourceInfo> } = {};
          const data = res.data.LIKE.map((item) => item.data.info);

          data.forEach((item) => {
            if (typeof item.channel_cn !== "string") return;

            if (category[item.channel_cn]) {
              category[item.channel_cn].push(item);

              return;
            }
            category[item.channel_cn] = [item];
          });

          setLikeLength(data.length);
          setLikeList(category);

          setLoading(false);
        }
      })
      .catch((error) => {
        enqueueSnackbar(`获取收藏资源失败: ${error.message}`, { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const handleUnfavorite = (event: React.SyntheticEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    let { id, category } = target.dataset;

    if (!id) {
      // @ts-ignore
      id = target.parentNode.dataset.id;
      // @ts-ignore
      category = target.parentNode.dataset.category;
    }

    patchLike({ resource_id: id as string })
      .then((res) => {
        enqueueSnackbar(res.data, { variant: "success" });
        setLikeList((pre) => {
          const newList = pre;
          newList[category!] = newList[category!].filter((item) => item.id !== Number(id));

          return { ...newList };
        });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });

    gtag("event", "remove_from_favorite", { resource_id: id, form: "me" });
    postMetrics("unFavorite").catch(noop);
  };

  if (loading)
    return (
      <Container className={classes.container}>
        <Typography variant="h5" component="h2" className={classes.title}>
          个人中心
        </Typography>
        <Skeleton variant="rect" height={18} width={160} />
        <section className={classes.section}>
          <Skeleton variant="rect" width={80} height={32} style={{ marginBottom: 7 }} />
          <Grid container spacing={mobile ? 1 : 2}>
            {Array.from(new Array(8)).map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Skeleton variant="rect" width="100%" height={122} />
              </Grid>
            ))}
          </Grid>
        </section>
      </Container>
    );

  if (likeLength === 0)
    return (
      <Container className={classes.container}>
        <Typography variant="h5" component="h2" className={classes.title}>
          个人中心
        </Typography>

        <div className={classes.empty}>
          <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" />
          <Typography>暂无结果</Typography>
        </div>
      </Container>
    );

  return (
    <Container className={classes.container}>
      <Typography variant="h5" component="h2" className={classes.title}>
        个人中心
      </Typography>

      <Typography>总共收藏了 {likeLength} 部资源</Typography>

      {Object.keys(likeList).map((key) => {
        if (likeList[key].length === 0) return null;

        return (
          <section key={key} className={classes.section}>
            <Typography variant="h6" gutterBottom>
              {key}
              <Typography component="span" className={classes.badge} variant="caption">
                {likeList[key].length > 99 ? "99+" : likeList[key].length}
              </Typography>
            </Typography>

            <Grid container spacing={mobile ? 1 : 2}>
              {likeList[key].map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Card>
                    <CardActionArea component={Link} to={`/resource?id=${item.id}`}>
                      <CardContent>
                        <Typography noWrap>{item.cnname}</Typography>
                        <Typography noWrap variant="body2">
                          {item.enname}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button
                        size="small"
                        color="secondary"
                        variant="outlined"
                        onClick={handleUnfavorite}
                        data-id={item.id}
                        data-category={key}
                      >
                        取消收藏
                      </Button>
                      <CopyToClipboard
                        text={`${process.env.REACT_APP_DOMAIN}/resource?id=${item.id}`}
                        onCopy={() => {
                          enqueueSnackbar("地址复制成功，快去分享给小伙伴吧", { variant: "success" });
                          gtag("event", "share", { resource_id: item.id, form: "me" });
                          postMetrics("share").catch(noop);
                        }}
                      >
                        <Button size="small" color="primary" variant="contained" disableElevation>
                          分享资源
                        </Button>
                      </CopyToClipboard>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </section>
        );
      })}
    </Container>
  );
}
