import * as React from "react";
import * as yup from "yup";
import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
  Link,
  Tooltip,
  Divider,
  SvgIcon,
} from "@material-ui/core";
import {
  Cached as CachedIcon,
  Send as SendIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
} from "@material-ui/icons";

import { ReactComponent as GoogleTinyIcon } from "super-tiny-icons/images/svg/google.svg";
import { ReactComponent as MSTinyIcon } from "super-tiny-icons/images/svg/microsoft.svg";

import { useHistory, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { logout, noop, randomString, setTitle, toAbsoluteUrl } from "utils";
import { getCaptcha, postMetrics, postUser } from "API";
import { useAppDispatch } from "hooks";
import { setUsername } from "app/pages/login/userSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      minHeight: "100vh",

      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    left: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "35%",
      maxWidth: "600px",

      "& img": {
        width: "80%",
      },

      [theme.breakpoints.down("xs")]: {
        width: "100%",
        height: 200,
        margin: theme.spacing(4, 0),

        "& img": {
          width: "auto",
          height: "80%",
        },
      },
    },
    right: {
      background: theme.palette.background.paper,
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      [theme.breakpoints.down("xs")]: {
        alignItems: "flex-start",

        paddingTop: theme.spacing(8),
      },
    },
    container: {
      maxWidth: 300,
      width: "80%",
    },
    formControl: {
      margin: theme.spacing(1, 0),
    },
    login: {
      marginBottom: theme.spacing(2),
    },
    captcha: {
      display: "flex",
      alignItems: "center",

      "& img": {
        width: 80,
        height: 30,
        margin: "16px 0 0 8px",
      },
    },
  })
);

const validationSchema = yup.object({
  username: yup.string().required("请输入用户名"),
  password: yup.string().required("请输入密码"),
  captcha: yup.string().required("请输入验证码"),
});

export function LoginPage() {
  setTitle("登录");

  const classes = useStyles();
  const history = useHistory();
  const { state } = useLocation<{ ref?: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);

  const [captcha, setCaptcha] = React.useState<string>("");
  const [captchaID, setCaptchaID] = React.useState<string>(randomString());

  const refreshCaptchaID = () => {
    setCaptchaID(randomString());
  };

  const setLogin = React.useCallback(
    (username: string, group: any) => {
      dispatch(setUsername({ username, group }));
      localStorage.setItem("username", username);
    },
    [dispatch]
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      captcha: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);

      postUser({ ...values, captcha_id: captchaID })
        .then((res) => {
          setTimeout(() => {
            setLoading(false);
            history.push(state?.ref || "/search");
          }, 1000);
          gtag("event", "login", { method: "password" });
          postMetrics("user").catch(noop);
          setLogin(res.data.username, res.data.group);
          enqueueSnackbar("登录成功", { variant: "success" });
        })
        .catch((error) => {
          setLoading(false);
          logout();
          refreshCaptchaID();

          if (error.isAxiosError) {
            enqueueSnackbar(error.response.data.message || error.message, { variant: "error" });
            return;
          }

          enqueueSnackbar(`登录失败：${error.message}`, { variant: "error" });
        });
    },
  });

  React.useEffect(() => {
    getCaptcha(captchaID)
      .then((res) => setCaptcha(res.data))
      .catch((error) => {
        enqueueSnackbar(`验证码获取错误：${error.message}`, { variant: "error" });
      });
  }, [captchaID, enqueueSnackbar]);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get("status");
    const message = url.searchParams.get("message");
    const username = url.searchParams.get("username") || "";

    if (status === "success") {
      enqueueSnackbar(message, { variant: "success" });
      setLogin(username, ["user"]);
      // 2秒钟之后跳转到首页
      setTimeout(() => {
        history.push("/");
      }, 2000);
    } else if (status === "fail") {
      enqueueSnackbar(message, { variant: "error" });
    }
  }, [enqueueSnackbar, history, setLogin]);

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <img src={toAbsoluteUrl("/svg/login.svg")} alt="login" />
      </div>
      <div className={classes.right}>
        <div className={classes.container}>
          <div className={classes.login}>
            <Typography gutterBottom variant="h4">
              登录
            </Typography>
            <Typography>未注册用户将会自动注册，需要验证邮箱才可以发表评论。</Typography>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              name="username"
              label="账号"
              className={classes.formControl}
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              fullWidth
              name="password"
              label="密码"
              type="password"
              className={classes.formControl}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <div className={classes.captcha}>
              <TextField
                fullWidth
                name="captcha"
                label="验证码"
                className={classes.formControl}
                value={formik.values.captcha}
                onChange={formik.handleChange}
                error={formik.touched.captcha && Boolean(formik.errors.captcha)}
                helperText={formik.touched.captcha && formik.errors.captcha}
                inputProps={{ maxLength: 4, autoComplete: "off" }}
                style={{ flex: 1 }}
              />
              {/* eslint-disable */}
              <img src={captcha} alt="验证码" onClick={() => refreshCaptchaID()} />
            </div>
            <div className={classes.formControl}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                endIcon={loading ? <CachedIcon /> : <SendIcon />}
                disabled={loading}
              >
                {loading ? "登录中" : "提交"}
              </Button>
            </div>
          </form>
          <Divider />
          <Typography>使用第三方登录，无需验证邮箱</Typography>
          <Tooltip title="使用GitHub登录，你的GitHub用户名会是你的登录名">
            <Link href="/auth/github">
              <GitHubIcon />
            </Link>
          </Tooltip>
          &nbsp;
          <Tooltip title="使用Google登录，你的Gmail会是你的登录名">
            <Link href="/auth/google">
              <SvgIcon>
                <GoogleTinyIcon />
              </SvgIcon>
            </Link>
          </Tooltip>
          &nbsp;
          <Tooltip title="使用Twitter登录，你的Twitter用户名会是你的登录名">
            <Link href="/auth/twitter">
              <TwitterIcon />
            </Link>
          </Tooltip>{" "}
          &nbsp;
          <Tooltip title="使用Microsoft登录，你的邮箱会是你的登录名">
            <Link href="/auth/microsoft">
              <SvgIcon>
                <MSTinyIcon />
              </SvgIcon>
            </Link>
          </Tooltip>
          &nbsp;
          <Tooltip title="使用Facebook登录，你的姓名和数字ID会是你的登录名">
            <Link href="/auth/facebook">
              <FacebookIcon />
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
