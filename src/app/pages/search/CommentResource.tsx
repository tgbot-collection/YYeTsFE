import * as React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  createStyles,
  Divider,
  Drawer,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { FileCopy as CopyIcon } from "@material-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

import { CommentResult, postMetrics } from "API";
import { formatAvatar, formatComment, noop } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { width: "85vw", minWidth: "300px", maxWidth: "500px" },
    header: {
      padding: theme.spacing(1.5),
    },
    content: {
      padding: theme.spacing(1.5, 2, 1.5, 1.5),
    },
    user: {
      display: "grid",
      gridTemplateAreas: `
       'avatar name'
       'avatar date'
      `,
      gridTemplateColumns: "50px 1fr",
      gridGap: "2px 4px",

      "& .avatar": {
        gridArea: "avatar",
        position: "relative",
        fontSize: "0.875rem",
        width: "40px",
        height: "40px",
      },
      "& .name": {
        gridArea: "name",
      },
      "& .date": {
        gridArea: "date",
      },
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: "none",
    },
  })
);

interface CommentResourcePropTypes {
  open: boolean;
  content: CommentResult | null;
  onClose: () => void;
}

export default function CommentResource(props: CommentResourcePropTypes) {
  const { open, onClose, content } = props;

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  if (!content) return null;

  const formattedContent = formatComment(content.comment);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <section className={classes.root}>
        <Typography className={classes.header} variant="h6">
          评论详情
        </Typography>
        <Divider />
        <Box className={classes.content}>
          <div className={classes.user}>
            <Avatar className="avatar">{formatAvatar(content.username)}</Avatar>

            <Typography className="name" noWrap variant="body2">
              {content.username}
            </Typography>
            <Typography className="date" color="textSecondary" variant="body2">
              {content.date}
            </Typography>
          </div>

          <Card style={{ margin: "12px 0" }}>
            <CardContent>
              <Typography style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}>
                {formattedContent.name && `@${formattedContent.name}, `}
                {formattedContent.text}{" "}
                <CopyToClipboard
                  text={formattedContent.text}
                  onCopy={() => {
                    enqueueSnackbar("评论已复制", {
                      variant: "success",
                    });
                    postMetrics("copyComment").catch(noop);
                    gtag("event", "copyComment");
                  }}
                >
                  <CopyIcon color="primary" fontSize="small" style={{ marginLeft: 4 }} />
                </CopyToClipboard>
              </Typography>
            </CardContent>
          </Card>

          <Typography align="right" variant="body2">
            来自：
            <Link
              to={{
                pathname: "/resource",
                search: `?id=${content.resourceID}`,
                state: { title: content.resourceName },
              }}
              className={classes.link}
            >
              {content.resourceName}
            </Link>
          </Typography>
        </Box>
      </section>
    </Drawer>
  );
}
