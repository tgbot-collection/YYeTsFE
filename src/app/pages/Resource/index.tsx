import * as React from "react";
import { useLocation } from "react-router-dom";
import { Container, createStyles, Divider, makeStyles, Theme } from "@material-ui/core";
import queryString from "query-string";

import { getResourceByID, ResourceInfo } from "API";
import { Info } from "./Info";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(6),
      },
    },
  })
);

export function ResourcePage() {
  const location = useLocation();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [resourceInfo, setResourceInfo] = React.useState<ResourceInfo>({} as ResourceInfo);

  React.useEffect(() => {
    const { id } = queryString.parse(location.search);
    getResourceByID(id as string).then((res) => {
      if (res) {
        console.log(res.data);
        setResourceInfo(res.data.data.info);
      }
      setLoading(false);
    });
  }, [location.search]);

  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="md">
      <Info
        loading={loading}
        resourceInfo={resourceInfo}
        url={`${process.env.REACT_APP_DOMAIN}${location.pathname}${location.search}`}
      />
      <Divider style={{ margin: "32px 0" }} />
      不知道事实上
    </Container>
  );
}
