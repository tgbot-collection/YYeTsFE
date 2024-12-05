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
import axios from "axios";

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

interface SubtitleResourcePropTypes {
  open: boolean;
  content: SubtitleResult | null;
  onClose: () => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function mapSource(s: string) {
  if (s === "original") return "原创";
  if (s === "trans") return "转载";
  if (s === "official") return "官方字幕";
  return "未知";
}
export default function SubtitleDrawer(props: SubtitleResourcePropTypes) {
  const { open, onClose, content } = props;
  const { enqueueSnackbar } = useSnackbar();
  const handleDownload = async (file: string) => {
    try {
      const response = await axios.post("/api/download", { file }, { responseType: "arraybuffer" });
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.headers["x-filename"];
      link.click();
      URL.revokeObjectURL(url);
      enqueueSnackbar("下载中", {
        variant: "success",
      });
    } catch (e: any) {
      const m = e.response.status === 404 ? "资源不存在" : e.message;
      enqueueSnackbar(`下载失败 ${m}`, {
        variant: "error",
      });
    }
  };

  const handleClick = useGoResourcePage();
  const classes = useStyles();

  if (!content) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <section className={classes.root}>
        <header className={classes.header}>
          <Typography variant="h6">字幕详情</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </header>

        <Divider />
        <Box className={classes.content}>
          <Card style={{ margin: "12px 0" }}>
            <CardHeader title={content.cnname} subheader={formatTime(content.dateline)} />

            <CardContent>
              <Typography style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}>
                浏览次数{content.views} 下载次数{content.downloads}
              </Typography>
            </CardContent>
          </Card>

          <Box className={classes.tool}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CopyIcon />}
              onClick={() => {
                handleDownload(content.file);
              }}
            >
              下载字幕
            </Button>
            {content.resourceid !== 0 && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<CopyIcon />}
                onClick={() => handleClick(content.resourceid, "", "")}
              >
                浏览资源
              </Button>
            )}

            <Typography align="right" variant="body2">
              字幕来源：
              {mapSource(content.source)}
            </Typography>
          </Box>
        </Box>
      </section>
    </Drawer>
  );
}
