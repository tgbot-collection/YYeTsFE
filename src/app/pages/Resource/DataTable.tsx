import React from "react";
import clsx from "clsx";
import { createStyles, lighten, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Checkbox,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  Button,
  SvgIcon,
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FileCopy as FileCopyIcon, Cloud as CloudIcon } from "@material-ui/icons";
import { useSnackbar, ProviderContext } from "notistack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

import { postMetrics, ResourceDetail } from "API";

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      borderBottom: "1px solid grey",
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  rowCount: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multipleAddress: {
    ed2k: string;
    magnet: string;
  };
  enqueueSnackbar: ProviderContext["enqueueSnackbar"];
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, rowCount, onSelectAllClick, multipleAddress, enqueueSnackbar } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={onSelectAllClick}
        inputProps={{ "aria-label": "select all desserts" }}
      />
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} 选中
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          批量复制
        </Typography>
      )}
      {numSelected > 0 && (
        <>
          <CopyToClipboard
            text={multipleAddress.ed2k}
            onCopy={() => {
              enqueueSnackbar("电驴地址已复制", {
                variant: "success",
              });
              postMetrics("multiDownload").catch();
            }}
          >
            <Tooltip title="复制电驴">
              <IconButton aria-label="delete">
                <SvgIcon viewBox="0 0 1024 1024">
                  <path
                    d="M797.547 142.933s-54.72-90.56-99.733-93.013c0 0 8.96 78.613 33.813 127.68 0 0-108.48 120.747-141.44 143.68-32.96 22.933-200.64 1.92-218.56-4.907-25.6-9.813-257.067-52.8-273.707 138.56-0.107 0.96-0.107 2.027-0.213 2.987-23.253 161.28-54.613 185.813-64.32 200.533 0 0 28.693 40.533 71.467-147.307 0 0 19.307 101.227 24.96 146.56 1.6 13.12-24.107 41.707-24.107 41.707s-13.653 24.533-3.2 51.52c0 0 13.653 87.467 6.4 149.653l-4.8 27.84h50.667l-6.4-38.507-2.453-170.987s73.92-34.347 98.027-127.68c-0.107 0.213-0.533 67.627 9.707 114.88 3.093-5.12-8.107 19.413 12.8 34.987l6.4 180.373 48.213 0.853-2.453-36.053s-24.107-133.653-21.653-166.4c0 0 61.013-58.987 65.92-108.053 0 0 141.44 27.84 183.253 18.027 0 0 20.053 126.933 35.307 165.333 0 0 21.653 48.32 16.853 103.147l-5.653 4.907v29.44h48.213v-29.227l-5.653-10.667-2.453-247.253 59.52 228.373-5.653 30.293v18.88h58.667l-4.053-22.933-11.2-42.56s-35.307-189.12-27.307-257.067c8-67.947 105.28-252.16 105.28-252.16s86.4 63.68 137.067 46.507c0 0 42.133-19.627 15.68-65.813l-43.2-84.053s-18.773-47.253-65.387-64.427c0 0 18.453-113.6 8.853-138.987 0 0-57.067 44.907-63.467 101.333z"
                    p-id="3943"
                  />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
          <CopyToClipboard
            text={multipleAddress.magnet}
            onCopy={() => {
              enqueueSnackbar("磁链已复制", {
                variant: "success",
              });
              postMetrics("multiDownload").catch();
            }}
          >
            <Tooltip title="复制磁链">
              <IconButton aria-label="delete">
                <SvgIcon viewBox="0 0 1024 1024" style={{ transform: "scale(0.8)" }}>
                  <path
                    d="M238.933 284.459v273.066a273.067 273.067 0 0 0 545.963 10.24l0.17-10.24V284.46h182.06v273.066c0 251.307-203.777 455.083-455.126 455.083S56.875 808.875 56.875 557.525V284.46h182.058zM967.125 11.392v182.016H785.024l0.043-182.016h182.058z m-910.25 0h182.058v182.016H56.832V11.392z"
                    p-id="2842"
                  />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        </>
      )}
    </Toolbar>
  );
};

interface ButtonProps {
  downItem: ResourceDetail["files"][0];
  enqueueSnackbar: ProviderContext["enqueueSnackbar"];
  resourceId: string;
}

