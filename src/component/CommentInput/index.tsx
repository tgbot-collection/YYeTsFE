import * as React from "react";
import * as yup from "yup";
import clsx from "clsx";
import { Button, Typography } from "@material-ui/core";
import { Chat as SendIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";

import { cancelGetCaptcha, getCaptcha, postComment, postMetrics } from "API";
import { noop, randomString } from "utils";
import { useAuth, useLoginBack } from "hooks";
import { useStyles } from "./styled";

const validationSchema = yup.object({
  content: yup.string().trim().required("请输入评论内容"),
  captcha: yup.string().min(4, "验证码至少4位").required("请输入验证码"),
});

interface CommentInputPropTypes {
  resourceId: number;
  commentId?: string;
  parentId?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  replyUser?: string;
  // todo: 增加评论成功后的回调
}

export function CommentInput(props: CommentInputPropTypes) {
  const { resourceId, style, placeholder, commentId, replyUser, parentId } = props;

  const classes = useStyles();

  const MAX_LENGTH = 2048;
  const [postLoading, setPostLoading] = React.useState<boolean>(false);
  const [captchaLoading, setCaptchaLoading] = React.useState<boolean>(true);
  const [captcha, setCaptcha] = React.useState<string>("");
  const [captchaID, setCaptchaID] = React.useState<string>(randomString());

  const { username } = useAuth();

  const history = useHistory();
  const login = useLoginBack();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const refreshCaptcha = () => {
    if (captchaLoading) return;
    setCaptchaID(randomString());
  };

  const formik = useFormik({
    initialValues: {
      content: "",
      captcha: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!username) {
        enqueueSnackbar("请先登录后评论", {
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

      setPostLoading(true);

      postComment({
        resource_id: resourceId,
        captcha: values.captcha,
        content: replyUser
          ? `<reply value="${commentId}">@${replyUser}</reply>${values.content.trim()}`
          : values.content.trim(),
        id: captchaID,
        comment_id: parentId,
      })
        .then((res) => {
          setPostLoading(false);

          if (res) {
            resetForm();

            refreshCaptcha();
            enqueueSnackbar(res.data.message, { variant: "success" });
          }
        })
        .catch((error) => {
          setPostLoading(false);

          if (error.isAxiosError) {
            enqueueSnackbar(`评论出错: ${error.response.data.message}`, { variant: "error" });
            return;
          }
          enqueueSnackbar(`评论出错: ${error.message}`, { variant: "error" });
        });

      gtag("event", "comment", { resource_id: resourceId });
      postMetrics("comment").catch(noop);
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
        enqueueSnackbar(`验证码获取错误: ${error.message}`, { variant: "error" });

        setCaptchaLoading(false);
      });

    return cancelGetCaptcha;
  }, [captchaID, enqueueSnackbar, resourceId]);

  return (
    <form className={classes.comment} onSubmit={formik.handleSubmit} style={style}>
      <textarea
        name="content"
        maxLength={MAX_LENGTH}
        placeholder={placeholder || (username ? `欢迎 ${username}，畅所欲言吧～` : "您还未登录哦，先去登录吧～")}
        autoComplete="off"
        value={formik.values.content}
        onChange={formik.handleChange}
        className={clsx({ [classes.inputError]: formik.touched.content && Boolean(formik.errors.content) })}
      />

      <div className={classes.commentFooter}>
        <div className="left">
          {/* eslint-disable-next-line */}
          <img src={captcha} alt="验证码" onClick={refreshCaptcha} />
          <input
            placeholder="验证码"
            maxLength={4}
            name="captcha"
            autoComplete="off"
            value={formik.values.captcha}
            onChange={formik.handleChange}
            className={clsx({ [classes.inputError]: formik.touched.content && formik.errors.captcha })}
          />
        </div>
        <div className="left">
          <Typography
            variant="body2"
            color={formik.values.content.length >= MAX_LENGTH ? "secondary" : "textSecondary"}
          >
            {formik.values.content.length} 字
          </Typography>
          <Button
            variant="contained"
            size="small"
            color="primary"
            disableElevation
            endIcon={<SendIcon />}
            style={{ marginLeft: "8px" }}
            type="submit"
            disabled={postLoading}
          >
            提交
          </Button>
        </div>
      </div>
    </form>
  );
}
