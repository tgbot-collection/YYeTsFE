import * as React from "react";
import { ResourceInfo } from "API";
import { Avatar, createStyles, ListItemAvatar, makeStyles, Theme, Typography } from "@material-ui/core";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Skeleton } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { lighten } from "@material-ui/core/styles";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import clsx from "clsx";

import { toAbsoluteUrl } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
    },
    channel: {
      fontSize: "0.85rem",
    },
    item: {
      padding: 0,
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "inherit",
      boxSizing: "border-box",

      "&:hover": {
        backgroundColor:
          theme.palette.type === "light" ? lighten(theme.palette.primary.light, 0.85) : theme.palette.primary.dark,
      },
    },
    warp: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      overflow: "hidden",
    },
    itemInfo: {
      lineHeight: 1,
    },
    skeleton: {
      margin: "3px 0",
    },
    empty: {
      height: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      "& img": {
        width: "200px",
        marginBottom: theme.spacing(2),
      },
    },
    end: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
  })
);

interface SearchListPropTypes {
  loading: boolean;
  list: Array<ResourceInfo>;
}

export function SearchListComponent(props: SearchListPropTypes) {
  const { list, loading } = props;

  const classes = useStyles();

  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;

    return index !== list.length ? (
      <Link
        style={style}
        key={index}
        className={classes.item}
        to={{
          pathname: "/resource",
          search: `?id=${list[index].id}`,
        }}
      >
        <ListItemAvatar>
          <Avatar
            className={clsx(
              classes.channel,
              { [classes.orange]: list[index].channel === "tv" },
              { [classes.purple]: list[index].channel === "movie" }
            )}
          >
            {list[index].channel_cn}
          </Avatar>
        </ListItemAvatar>
        <div className={classes.warp}>
          <Typography noWrap className={classes.itemInfo}>
            {list[index].cnname}
            {list[index].enname && (
              <Typography component="span" variant="body2">
                &nbsp;{list[index].enname}
              </Typography>
            )}
          </Typography>
          <Typography variant="caption" noWrap className={classes.itemInfo}>
            {list[index].aliasname || "---"}
          </Typography>
        </div>
      </Link>
    ) : (
      <Typography style={style} key={index} className={classes.end} color="secondary">
        我是有底线哒 o(≧口≦)o
      </Typography>
    );
  }

  const height = window.innerHeight - 150;

  if (loading)
    return (
      <div className={classes.root}>
        {Array.from(new Array(Math.ceil(height / 46))).map((item, index) => (
          <Skeleton variant="rect" height={40} width="100%" key={index} className={classes.skeleton} />
        ))}
      </div>
    );

  return (
    <div className={classes.root}>
      {list.length > 0 ? (
        <FixedSizeList height={height} width="100%" itemSize={46} itemCount={list.length + 1}>
          {renderRow}
        </FixedSizeList>
      ) : (
        <div className={classes.empty}>
          <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" />
          <Typography>暂无结果</Typography>
        </div>
      )}
    </div>
  );
}
