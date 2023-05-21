import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";

import {
  Backdrop,
  Button,
  ButtonGroup,
  Container,
  createStyles,
  Divider,
  Fade,
  IconButton,
  makeStyles,
  Modal,
  Theme,
  Tooltip,
  Typography,
  Link,
} from "@material-ui/core";
import queryString from "query-string";
import { useSnackbar } from "notistack";

import {
  AddressInfo,
  cancelGetDoubanByID,
  cancelGetResourceByID,
  DoubanInfo,
  getDoubanByID,
  getResourceByID,
  postMetrics,
  ResourceInfo,
} from "API";
import { BackOldIcon } from "Icon";
import { noop, setTitle, ShowAdsense } from "utils";
import { CommentComponent } from "features";
import { Info } from "./Info";
import { Address } from "./Address";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: "relative",
      paddingTop: theme.spacing(4),

      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(6),
      },
    },
    hr: {
      margin: theme.spacing(4, 0),
      [theme.breakpoints.up("sm")]: {
        margin: theme.spacing(6, 0),
      },
    },
    back: {
      position: "absolute",
      top: 0,
      right: 16,

      "&::before": {
        position: "absolute",
        content: " ",
        width: 100,
        height: 100,
        backgroundColor: theme.palette.background.paper,
      },
    },
    origin: {
      position: "absolute",
      top: 0,
      right: 64,

      "&::before": {
        position: "absolute",
        content: " ",
        width: 100,
        height: 100,
        backgroundColor: theme.palette.background.paper,
      },
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      borderRadius: "4px",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: "80vw",
    },
  })
);

export function ResourcePage() {
  const showAdsense = ShowAdsense();
  const location = useLocation<{ title: string }>();
  const { id } = queryString.parse(location.search);

  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false);

  const [resourceInfo, setResourceInfo] = React.useState<ResourceInfo>({} as ResourceInfo);
  const [resourceAddress, setResourceAddress] = React.useState<Array<AddressInfo>>([]);
  const [isLike, setIsLike] = React.useState<boolean>(false);
  const [doubanInfo, setDoubanInfo] = React.useState<DoubanInfo | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (id === "233") {
      history.replace("/discuss");
    }
    setTitle(location.state?.title || String(id));
  }, [history, id, location.state?.title]);

  React.useEffect(() => {
    if (id === "233") return noop;

    getResourceByID(id as string)
      .then((resourceRes) => {
        const {
          data: { data: resourceData },
        } = resourceRes;
        setResourceInfo(resourceData.info);
        setResourceAddress(resourceData.list);
        setIsLike(resourceRes.data.is_like || false);

        setLoading(false);
        setTitle(resourceData.info.cnname);
      })
      .catch((error) => {
        enqueueSnackbar(`获取资源信息错误：${error.message}`, { variant: "error" });
      });

    getDoubanByID(id as string)
      .then((doubanRes) => {
        if (doubanRes) setDoubanInfo(doubanRes.data);
      })
      .catch(noop);

    postMetrics("resource").catch(noop);

    return () => {
      cancelGetResourceByID();
      cancelGetDoubanByID();
    };
  }, [enqueueSnackbar, id, location.search]);

  const handleBack = () => {
    postMetrics("backOld").catch(noop).catch(noop);
    gtag("event", "back_old", { resource_id: id });
  };

  const classes = useStyles();

  return (
    <>
      <Container className={classes.container} maxWidth="lg">
        <Tooltip title="返回旧版">
          <IconButton className={classes.back} onClick={handleOpen}>
            <BackOldIcon className="icon" />
          </IconButton>
        </Tooltip>
        {resourceInfo.source && (
          <Tooltip title="查看原站">
            <IconButton
              className={classes.origin}
              onClick={() => {
                window.location.href = resourceInfo.source || "";
              }}
            >
              <Link />
            </IconButton>
          </Tooltip>
        )}
        <Modal
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <Typography variant="h6">返回旧版页面</Typography>
              <Typography>
                现在已经支持
                <Typography color="secondary" component="span">
                  电驴的批量下载
                </Typography>
                啦
              </Typography>
              <Typography gutterBottom>若您对新版还有什么不满意欢迎到GitHub反馈哦</Typography>
              <br />
              <div className={classes.modal}>
                <ButtonGroup variant="contained" disableElevation>
                  <Button color="secondary" href="https://github.com/tgbot-collection/YYeTsFE/issues">
                    反馈意见
                  </Button>
                  <Button color="primary" href={`/resource.html${location.search}`} onClick={handleBack}>
                    前往旧版
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </Fade>
        </Modal>
        <Info
          loading={loading}
          resourceInfo={resourceInfo}
          url={`${process.env.REACT_APP_DOMAIN}${location.pathname}${location.search}`}
          isLike={isLike}
          setIsLike={setIsLike}
          id={id as string}
          doubanInfo={doubanInfo}
        />
        <Divider className={classes.hr} />
        {process.env.REACT_APP_ADSENSE && showAdsense ? (
          <>
            <Link href="https://maomaovpn.com/index.php#/register?code=XHn52jB3" target="_blank">
              <img alt="maomao" src="https://dmesg.app/assets/maomao.png" style={{ maxWidth: "100%" }} />
            </Link>
            <Divider className={classes.hr} />
          </>
        ) : null}
        <Address loading={loading} resourceAddress={resourceAddress} resourceId={id as string} />
        <Divider className={classes.hr} />
        <CommentComponent loading={loading} id={Number(id)} title="评论" />
      </Container>
    </>
  );
}
