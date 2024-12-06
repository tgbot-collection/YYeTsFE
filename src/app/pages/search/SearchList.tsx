import * as React from "react";
import {
  Avatar,
  Box,
  createStyles,
  ListItemAvatar,
  makeStyles,
  Theme,
  Typography,
  Tooltip,
  Link as MuiLink,
} from "@material-ui/core";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Skeleton } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { lighten } from "@material-ui/core/styles";
import { deepOrange, deepPurple, pink, blue } from "@material-ui/core/colors";
import clsx from "clsx";

import { CommentResult, SubtitleResult, postMetrics, ResourceInfo } from "API";
import { noop, toAbsoluteUrl, formatComment, ShowAdsense } from "utils";
import CommentDrawer from "./CommentDrawer";
import SubtitleDrawer from "./SubtitleDrawer";

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
  }),
);

interface ResourceItemPropTypes {
  index: number;
  style: React.CSSProperties;
  list: Array<ResourceInfo>;
}

const ResourceItem = (props: ResourceItemPropTypes) => {
  const { index, style, list } = props;
  const classes = useStyles();
  if (list.length === 0) return null;

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
            { [classes.purple]: list[index].channel === "movie" },
          )}
        >
          {list[index].channel_cn}
        </Avatar>
      </ListItemAvatar>
      <Tooltip title={list[index].introduction || ""}>
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
      </Tooltip>
    </Link>
  );
};

interface CommentItemPropTypes {
  index: number;
  style: React.CSSProperties;
  list: Array<CommentResult>;
  onClick: (comment: CommentResult) => void;
}

interface SubtitleItemPropTypes {
  index: number;
  style: React.CSSProperties;
  list: Array<SubtitleResult>;
  onClick: (subtitle: SubtitleResult) => void;
}

const CommentItem = (props: CommentItemPropTypes) => {
  const { index, style, list, onClick } = props;
  const classes = useStyles();
  if (list.length === 0) return null;
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

const SubtitleItem = (props: SubtitleItemPropTypes) => {
  const { index, style, list, onClick } = props;
  const classes = useStyles();
  if (list.length === 0) return null;

  return (
    <Box style={style} key={index} className={classes.item} onClick={() => onClick(list[index])}>
      <ListItemAvatar>
        <Avatar className={clsx(classes.channel, classes.comment)} color="blue">
          字幕
        </Avatar>
      </ListItemAvatar>
      <div className={classes.warp}>
        <Typography noWrap className={classes.itemInfo}>
          {list[index].cnname}

          <Typography component="span" variant="body2" color="primary">
            &nbsp;{list[index].enname}
          </Typography>
        </Typography>
        <Typography variant="caption" noWrap className={classes.itemInfo} color="textSecondary">
          {list[index].lang}
          {list[index].format}
        </Typography>
      </div>
    </Box>
  );
};

interface SearchListPropTypes {
  loading: boolean;
  resourceList: Array<ResourceInfo>;
  commentList: Array<CommentResult>;
  subtitleList: Array<SubtitleResult>;
}

export function SearchListComponent(props: SearchListPropTypes) {
  const showAdsense = ShowAdsense();
  const { resourceList, commentList, subtitleList, loading } = props;
  const mergedList = [
    ...resourceList.map((item, idx) => ({ ...item, type: "resource", originalIndex: idx })),
    ...commentList.map((item, idx) => ({ ...item, type: "comment", originalIndex: idx })),
    ...subtitleList.map((item, idx) => ({ ...item, type: "subtitle", originalIndex: idx })),
  ];

  // 控制侧边抽屉展开
  const [commentDrawerVisible, setCommentDrawerVisible] = React.useState(false);
  const [subtitleDrawerVisible, setSubtitleDrawerVisible] = React.useState(false);
  const [commentContent, setCommentContent] = React.useState<CommentResult | null>(null);
  const [subtitleContent, setSubtitleContent] = React.useState<SubtitleResult | null>(null);

  const classes = useStyles();

  const handleClickComment = (comment: CommentResult) => {
    setCommentContent(comment);
    setCommentDrawerVisible(true);
  };

  const handleClickSubtitle = (subtitle: SubtitleResult) => {
    setSubtitleContent(subtitle);
    setSubtitleDrawerVisible(true);
    postMetrics("viewSubtitle", subtitle._id);
  };

  const handleCloseDrawer = () => {
    setCommentDrawerVisible(false);
    setCommentContent(null);
    setSubtitleDrawerVisible(false);
    setSubtitleContent(null);
  };

  function renderRow(renderProps: ListChildComponentProps) {
    const { index, style } = renderProps;
    const item = mergedList[index];
    if (!item) {
      return (
        <Typography style={style} key={index} className={classes.end} color="secondary">
          我是有底线哒 o(≧口≦)o
        </Typography>
      );
    }

    if (item.type === "resource") {
      return <ResourceItem index={item.originalIndex} style={style} list={resourceList} />;
    }
    if (item.type === "comment") {
      return <CommentItem index={item.originalIndex} style={style} list={commentList} onClick={handleClickComment} />;
    }
    if (item.type === "subtitle") {
      return (
        <SubtitleItem index={item.originalIndex} style={style} list={subtitleList} onClick={handleClickSubtitle} />
      );
    }

    return null;
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
      <FixedSizeList height={height} width="100%" itemSize={46} itemCount={mergedList.length + 1}>
        {renderRow}
      </FixedSizeList>

      {commentList.length > 0 && (
        <CommentDrawer open={commentDrawerVisible} onClose={handleCloseDrawer} content={commentContent} />
      )}
      {subtitleList.length > 0 && (
        <SubtitleDrawer open={subtitleDrawerVisible} onClose={handleCloseDrawer} content={subtitleContent} />
      )}

      {resourceList.length + commentList.length + subtitleList.length === 0 ? (
        <div className={classes.empty} style={{ height }}>
          <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" />
          <Typography>暂无结果</Typography>
        </div>
      ) : (
        <Typography style={{ height: 46, lineHeight: "46px" }}>
          共 {resourceList.length} 条资源, {commentList.length} 条相关评论,{subtitleList.length} 条字幕
        </Typography>
      )}
    </div>
  );
}
