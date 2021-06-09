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
} from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

import { ResourceDetail } from "API";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FileCopy as FileCopyIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";

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
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, rowCount, onSelectAllClick } = props;

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
          批量下载
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="下载">
          <IconButton aria-label="delete">
            <CloudDownloadIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

interface AddressButtonProps {
  downItem: ResourceDetail["files"][0];
}

const AddressButton = (props: AddressButtonProps) => {
  const { downItem } = props;

  const { enqueueSnackbar } = useSnackbar();

  const isHref = ["9", "12"].includes(downItem.way);

  return (
    <CopyToClipboard
      text={isHref ? downItem.passwd || "无密码" : downItem.address}
      onCopy={() => {
        enqueueSnackbar(isHref ? "网盘密码已复制" : `${downItem.way_cn} 下载地址复制成功`, {
          variant: "success",
        });
      }}
    >
      <Button
        variant="contained"
        size="small"
        startIcon={<FileCopyIcon />}
        href={isHref ? downItem.address : undefined}
        title={isHref ? `网盘密码：${downItem.passwd || "无密码"}` : undefined}
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
  })
);

interface DataTablePropTypes {
  quality: string;
  season: string;
  tableData: Array<ResourceDetail>;
}

export function DataTableComponent(props: DataTablePropTypes) {
  const { season, tableData } = props;
  console.log("表格数据", tableData);

  const [selected, setSelected] = React.useState<string[]>([]);

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

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
      const newSelecteds = tableData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const emptyRows = tableData.length < 5 ? 5 - tableData.length : 0;

  const classes = useStyles();
  dayjs.extend(relativeTime);
  dayjs.locale("zh-cn");

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllClick={handleSelectAllClick}
        />
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" aria-label="enhanced table">
            <TableBody>
              {tableData.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover key={row.name}>
                    <TableCell padding="checkbox" onClick={(event) => handleClick(event, row.name)} tabIndex={index}>
                      <Checkbox checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      padding="none"
                      className={clsx(classes.noWarp, classes.episode)}
                    >
                      {season} 第{row.episode}集
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    {row.size && row.size !== "0" && <TableCell align="left">{row.size}</TableCell>}
                    {row.dateline && (
                      <TableCell align="left" className={classes.noWarp}>
                        {dayjs.unix(Number(row.dateline)).fromNow()}
                      </TableCell>
                    )}
                    {row.files.map((downItem, index) => (
                      <TableCell
                        align="left"
                        className={clsx(classes.noWarp, classes.downBtn)}
                        padding={index === row.files.length - 1 ? undefined : "none"}
                        key={downItem.way}
                      >
                        <AddressButton downItem={downItem} />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
