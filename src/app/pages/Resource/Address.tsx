import * as React from "react";
import { Skeleton } from "@material-ui/lab";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

import { AddressInfo } from "API";
import { toAbsoluteUrl } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: 300,
    },
    empty: {
      minHeight: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

interface AddressPropTypes {
  loading: boolean;
  resourceAddress: Array<AddressInfo>;
}
export function AddressComponent(props: AddressPropTypes) {
  const { loading, resourceAddress = [] } = props;

  const [season, setSeason] = React.useState<number>(0);
  console.log("资源地址", resourceAddress);

  const classes = useStyles();

  if (loading) return <Skeleton variant="rect" width="100%" height={300} />;

  return resourceAddress.length > 0 ? (
    <div className={classes.root}>123</div>
  ) : (
    <div className={classes.empty}>
      <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" height={200} />
      <Typography style={{ marginTop: "24px" }}>暂无资源，敬请期待</Typography>
    </div>
  );
}
