import * as React from "react";
import { ResourceInfo } from "API";
import { Avatar, createStyles, ListItemAvatar, ListItemText, makeStyles, Theme } from "@material-ui/core";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Skeleton } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { lighten } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../utils";

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
          theme.palette.type === "light" ? lighten(theme.palette.secondary.light, 0.85) : theme.palette.secondary.dark,
      },
    },
    skeleton: {
      margin: "3px 0",
    },
    empty: {
      height: "60vh",
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

    return (
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
          <Avatar className={classes.channel}>{list[index].channel_cn}</Avatar>
        </ListItemAvatar>
        <ListItemText>{list[index].cnname}</ListItemText>
      </Link>
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
        <FixedSizeList height={height} width="100%" itemSize={46} itemCount={list.length}>
          {renderRow}
        </FixedSizeList>
      ) : (
        <div className={classes.empty}>
          <img src={toAbsoluteUrl("/svg/emptyAddress.svg")} alt="empty" />
        </div>
      )}
    </div>
  );
}
