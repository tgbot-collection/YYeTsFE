import * as React from "react";
import * as yup from "yup";
import { Button, createStyles, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";

import { cancelGetCaptcha, getCaptcha, postComment } from "API";
import { randomString } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    authCode: {
      marginTop: theme.spacing(2),
      display: "flex",
      justifyContent: "space-between",

      "& img": {
        width: 80,
        height: 30,
      },

      "& input": {
        width: 80,
      },

      "& button": {
        alignSelf: "flex-end",
      },
    },
    comment: {
      maxWidth: 600,
    },
  })
);

const validationSchema = yup.object({
  content: yup.string().required("请输入评论内容"),
  captcha: yup.string().min(4, "验证码至少4位").required("请输入验证码"),
});

interface CommentPropTypes {
  id: number;
}

export function CommentComponent(props: CommentPropTypes) {
  const { id } = props;

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [captchaLoading, setCaptchaLoading] = React.useState<boolean>(true);
  const [captcha, setCaptcha] = React.useState<string>("");
  const [captchaID, setCaptchaID] = React.useState<string>(randomString());

  const [postLoading, setPostLoading] = React.useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      content: "",
      captcha: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setPostLoading(true);

      postComment({ resource_id: id, captcha: values.captcha, content: values.content, id: captchaID })
        .then((res) => {
          if (res) {
            enqueueSnackbar(res.data.message, { variant: "success" });
          }
        })
        .catch((error) => {
          if (error.isAxiosError) {
            enqueueSnackbar(`评论出错: ${error.response.data.message}`, { variant: "error" });
            return;
          }
          enqueueSnackbar(`评论出错: ${error.message}`, { variant: "error" });
        })
        .finally(() => {
          setPostLoading(false);
        });
    },
  });

  React.useEffect(() => {
    setCaptchaLoading(true);
    getCaptcha(captchaID)
      .then((res) => {
        if (res) {
          setCaptcha(res.data);
        }

        setCaptchaLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar("验证码获取错误", { variant: "error" });

        setCaptchaLoading(false);
      });

    return cancelGetCaptcha;
  }, [captchaID, enqueueSnackbar]);

  const refreshCaptcha = () => {
    if (captchaLoading) return;
    setCaptchaID(randomString());
  };

  return (
    <div>
      <Typography component="h2" variant="h5" style={{ marginBottom: "16px" }}>
        评论
      </Typography>

      <form className={classes.comment} onSubmit={formik.handleSubmit}>
        <TextField
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          multiline
          fullWidth
          inputProps={{ maxLength: 140 }}
          autoComplete="off"
          error={formik.touched.content && Boolean(formik.errors.content)}
          helperText={formik.touched.content && formik.errors.content}
        />

        <div className={classes.authCode}>
          <div style={{ display: "flex" }}>
            {captcha ? (
              <img src={captcha} alt="验证码" onClick={refreshCaptcha} />
            ) : (
              <Skeleton variant="rect" width={80} height={30} onClick={refreshCaptcha} />
            )}
            <TextField
              name="captcha"
              value={formik.values.captcha}
              onChange={formik.handleChange}
              inputProps={{ maxLength: 4 }}
              style={{ marginLeft: "16px" }}
              error={formik.touched.captcha && Boolean(formik.errors.captcha)}
              helperText={formik.touched.captcha && formik.errors.captcha}
            />
          </div>

          <Button variant="contained" size="small" endIcon={<SendIcon />} type="submit" disabled={postLoading}>
            发送
          </Button>
        </div>
      </form>
    </div>
  );
}
