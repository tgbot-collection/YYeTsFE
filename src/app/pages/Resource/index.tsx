import * as React from "react";
import { useLocation } from "react-router-dom";
import { Container, createStyles, Divider, makeStyles, Theme } from "@material-ui/core";
import queryString from "query-string";

import { getResourceByID, ResourceInfo, AddressInfo, cancelGetResourceByID } from "API";
import { InfoComponent } from "./Info";
import { AddressComponent } from "./Address";
import { useSnackbar } from "notistack";
import { CommentComponent } from "./Comment";
import { setTitle } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
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
  })
);

export function ResourcePage() {
  setTitle("资源信息");
  const location = useLocation();
  const { id } = queryString.parse(location.search);

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState<boolean>(true);

  const [resourceInfo, setResourceInfo] = React.useState<ResourceInfo>({} as ResourceInfo);
  const [resourceAddress, setResourceAddress] = React.useState<Array<AddressInfo>>([]);
  const [isLike, setIsLike] = React.useState<boolean>(false);

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
        enqueueSnackbar(error.message, { variant: "error" });
      });

    return cancelGetResourceByID;
  }, [enqueueSnackbar, id, location.search]);

  const classes = useStyles();

  return (
    <>
      <Container className={classes.container} maxWidth="lg">
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

        <CommentComponent id={Number(id)} />
      </Container>
    </>
  );
}
