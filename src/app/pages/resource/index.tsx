import * as React from "react";
import { useLocation, useHistory, Link as RouterLinker } from "react-router-dom";
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
  SvgIcon,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import queryString from "query-string";
import { useSnackbar } from "notistack";

import { getResourceByID, ResourceInfo, AddressInfo, cancelGetResourceByID, postMetrics } from "API";
import { setTitle } from "utils";
import { CommentComponent } from "features";
import { InfoComponent } from "./Info";
import { AddressComponent } from "./Address";

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
  const location = useLocation<{ title: string }>();
  const { id } = queryString.parse(location.search);

  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false);

  const [resourceInfo, setResourceInfo] = React.useState<ResourceInfo>({} as ResourceInfo);
  const [resourceAddress, setResourceAddress] = React.useState<Array<AddressInfo>>([]);
  const [isLike, setIsLike] = React.useState<boolean>(false);

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
    getResourceByID(id as string)
      .then((res) => {
        if (res) {
          const {
            data: { data: resourceData },
          } = res;

          setResourceInfo(resourceData.info);
          setResourceAddress(resourceData.list);
          setIsLike(res.data.is_like || false);

          setLoading(false);
          setTitle(resourceData.info.cnname);
        }
      })
      .catch((error) => {
        enqueueSnackbar(`获取资源信息错误：${error.message}`, { variant: "error" });
      });
    postMetrics("resource");

    return cancelGetResourceByID;
  }, [enqueueSnackbar, id, location.search]);

  const handleBack = () => {
    postMetrics("backOld");
    gtag("event", "back_old", { resource_id: id });
  };

  const classes = useStyles();

  return (
    <>
      <Container className={classes.container} maxWidth="lg">
        <Tooltip title="返回旧版">
          <IconButton className={classes.back} onClick={handleOpen}>
            <SvgIcon>
              <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M371.643733 286.72V68.266667L0 450.56l371.712 382.293333V608.938667C637.1328 608.938667 823.022933 696.32 955.733333 887.466667c-53.0432-273.066667-212.309333-546.133333-584.021333-600.746667" />
              </svg>
            </SvgIcon>
          </IconButton>
        </Tooltip>

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
              <Typography gutterBottom>
                若您对新版还有什么不满意欢迎到
                <Typography component={RouterLinker} to="/discuss" color="inherit">
                  留言板
                </Typography>
                反馈哦
              </Typography>
              <br />
              <div className={classes.modal}>
                <ButtonGroup variant="contained" disableElevation>
                  <Button color="secondary" component={RouterLinker} to="/discuss">
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

        <InfoComponent
          loading={loading}
          resourceInfo={resourceInfo}
          url={`${process.env.REACT_APP_DOMAIN}${location.pathname}${location.search}`}
          isLike={isLike}
          setIsLike={setIsLike}
          id={id as string}
        />

        <Divider className={classes.hr} />

        <AddressComponent loading={loading} resourceAddress={resourceAddress} resourceId={id as string} />

        <Divider className={classes.hr} />

        <CommentComponent loading={loading} id={Number(id)} title="评论" />
      </Container>
    </>
  );
}
