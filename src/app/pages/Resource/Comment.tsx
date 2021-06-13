import * as React from "react";
import * as yup from "yup";
import * as Bowser from "bowser";
import { Avatar, Button, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { Chat as SendIcon } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import clsx from "clsx";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";

import { cancelGetCaptcha, Comment, getCaptcha, getComment, postComment, postMetrics } from "API";
import { randomString } from "utils";
import { UserContext } from "../../Layout/UserContext";
import { useLogin } from "../../../Hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentList: {
      marginTop: theme.spacing(4),

      "& .empty": {
        height: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    commentItem: {
      margin: theme.spacing(2, 0),
      position: "relative",
      display: "grid",
      gridTemplateAreas: `
       'avatar name'
       'avatar ua'
       'avatar comment'
      `,
      gridTemplateColumns: "44px 1fr",
      gridGap: theme.spacing(1),

      [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "62px 1fr",

        "& .avatar": {
          width: "50px",
          height: "50px",
        },
      },

      "& .avatar": {
        gridArea: "avatar",
        fontSize: "0.875rem",
      },
      "& .name": {
        gridArea: "name",
      },
      "& .ua": {
        gridArea: "ua",
        position: "relative",
        top: "-4px",
      },
      "& .comment": {
        gridArea: "comment",
        paddingBottom: theme.spacing(2.5),
        borderBottom: `1px dashed ${theme.palette.divider}`,
        wordBreak: "break-all",
        fontSize: "0.875rem",

        [theme.breakpoints.up("sm")]: {
          fontSize: "1rem",
        },
      },
      "&:last-child .comment": {
        borderBottom: `none`,
      },
      "& .floor": {
        position: "absolute",
        bottom: 2,
        right: 4,
      },
    },
    hasMore: {
      display: "flex",
      justifyContent: "center",
    },
    comment: {
      width: "100%",
      borderRadius: "4px",
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      boxSizing: "border-box",

      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(1.5),
      },

      "& textarea": {
        width: "100%",
        outline: "none",
        resize: "none",
        minHeight: "146px",
        borderRadius: "4px",
        padding: theme.spacing(1),
        boxSizing: "border-box",
        border: `1px solid ${theme.palette.background.paper}`,
        backgroundColor: theme.palette.background.paper,
        color: "inherit",

        [theme.breakpoints.up("sm")]: {
          minHeight: "168px",
          fontSize: "18px",
        },

        "&:focus": {
          backgroundColor: theme.palette.background.default,
        },

        "&:hover": {
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    commentFooter: {
      display: "flex",
      marginTop: theme.spacing(3),
      justifyContent: "space-between",

      "& .left": {
        display: "flex",
        alignItems: "center",
      },

      "& input": {
        outline: "none",
        border: `1px solid ${theme.palette.background.paper}`,
        padding: theme.spacing(0.5, 1),
        borderRadius: "2px",
        height: "30px",
        lineHeight: "30px",
        width: "80px",
        marginLeft: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        color: "inherit",

        "&:focus": {
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.background.default}`,
        },

        "&:hover": {
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.background.default}`,
        },
      },

      "& img": {
        width: 80,
        height: 30,
        borderRadius: "2px",
      },
    },
    inputError: {
      border: `1px solid ${theme.palette.error.main} !important`,
    },
    browser: {
      borderRadius: "4px",
      backgroundColor: theme.palette.background.paper,
      margin: theme.spacing(-0.25, -0.5),
      padding: theme.spacing(0.25, 0.5),

      "&:last-child": {
        marginLeft: theme.spacing(1),
      },
    },
  })
);

const validationSchema = yup.object({
  content: yup.string().required("请输入评论内容"),
  captcha: yup.string().min(4, "验证码至少4位").required("请输入验证码"),
});

interface CommentPropTypes {
  id: number;
  loading: boolean;
  title?: string;
}

