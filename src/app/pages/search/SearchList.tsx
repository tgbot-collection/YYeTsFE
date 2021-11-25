import * as React from "react";
import { Avatar, Box, createStyles, ListItemAvatar, makeStyles, Theme, Typography } from "@material-ui/core";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Skeleton } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { lighten } from "@material-ui/core/styles";
import { deepOrange, deepPurple, pink, blue } from "@material-ui/core/colors";
import clsx from "clsx";

import { CommentResult, ExtraResult, postMetrics, ResourceInfo } from "API";
import { noop, toAbsoluteUrl, formatComment } from "utils";
import CommentDrawer from "./CommentDrawer";

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
    comment: {
      color: theme.palette.getContrastText(blue[500]),
      backgroundColor: blue[500],
    },
  })
);

interface ResourceItemPropTypes {
  index: number;
  style: React.CSSProperties;
  list: Array<ResourceInfo>;
}

const ResourceItem = (props: ResourceItemPropTypes) => {
  const { index, style, list } = props;
  const classes = useStyles();

  return (
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
          {list[index].type}
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
  );
};

interface CommentItemPropTypes {
  index: number;
  style: React.CSSProperties;
  list: Array<CommentResult>;
  onClick: (comment: CommentResult) => void;
}

const CommentItem = (props: CommentItemPropTypes) => {
  const { index, style, list, onClick } = props;

  const classes = useStyles();
  const content = formatComment(list[index].comment);

  const comment = content.name ? `@${content.name}, ${content.text}` : content.text;

  return (
    <Box style={style} key={index} className={classes.item} onClick={() => onClick(list[index])}>
      <ListItemAvatar>
        <Avatar className={clsx(classes.channel, classes.comment)} color="blue">
          评论
        </Avatar>
      </ListItemAvatar>
      <div className={classes.warp}>
        <Typography noWrap className={classes.itemInfo}>
          {list[index].resourceName}

          <Typography component="span" variant="body2" color="primary">
            &nbsp;--{list[index].username}
          </Typography>
        </Typography>
        <Typography variant="caption" noWrap className={classes.itemInfo} color="textSecondary">
          {comment || "---"}
        </Typography>
      </div>
    </Box>
  );
};

interface SearchListPropTypes {
  loading: boolean;
  list: Array<ResourceInfo>;
  extraList: Array<ExtraResult>;
  commentList: Array<CommentResult>;
}

export function SearchListComponent(props: SearchListPropTypes) {
  const { list, extraList, commentList, loading } = props;

  // 控制侧边抽屉展开
  const [drawerVisible, setDrawerVisible] = React.useState<boolean>(false);
  const [drawerContent, setDrawerContent] = React.useState<CommentResult | null>(null);

  const classes = useStyles();

  const handleClickComment = (comment: CommentResult) => {
    setDrawerContent(comment);
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setDrawerContent(null);
  };

  const handleToExtra = (event: React.SyntheticEvent, href: string) => {
    event.preventDefault();
    postMetrics("extra").catch(noop);
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      location.href = href;
    }, 500);
  };

  function renderRow(renderProps: ListChildComponentProps) {
    const { index, style } = renderProps;

    if (index === list.length + commentList.length) {
      return (
        <Typography style={style} key={index} className={classes.end} color="secondary">
          我是有底线哒 o(≧口≦)o
        </Typography>
      );
    }

    if (index < list.length) {
      return <ResourceItem index={index} style={style} list={list} />;
    }

    return <CommentItem index={index - list.length} style={style} list={commentList} onClick={handleClickComment} />;
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
      {list.length + commentList.length > 0 && (
        <>
          <Typography style={{ height: 46, lineHeight: "46px" }}>
            共 {list.length} 条资源, {commentList.length} 条相关评论
          </Typography>
          <FixedSizeList height={height} width="100%" itemSize={46} itemCount={list.length + commentList.length + 1}>
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
      {commentList.length > 0 && (
        <CommentDrawer open={drawerVisible} onClose={handleCloseDrawer} content={drawerContent} />
      )}
      {list.length === 0 && extraList.length === 0 && commentList.length === 0 && (
        <div className={classes.empty} style={{ height }}>
          <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" />
          <Typography>暂无结果</Typography>
        </div>
      )}
    </div>
  );
}
