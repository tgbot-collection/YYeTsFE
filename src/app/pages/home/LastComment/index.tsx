import * as React from "react";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import clsx from "clsx";
import { useSnackbar } from "notistack";

import { getLastComment, LastComment as LastCommentData } from "API";
import { formatAvatar, formatComment } from "utils";
import { useStyles } from "./Styled";

export function LastComment() {
  const [lastComment, setLastComment] = React.useState<Array<LastCommentData>>([]);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    getLastComment({ size: 5 })
      .then((res) => {
        if (res.data) {
          setLastComment(res.data.data);
        }
      })
      .catch((error) => {
        enqueueSnackbar(`获取最新评论出错: ${error.message}`, { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const classes = useStyles();

  return (
    <section>
      <Typography variant="h5" component="h2">
        最新评论
      </Typography>

      <List>
        {lastComment.map((item) => {
          const content = formatComment(item.content);

          return (
            <ListItem alignItems="flex-start" key={item.id}>
              <ListItemAvatar>
                <Avatar
                  style={{ fontSize: "0.875rem" }}
                  className={clsx({ [classes.purple]: item.group.includes("admin") })}
                >
                  {formatAvatar(item.username)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography component="span">{item.username}</Typography>
                    <Typography component="span" variant="body2" color="textSecondary" style={{ marginLeft: 8 }}>
                      {item.date}
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
              />
              <Typography variant="caption" className={classes.source} color="secondary">
                来自: {item.cnname}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </section>
  );
}
