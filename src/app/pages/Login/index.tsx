import * as React from "react";
import * as yup from "yup";
import { Button, createStyles, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import { Cached as CachedIcon, Send as SendIcon } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { logout, setTitle, toAbsoluteUrl } from "utils";
import { postMetrics, postUser } from "API";
import { UserContext } from "../../Layout/UserContext";

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
  })
);

const validationSchema = yup.object({
  username: yup.string().required("请输入用户名"),
  password: yup.string().required("请输入密码"),
});

export function LoginPage() {
  setTitle("登录");

  const classes = useStyles();
  const history = useHistory();
  const { state } = useLocation<{ ref?: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { setName } = React.useContext(UserContext);

  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      postUser(values)
        .then(() => {
          setTimeout(() => {
            setLoading(false);
            history.push(state.ref || "/search");
          }, 1000);

          setName(values.username);
          localStorage.setItem("username", values.username);
          enqueueSnackbar("登录成功", { variant: "success" });

          postMetrics("user").catch();
        })
        .catch((error) => {
          setLoading(false);
          logout();

          if (error.isAxiosError) {
            enqueueSnackbar(error.response.data, { variant: "error" });

            return;
          }

          enqueueSnackbar(`登录失败：${error.message}`, { variant: "error" });
        });
    },
  });

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
            <Typography>未注册用户将会自动注册</Typography>
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
        </div>
      </div>
    </div>
  );
}
