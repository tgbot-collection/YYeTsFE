import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Drawer,
  IconButton,
  Link,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { FileCopy as CopyIcon, Close as CloseIcon } from "@material-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";

import { CommentResult, postMetrics, SubtitleResult } from "API";
import { formatAvatar, formatComment, noop, getGravatar } from "utils";
import { useGoResourcePage } from "hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "75vw",
      minWidth: "300px",
      maxWidth: "500px",
      paddingBottom: "24px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(1.5),
    },
    content: {
      padding: theme.spacing(1.5, 2, 1.5, 1.5),
    },
    tool: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    forceCursor: {
      cursor: "pointer",
    },
  }),
);

interface CommentResourcePropTypes {
  open: boolean;
  content: CommentResult | null;
  onClose: () => void;
}

export default function CommentDrawer(props: CommentResourcePropTypes) {
  const { open, onClose, content } = props;

  const { enqueueSnackbar } = useSnackbar();

  const handleClick = useGoResourcePage();
  const classes = useStyles();

  if (!content) return null;

  const formattedContent = formatComment(content.comment);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <section className={classes.root}>
        <header className={classes.header}>
          <Typography variant="h6">评论详情</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </header>

        <Divider />
        <Box className={classes.content}>
          <Card style={{ margin: "12px 0" }}>
            <CardHeader
              avatar={
                <Avatar
                  style={{ fontSize: "0.875rem", color: "inherit" }}
                  src={getGravatar(content.username, content.hasAvatar, content.hash)}
                >
                  {formatAvatar(content.username)}
                </Avatar>
              }
              title={content.username}
              subheader={content.date}
            />

            <CardContent>
              <Typography style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}>
                {formattedContent.name && `@${formattedContent.name}, `}
                {formattedContent.text}{" "}
              </Typography>
            </CardContent>
          </Card>

          <Box className={classes.tool}>
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
              <Button variant="contained" color="primary" size="small" startIcon={<CopyIcon />}>
                复制评论
              </Button>
            </CopyToClipboard>

            <Typography align="right" variant="body2">
              来自：
              <Link
                className={classes.forceCursor}
                onClick={() => handleClick(content.resourceID, content.commentID, content.resourceName)}
              >
                {content.resourceName}
              </Link>
            </Typography>
          </Box>
        </Box>
      </section>
    </Drawer>
  );
}
