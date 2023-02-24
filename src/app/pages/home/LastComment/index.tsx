import * as React from "react";
import { List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";

import { getLastComment, LastComment as LastCommentData } from "API";
import { formatComment, formatDate } from "utils";
import { Avatar } from "component";
import { useGoResourcePage } from "hooks";
import { useStyles } from "./Styled";

export function LastComment() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [lastComment, setLastComment] = React.useState<Array<LastCommentData>>([]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    getLastComment({ size: 7 })
      .then((res) => {
        setLoading(false);
        if (res.data) {
          setLastComment(res.data.data);
        }
      })
      .catch((error) => {
        enqueueSnackbar(`获取最新评论出错: ${error.message}`, { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const handleClick = useGoResourcePage();

  const classes = useStyles();

  if (loading) {
    return (
      <section>
        <Typography variant="h5" component="h2">
          最新评论
        </Typography>

        <div style={{ padding: "8px 0" }}>
          {Array.from(new Array(5)).map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={classes.sketch}>
              <Skeleton variant="circle" className="avatar" />
              <Skeleton variant="rect" className="name" width={200} height={24} />
              <Skeleton variant="rect" className="comment" height={20} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <Typography variant="h5" component="h2">
        最新评论
      </Typography>

      <List>
        {lastComment.map((item) => {
          const content = formatComment(item.content);

          return (
            <ListItem
              alignItems="flex-start"
              key={item.id}
              onClick={() => handleClick(item.resource_id, item.id, item.cnname)}
              button
            >
              <ListItemAvatar>
                <Avatar group={item.group} username={item.username} avatar={item.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography component="span">{item.username}</Typography>
                    <Typography component="span" variant="body2" color="textSecondary" style={{ marginLeft: 8 }}>
                      {formatDate(item.date)}
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    {content.name && (
                      <Typography component="span" variant="body2">
                        @{content.name}，
                      </Typography>
                    )}
                    <Typography component="span" variant="body2">
                      {content.text}
                    </Typography>
                  </>
                }
                classes={{ secondary: classes.noWrap }}
              />
              <Typography variant="caption" className={classes.source} color="secondary">
                {item.cnname}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </section>
  );
}
