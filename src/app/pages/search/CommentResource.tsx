import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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

import { CommentResult, postMetrics } from "API";
import { formatAvatar, formatComment, noop } from "utils";
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
    tool: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
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
              <Link onClick={() => handleClick(content.resourceID, content.resourceName)}>{content.resourceName}</Link>
            </Typography>
          </Box>
        </Box>
      </section>
    </Drawer>
  );
}
