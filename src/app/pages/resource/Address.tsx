import * as React from "react";
import { Skeleton, TabContext, TabList } from "@material-ui/lab";
import { AppBar, Button, createStyles, makeStyles, Menu, MenuItem, Tab, Theme, Typography } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";

import { AddressInfo } from "API";
import { toAbsoluteUrl } from "utils";
import { DataTable } from "./DataTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(2),
    },
    appRoot: {
      boxShadow: theme.shadows[0],
    },
    empty: {
      minHeight: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      "& img": {
        width: 200,
        marginBottom: theme.spacing(2),
      },
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
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface AddressPropTypes {
  loading: boolean;
  resourceAddress: Array<AddressInfo>;
  resourceId: string;
}
export function Address(props: AddressPropTypes) {
  const { loading, resourceAddress = [], resourceId } = props;

  const [season, setSeason] = React.useState<number>(0);
  const [quality, setQuality] = React.useState<string>("");
  const [qualityIndex, setQualityIndex] = React.useState<string>("1");

  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const handleQualityChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    if (newValue === qualityIndex) return;

    setQualityIndex(newValue);
    setQuality(resourceAddress[season].formats[Number(newValue) - 1]);
  };

  const handleChangeSeason = (seasonIndex: number) => {
    popupState.close();

    if (seasonIndex === season) return;

    setSeason(seasonIndex);
    setQuality(resourceAddress[seasonIndex].formats[0]);
    setQualityIndex("1");
  };

  React.useEffect(() => {
    if (resourceAddress.length) {
      setQuality(resourceAddress[0].formats[0]);
    }
  }, [resourceAddress]);

  const classes = useStyles();

  if (loading)
    return (
      <>
        <Skeleton variant="rect" width={120} height={32} className={classes.title} />
        <Skeleton variant="rect" width="100%" height={376} />
      </>
    );

  return (
    <div>
      <Typography component="h2" variant="h5" className={classes.title}>
        下载地址
      </Typography>

      {resourceAddress.length > 0 ? (
        <TabContext value={qualityIndex}>
          <AppBar position="static" className={classes.header} color="default" classes={{ root: classes.appRoot }}>
            <Menu {...bindMenu(popupState)}>
              {resourceAddress.map((item, index) => (
                <MenuItem onClick={() => handleChangeSeason(index)} key={item.season_cn}>
                  {item.season_cn}
                </MenuItem>
              ))}
            </Menu>

            <Button size="large" {...bindTrigger(popupState)}>
              {resourceAddress[season].season_cn}
              <ExpandMoreIcon />
            </Button>
            <TabList
              onChange={handleQualityChange}
              variant="scrollable"
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

          <DataTable tableData={resourceAddress[season].items[quality]} resourceId={resourceId} />
        </TabContext>
      ) : (
        <div className={classes.empty}>
          <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" />
          <Typography>暂无资源，敬请期待</Typography>
        </div>
      )}
    </div>
  );
}
