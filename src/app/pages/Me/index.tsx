import * as React from "react";
import { setTitle } from "utils";
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

import { Favorite as FavoriteIcon, FavoriteBorder as UnFavoriteIcon, Share as ShareIcon } from "@material-ui/icons";

import { getLike, ResourceInfo } from "API";

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
  })
);

export function MePage() {
  setTitle("个人中心");

  const [likeList, setLikeList] = React.useState<{ [key: string]: Array<ResourceInfo> }>({});
  const [likeLength, setLikeLength] = React.useState<number>(0);

  const mobile = useMediaQuery("(max-width: 600px)");
  const classes = useStyles();

  React.useEffect(() => {
    getLike()
      .then((res) => {
        if (res) {
          let category: { [key: string]: Array<ResourceInfo> } = {};
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
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container className={classes.container}>
      <Typography variant="h5" component="h2" className={classes.title}>
        个人中心
      </Typography>

      <Typography>总共收藏了 {likeLength} 部资源</Typography>

      {Object.keys(likeList).map((key) => (
        <section key={key} className={classes.section}>
          <Typography variant="h6" gutterBottom>
            {key}
            <Typography component="span" className={classes.badge} variant="caption">
              {likeList[key].length > 99 ? "99+" : likeList[key].length}
            </Typography>
          </Typography>

          <Grid container spacing={mobile ? 1 : 2}>
            {likeList[key].map((item) => (
              <Grid item xs={6} sm={4} md={3}>
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Typography noWrap>{item.cnname}</Typography>
                      <Typography noWrap variant="body2">
                        {item.enname}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="secondary" variant="outlined">
                      取消收藏
                    </Button>
                    <Button size="small" color="primary" variant="contained" disableElevation>
                      分享资源
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </section>
      ))}
    </Container>
  );
}
