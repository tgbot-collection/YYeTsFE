import * as React from "react";
import { Button, createStyles, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";

import { cancelGetCaptcha, getCaptcha } from "API";
import { randomString } from "utils";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";

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

export function CommentComponent() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [comment, setComment] = React.useState<string>("");

  const [captchaLoading, setCaptchaLoading] = React.useState<boolean>(true);
  const [captcha, setCaptcha] = React.useState<string>("");
  const [authCode, setAuthCode] = React.useState<string>("");
  const [captchaID, setCaptchaID] = React.useState<string>(randomString());

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

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };
  const handleAuthCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthCode(event.target.value);
  };

  const handleSubmit = () => {
    if (!comment) {
      enqueueSnackbar("请输入评论内容", { variant: "warning" });
      return;
    }
    if (authCode.length < 4) {
      enqueueSnackbar("请输入4位验证码", { variant: "warning" });
      return;
    }
    console.log(comment, authCode);
  };

  return (
    <div>
      <Typography component="h2" variant="h5">
        评论
      </Typography>

      <div className={classes.comment}>
        <TextField value={comment} onChange={handleCommentChange} multiline fullWidth inputProps={{ maxLength: 140 }} />

        <div className={classes.authCode}>
          <div style={{ display: "flex" }}>
            {captcha ? (
              <img src={captcha} alt="验证码" onClick={refreshCaptcha} />
            ) : (
              <Skeleton variant="rect" width={80} height={30} onClick={refreshCaptcha} />
            )}
            <TextField
              value={authCode}
              onChange={handleAuthCodeChange}
              inputProps={{ maxLength: 4 }}
              style={{ marginLeft: "16px" }}
            />
          </div>

          <Button onClick={handleSubmit} variant="contained" size="small" endIcon={<SendIcon />}>
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
