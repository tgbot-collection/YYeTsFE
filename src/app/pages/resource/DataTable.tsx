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
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar, ProviderContext } from "notistack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

import { postMetrics, ResourceDetail } from "API";
import { Ed2kIcon, MagnetIcon } from "Icon";
import { DownloadBtn } from "./DownloadBtn";

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
              postMetrics("multiDownload");
              gtag("event", "multiDownload", { type: "电驴" });
            }}
          >
            <Tooltip title="复制电驴">
              <IconButton aria-label="delete">
                <Ed2kIcon />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
          <CopyToClipboard
            text={multipleAddress.magnet}
            onCopy={() => {
              enqueueSnackbar("磁链已复制", {
                variant: "success",
              });

              postMetrics("multiDownload");
              gtag("event", "multiDownload", { type: "磁链" });
            }}
          >
            <Tooltip title="复制磁链">
              <IconButton aria-label="delete">
                <MagnetIcon />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        </>
      )}
    </Toolbar>
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
                        <DownloadBtn downItem={downItem} resourceId={resourceId} />
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
