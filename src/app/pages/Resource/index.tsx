import * as React from "react";
import { useLocation } from "react-router-dom";
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

import { getResourceByID, ResourceInfo, AddressInfo, cancelGetResourceByID } from "API";
import { InfoComponent } from "./Info";
import { AddressComponent } from "./Address";
import { useSnackbar } from "notistack";
import { CommentComponent } from "./Comment";
import { setTitle } from "utils";
import { History } from "@material-ui/icons";

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
    },
  })
);

export function ResourcePage() {
  setTitle("资源信息");
  const location = useLocation();
  const { id } = queryString.parse(location.search);

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
        console.log(error);
        enqueueSnackbar(`获取资源信息错误：${error.message}`, { variant: "error" });
      });

    return cancelGetResourceByID;
  }, [enqueueSnackbar, id, location.search]);

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
              <Typography variant="h6" gutterBottom>
                返回旧版页面
              </Typography>
              <div>
                <ButtonGroup variant="contained" disableElevation>
                  <Button onClick={handleClose}>取消</Button>
                  <Button color="primary" href={`/resource.html${location.search}`}>
                    确认
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
          id={id as string}
        />

        <Divider className={classes.hr} />

        <AddressComponent loading={loading} resourceAddress={resourceAddress} />

        <Divider className={classes.hr} />

        <CommentComponent loading={loading} id={Number(id)} title="评论" />
      </Container>
    </>
  );
}
