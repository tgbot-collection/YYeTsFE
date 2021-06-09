import * as React from "react";
import { Skeleton, TabContext, TabList, TabPanel } from "@material-ui/lab";
import { AppBar, Button, createStyles, makeStyles, Tab, Theme, Typography } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { AddressInfo } from "API";
import { toAbsoluteUrl } from "utils";
import { DataTableComponent } from "./DataTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: 300,
      backgroundColor: theme.palette.background.paper,
    },
    empty: {
      minHeight: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
    },
    tabRoot: {
      minWidth: "100px",
    },
    tabPanelRoot: {
      padding: 0,
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
  const [quality, setQuality] = React.useState<string>("1");
  console.log("资源地址", resourceAddress);

  const handleQualityChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setQuality(newValue);
  };

  React.useEffect(() => {
    if (resourceAddress.length) {
      setSeason(1);
    }
  }, [resourceAddress]);

  const classes = useStyles();

  if (loading) return <Skeleton variant="rect" width="100%" height={300} />;

  return resourceAddress.length > 0 ? (
    <div className={classes.root}>
      <TabContext value={quality}>
        <AppBar position="static" className={classes.header} color="default">
          <Button size="large">
            {resourceAddress[season].season_cn}
            <ExpandMoreIcon />
          </Button>
          <TabList
            onChange={handleQualityChange}
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
            style={{ flex: 1 }}
          >
            {resourceAddress[season].formats.map((item, index) => (
              <Tab label={item} value={String(index + 1)} className={classes.tabRoot} key={item} />
            ))}
          </TabList>
        </AppBar>

        {resourceAddress[season].formats.map((item, index) => (
          <TabPanel value={String(index + 1)} key={item} classes={{ root: classes.tabPanelRoot }}>
            <DataTableComponent
              tableData={resourceAddress[season].items["MP4"]}
              season={resourceAddress[season].season_cn}
            />
          </TabPanel>
        ))}
      </TabContext>
    </div>
  ) : (
    <div className={classes.empty}>
      <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" height={200} />
      <Typography style={{ marginTop: "24px" }}>暂无资源，敬请期待</Typography>
    </div>
  );
}