export function CommentComponent(props: CommentPropTypes) {
  const { id, loading, title } = props;

  const history = useHistory();
  const login = useLogin();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  const { name } = React.useContext(UserContext);

  const [captchaLoading, setCaptchaLoading] = React.useState<boolean>(true);
  const [captcha, setCaptcha] = React.useState<string>("");
  const [captchaID, setCaptchaID] = React.useState<string>(randomString());

  const [postLoading, setPostLoading] = React.useState<boolean>(false);

  const PAGE_SIZE = 20;
  const [page, setPage] = React.useState<number>(1);
  const [count, setCount] = React.useState<number>(0);
  const [hasMore, setHasMore] = React.useState<boolean>(false);
  const [listLoading, setListLoading] = React.useState<boolean>(false);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [commentList, setCommentList] = React.useState<Array<Comment>>([]);

  const formik = useFormik({
    initialValues: {
      content: "",
      captcha: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!name) {
        enqueueSnackbar("请先登陆后评论", {
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

      postComment({ resource_id: id, captcha: values.captcha, content: values.content, id: captchaID })
        .then((res) => {
          if (res) {
            resetForm();
            setCount((pre) => pre + 1);
            setCommentList((pre) =>
              [
                {
                  id: Math.random(),
                  username: name,
                  date: Date(),
                  content: values.content,
                  browser: navigator.userAgent,
                },
              ].concat(pre)
            );

            refreshCaptcha();
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
          postMetrics("comment").catch();
        });
    },
  });

  const refreshCaptcha = () => {
    if (captchaLoading) return;
    setCaptchaID(randomString());
  };

  const handleLoadMore = () => {
    if (hasMore) setPage((pre) => pre + 1);
  };

  const formatBowser = (browser: string) => {
    const result = Bowser.parse(browser);
    return {
      browser: `${result.browser.name} ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
    };
  };

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
  }, [captchaID, enqueueSnackbar, id]);

  React.useEffect(() => {
    if (page === 1) setListLoading(true);
    else setLoadingMore(true);

    getComment({ resource_id: id, page, size: PAGE_SIZE })
      .then((res) => {
        if (res) {
          setCommentList((pre) => (page === 1 ? res.data.data : pre.concat(res.data.data)));
          setCount(res.data.count);
          setHasMore(page * PAGE_SIZE < res.data.count);
        }

        setListLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(`获取评论列表出错: ${error.message}`, { variant: "error" });

        setListLoading(false);
      });
  }, [page, id, enqueueSnackbar]);

  if (loading)
    return (
      <div>
        <Skeleton variant="rect" width={120} height={32} style={{ marginBottom: "16px" }} />
        <Skeleton variant="rect" width="100%" height={253} />
      </div>
    );

  return (
    <div>
      {title && (
        <Typography component="h2" variant="h5" style={{ marginBottom: "16px" }}>
          {title}
        </Typography>
      )}

      <form className={classes.comment} onSubmit={formik.handleSubmit}>
        <textarea
          name="content"
          maxLength={400}
          placeholder={name ? `欢迎 ${name}，畅所欲言吧～` : "您还未登陆哦，先去登陆吧～"}
          autoComplete="off"
          value={formik.values.content}
          onChange={formik.handleChange}
          className={clsx({ [classes.inputError]: formik.touched.content && Boolean(formik.errors.content) })}
        />

        <div className={classes.commentFooter}>
          <div className="left">
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
            <Typography variant="body2" color="textSecondary">
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

      <section className={classes.commentList}>
        {listLoading &&
          Array.from(new Array(4)).map((item, index) => (
            <div className={classes.commentItem} key={index}>
              <Skeleton variant="circle" className="avatar" />
              <Skeleton variant="rect" className="name" width={180} height={32} />
              <Skeleton variant="rect" className="ua" width={240} height={18} />
              <Skeleton variant="rect" className="comment" style={{ borderBottom: "none" }} height={72} />
            </div>
          ))}
        {!listLoading && commentList.length === 0 && (
          <div className="empty">
            <Typography color="textSecondary">快来呀，第一条神评就是你啦～</Typography>
          </div>
        )}
        {!listLoading && commentList.length > 0 && (
          <>
            <div>
              {commentList.map((comment, index) => {
                const { browser, os } = formatBowser(comment.browser);

                return (
                  <div className={classes.commentItem} key={comment.id}>
                    <Avatar className="avatar">{comment.username.substr(0, 3)}</Avatar>

                    <div className="name">
                      <Typography component="span" variant="h5" color="textPrimary">
                        {comment.username}
                      </Typography>
                      <Typography component="span" variant="body2" color="textSecondary" style={{ marginLeft: "16px" }}>
                        {dayjs(comment.date).format("YYYY-MM-DD HH:mm")}
                      </Typography>
                    </div>
                    {browser !== " " && os !== " " && (
                      <div className="ua">
                        {browser !== " " && (
                          <Typography
                            variant="caption"
                            component="span"
                            color="textSecondary"
                            className={classes.browser}
                          >
                            {browser}
                          </Typography>
                        )}
                        {os !== " " && (
                          <Typography
                            variant="caption"
                            component="span"
                            color="textSecondary"
                            className={classes.browser}
                          >
                            {os}
                          </Typography>
                        )}
                      </div>
                    )}
                    <Typography className="comment">{comment.content}</Typography>
                    <Typography className="floor" variant="body2" component="span" color="textSecondary">
                      # {count - index}
                    </Typography>
                  </div>
                );
              })}
            </div>
            {hasMore && (
              <div className={classes.hasMore}>
                <Button onClick={handleLoadMore} disabled={loadingMore} variant="outlined">
                  {listLoading ? "努力加载中..." : "加载更多"}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