const CopyButton = (props: ButtonProps) => {
  const { downItem, enqueueSnackbar, resourceId } = props;

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <CopyToClipboard
      text={downItem.address}
      onCopy={() => {
        enqueueSnackbar(`${downItem.way_cn} 下载地址复制成功`, {
          variant: "success",
        });
        gtag("event", "download", { resource_id: resourceId, type: downItem.way_cn });
        postMetrics("download").catch();
      }}
    >
      <Button
        variant="contained"
        size="small"
        startIcon={<FileCopyIcon />}
        title={downItem.address}
        onClick={handleClick}
        disableRipple
        disableElevation
      >
        {downItem.way_cn}
      </Button>
    </CopyToClipboard>
  );
};

const HrefButton = (props: ButtonProps) => {
  const { downItem, enqueueSnackbar, resourceId } = props;

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <CopyToClipboard
      text={downItem.passwd || "无密码"}
      onCopy={() => {
        enqueueSnackbar(`已复制网盘密码： ${downItem.passwd || "无密码"}`, {
          variant: "success",
        });
        gtag("event", "download", { resource_id: resourceId, type: downItem.way_cn });
        postMetrics("download").catch();
        setTimeout(() => {
          // eslint-disable-next-line no-restricted-globals
          location.href = downItem.address;
        }, 1000);
      }}
    >
      <Button
        variant="contained"
        size="small"
        startIcon={<CloudIcon />}
        href={downItem.address}
        onClick={handleClick}
        title={`网盘密码：${downItem.passwd || "无密码"}`}
        color="primary"
        disableRipple
        disableElevation
      >
        {downItem.way_cn}
      </Button>
    </CopyToClipboard>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    table: {
      minWidth: 750,
    },
    noWarp: {
      whiteSpace: "nowrap",
    },
    episode: {
      color: theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.light,
    },
    downBtn: {
      padding: theme.spacing(0, 1),
    },
    noBorderBottom: {
      borderBottom: 0,
    },
  })
);

interface DataTablePropTypes {
  season: string;
  tableData: Array<ResourceDetail>;
  resourceId: string;
}

export function DataTableComponent(props: DataTablePropTypes) {
  const { season, tableData, resourceId } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [selected, setSelected] = React.useState<number[]>([]);

  const handleClick = (event: React.MouseEvent<unknown>, name: number) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = tableData.map((n, index) => index);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClickMultipleDown = (way: "1" | "2") =>
    selected.reduce((pre, current) => {
      const add = tableData[current]?.files?.find((address) => address?.way === way);
      return pre + (add ? `${add.address}\n` : "");
    }, "");

  React.useEffect(() => {
    setSelected([]);
  }, [tableData]);

  const isSelected = (name: number) => selected.indexOf(name) !== -1;
  const emptyRows = tableData.length < 5 ? 5 - tableData.length : 0;

  const classes = useStyles();
  dayjs.extend(relativeTime);
  dayjs.locale("zh-cn");

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllClick={handleSelectAllClick}
          multipleAddress={{ magnet: handleClickMultipleDown("2"), ed2k: handleClickMultipleDown("1") }}
          enqueueSnackbar={enqueueSnackbar}
        />
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" aria-label="enhanced table">
            <TableBody>
              {tableData.map((row, index) => {
                const isItemSelected = isSelected(index);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    key={row.name}
                    selected={isItemSelected}
                    onClick={(event) => handleClick(event, index)}
                  >
                    <TableCell padding="checkbox" tabIndex={index}>
                      <Checkbox checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      padding="none"
                      className={clsx(classes.noWarp, classes.episode)}
                    >
                      {season} {row.episode && `第${row.episode}集`}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    {row.size && row.size !== "0" && <TableCell align="left">{row.size}</TableCell>}
                    {row.dateline && (
                      <TableCell align="left" className={classes.noWarp}>
                        {dayjs.unix(Number(row.dateline)).fromNow()}
                      </TableCell>
                    )}

                    {row.files?.map((downItem, rowIndex) => (
                      <TableCell
                        align="left"
                        className={clsx(classes.noWarp, classes.downBtn)}
                        padding={rowIndex === row.files.length - 1 ? undefined : "none"}
                        key={downItem.way}
                      >
                        {downItem.way !== "1" && downItem.way !== "2" ? (
                          <HrefButton downItem={downItem} enqueueSnackbar={enqueueSnackbar} resourceId={resourceId} />
                        ) : (
                          <CopyButton downItem={downItem} enqueueSnackbar={enqueueSnackbar} resourceId={resourceId} />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} className={classes.noBorderBottom} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
