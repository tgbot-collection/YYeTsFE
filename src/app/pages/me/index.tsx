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
  Divider,
  TextField,
  Grid,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { getLike, patchLike, postMetrics, ResourceInfo, patchUser, verifyEmail } from "API";
import { useSnackbar } from "notistack";
import CopyToClipboard from "react-copy-to-clipboard";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emailWidth: {
      width: 350,
    },
    hr: {
      margin: theme.spacing(4, 0),
      [theme.breakpoints.up("sm")]: {
        margin: theme.spacing(6, 0),
      },
    },
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

const emailRegex = /@gmail\.com|@outlook\.com|@qq\.com|@163\.com/gi;

let validationSchema = yup.object({
  input: yup.string().email().matches(emailRegex, "不支持的邮箱").required("请输入邮箱"),
});

export function MePage(props: any) {
  const { verified, address } = props;
  setTitle("个人中心");
  const { enqueueSnackbar } = useSnackbar();
  const [display, setDisplay] = React.useState<boolean>(false);

  const [likeList, setLikeList] = React.useState<{ [key: string]: Array<ResourceInfo> }>({});
  const [likeLength, setLikeLength] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [input, setInput] = React.useState<string>("");
  const [inputError, setInputError] = React.useState<boolean>(false);
  const initialState = {
    type: "邮箱",
    help: "仅支持Gmail, QQ, 163和outlook",
    typography: "您还未添加邮箱，请验证邮箱以获得评论功能",
  };
  const [helperText, setHelperText] = React.useState(initialState);
  const mobile = useMediaQuery("(max-width: 600px)");
  const classes = useStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (helperText.type === "邮箱") {
      validationSchema
        .validate({ input: event.target.value })
        .then(() => {
          setInputError(false);
        })
        .catch((err) => {
          setInputError(true);
        });
    } else {
      validationSchema = yup.object({
        input: yup.string().required("请输入验证吗"),
      });
    }
  };

  const handleVerifyButton = () => {
    if (helperText.type === "邮箱") {
      patchUser({ email: input })
        .then((r) => {
          enqueueSnackbar(r.data.message, { variant: "success" });
          setHelperText({ typography: helperText.typography, type: "验证", help: "请打开你的邮箱查看验证码" });
        })
        .catch((e) => {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        });
      setInput("");
    } else {
      verifyEmail({ code: input })
        .then((r) => {
          enqueueSnackbar(r.data.message, { variant: "success" });
          setHelperText({ typography: `你的邮箱已验证成功。`, type: "", help: "" });
          setDisplay(false);
        })
        .catch((e) => {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        });
    }
  };

  React.useEffect(() => {
    if (verified) {
      setDisplay(false);
      setHelperText({
        type: "",
        help: "",
        typography: `你的邮箱${address}已验证成功。 `,
      });
    } else {
      setDisplay(true);
    }
  }, [verified, address]);

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

        <Divider className={classes.hr} />
        <div className={classes.emailWidth}>
          <Typography>{helperText.typography}</Typography>

          {display && (
            <>
              <TextField
                id="email"
                error={inputError}
                label={helperText.type}
                helperText={helperText.help}
                fullWidth
                value={input}
                onChange={handleInputChange}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={handleVerifyButton}
                disabled={inputError || input.length === 0}
              >
                验证
              </Button>
            </>
          )}
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

            <Divider className={classes.hr} />
            <div className={classes.emailWidth}>
              <Typography>{helperText.typography}</Typography>

              {display && (
                <>
                  <TextField
                    id="email"
                    error={inputError}
                    label={helperText.type}
                    helperText={helperText.help}
                    fullWidth
                    value={input}
                    onChange={handleInputChange}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleVerifyButton}
                    disabled={inputError || input.length === 0}
                  >
                    验证
                  </Button>
                </>
              )}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
