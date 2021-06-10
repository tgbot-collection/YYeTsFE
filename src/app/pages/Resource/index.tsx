import * as React from "react";
import { useLocation } from "react-router-dom";
import { Container, createStyles, Divider, makeStyles, Theme } from "@material-ui/core";
import queryString from "query-string";

import { getResourceByID, ResourceInfo, AddressInfo, cancelGetResourceByID } from "API";
import { InfoComponent } from "./Info";
import { AddressComponent } from "./Address";
import { useSnackbar } from "notistack";
import { CommentComponent } from "./Coment";

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
        margin: theme.spacing(8, 0),
      },
    },
  })
);

export function ResourcePage() {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState<boolean>(true);

  const [resourceInfo, setResourceInfo] = React.useState<ResourceInfo>({} as ResourceInfo);
  const [resourceAddress, setResourceAddress] = React.useState<Array<AddressInfo>>([]);
  const [isLike, setIsLike] = React.useState<boolean>(false);

  React.useEffect(() => {
    const { id } = queryString.parse(location.search);
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
        }
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar(error.message, { variant: "error" });
      });

    return cancelGetResourceByID;
  }, [enqueueSnackbar, location.search]);

  const classes = useStyles();

  return (
    <>
      <Container className={classes.container} maxWidth="lg">
        <InfoComponent
          loading={loading}
          resourceInfo={resourceInfo}
          url={`${process.env.REACT_APP_DOMAIN}${location.pathname}${location.search}`}
          isLike={isLike}
        />
        <Divider className={classes.hr} />
        <AddressComponent loading={loading} resourceAddress={resourceAddress} />
        <CommentComponent />
      </Container>
    </>
  );
}
