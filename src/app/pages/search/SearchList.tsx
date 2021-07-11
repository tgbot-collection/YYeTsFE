import * as React from "react";
import { ExtraResult, postMetrics, ResourceInfo } from "API";
import { Avatar, createStyles, ListItemAvatar, makeStyles, Theme, Typography } from "@material-ui/core";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Skeleton } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { lighten } from "@material-ui/core/styles";
import { deepOrange, deepPurple, pink } from "@material-ui/core/colors";
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
      margin: "6px 0",

      "&:last-child": {
        marginBottom: theme.spacing(4) + 6,
      },
    },
    empty: {
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
    extra: {
      color: theme.palette.getContrastText(pink[500]),
      backgroundColor: pink[500],
    },
  })
);

interface SearchListPropTypes {
  loading: boolean;
  list: Array<ResourceInfo>;
  extraList: Array<ExtraResult>;
}

export function SearchListComponent(props: SearchListPropTypes) {
  const { list, extraList, loading } = props;

  const classes = useStyles();

  const handleToExtra = (event: React.SyntheticEvent, href: string) => {
    event.preventDefault();
    postMetrics("extra").catch();
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      location.href = href;
    }, 500);
  };

  function renderRow(renderProps: ListChildComponentProps) {
    const { index, style } = renderProps;

    return index !== list.length ? (
      <Link
        style={style}
        key={index}
        className={classes.item}
        to={{
          pathname: "/resource",
          search: `?id=${list[index].id}`,
          state: { title: list[index].cnname },
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
          <Typography variant="caption" noWrap className={classes.itemInfo} color="textSecondary">
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

  /* 去除搜索和搜索结果高度 */
  const height = window.innerHeight - 150 - 46;

  if (loading)
    return (
      <div className={classes.root}>
        <div style={{ height: height + 46, overflow: "hidden" }}>
          {Array.from(new Array(Math.ceil(height / 46) + 1)).map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton variant="rect" height={40} width="100%" key={index} className={classes.skeleton} />
          ))}
        </div>
      </div>
    );

  return (
    <div className={classes.root}>
      {list.length > 0 && (
        <>
          <Typography style={{ height: 46, lineHeight: "46px" }}>共 {list.length} 条搜索结果</Typography>
          <FixedSizeList height={height} width="100%" itemSize={46} itemCount={list.length + 1}>
            {renderRow}
          </FixedSizeList>
        </>
      )}
      {extraList.length > 0 && (
        <>
          <Typography style={{ height: 46, lineHeight: "46px" }}>
            本站无结果，外站找到了 {extraList.length} 条相关记录
          </Typography>
          {extraList.map((extraItem) => (
            <a
              className={classes.item}
              href={extraItem.url}
              style={{ height: 46 }}
              key={extraItem.url}
              onClick={(e) => handleToExtra(e, extraItem.url)}
            >
              <ListItemAvatar>
                <Avatar className={clsx(classes.channel, classes.extra)}>外链</Avatar>
              </ListItemAvatar>
              <div className={classes.warp}>
                <Typography noWrap className={classes.itemInfo}>
                  {extraItem.name}
                </Typography>
                <Typography variant="caption" noWrap className={classes.itemInfo} color="textSecondary">
                  来自: {extraItem.class || "---"}
                </Typography>
              </div>
            </a>
          ))}
          <Typography style={{ height: 46 }} className={classes.end} color="secondary">
            我是有底线哒 o(≧口≦)o
          </Typography>
        </>
      )}
      {list.length === 0 && extraList.length === 0 && (
        <div className={classes.empty} style={{ height }}>
          <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" />
          <Typography>暂无结果</Typography>
        </div>
      )}
    </div>
  );
}
