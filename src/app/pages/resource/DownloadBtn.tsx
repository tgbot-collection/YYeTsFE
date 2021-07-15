import * as React from "react";
import { ProviderContext, useSnackbar } from "notistack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "@material-ui/core";
import { Cloud as CloudIcon, FileCopy as FileCopyIcon, Sync as ResilioIcon } from "@material-ui/icons";

import { postMetrics, ResourceDetail } from "API";

interface ButtonProps {
  downItem: ResourceDetail["files"][0];
  enqueueSnackbar: ProviderContext["enqueueSnackbar"];
  resourceId: string;
}

const CopyButton = (props: ButtonProps) => {
  const { downItem, enqueueSnackbar, resourceId } = props;

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <CopyToClipboard
      text={downItem.address}
      onCopy={() => {
        enqueueSnackbar(`${downItem.way_cn} 下载地址复制成功`, {
          variant: "success",
        });
        gtag("event", "download", { resource_id: resourceId, type: downItem.way_cn });
        postMetrics("download");
      }}
    >
      <Button
        variant="contained"
        size="small"
        startIcon={<FileCopyIcon />}
        title={downItem.address}
        onClick={handleClick}
        disableElevation
      >
        {downItem.way_cn}
      </Button>
    </CopyToClipboard>
  );
};

const HrefButton = (props: ButtonProps) => {
  const { downItem, enqueueSnackbar, resourceId } = props;

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <CopyToClipboard
      text={downItem.passwd || "无密码"}
      onCopy={() => {
        enqueueSnackbar(`已复制网盘密码: ${downItem.passwd || "无密码"}`, {
          variant: "success",
        });
        gtag("event", "download", { resource_id: resourceId, type: downItem.way_cn });
        postMetrics("download");
        setTimeout(() => {
          window.open(downItem.address);
        }, 1000);
      }}
    >
      <Button
        variant="contained"
        size="small"
        startIcon={<CloudIcon />}
        href={downItem.address}
        onClick={handleClick}
        title={`网盘密码：${downItem.passwd || "无密码"}`}
        color="primary"
        disableElevation
      >
        {downItem.way_cn}
      </Button>
    </CopyToClipboard>
  );
};

const ResilioButton = (props: ButtonProps) => {
  const { downItem, enqueueSnackbar, resourceId } = props;

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <CopyToClipboard
      text={downItem.passwd || "无密码"}
      onCopy={() => {
        enqueueSnackbar(`已复 Key: ${downItem.passwd || "获取 key 失败"}`, {
          variant: "success",
          action: () => (
            <Button href="https://zhuanlan.zhihu.com/p/280756218" color="inherit">
              使用帮助
            </Button>
          ),
          autoHideDuration: 5000,
        });
        gtag("event", "ResilioSync", { resource_id: resourceId, type: downItem.way_cn });
        postMetrics("ResilioSync");

        setTimeout(() => {
          window.open(downItem.address);
        }, 1500);
      }}
    >
      <Button
        variant="contained"
        size="small"
        startIcon={<ResilioIcon />}
        href={downItem.address}
        onClick={handleClick}
        title={`ResilioSync Key：${downItem.passwd || "无 Key"}`}
        color="secondary"
        disableElevation
      >
        {downItem.way_cn}
      </Button>
    </CopyToClipboard>
  );
};

interface DownloadBtnPropTypes {
  downItem: ResourceDetail["files"][0];
  resourceId: string;
}

export function DownloadBtn(props: DownloadBtnPropTypes) {
  const { downItem, resourceId } = props;

  const { enqueueSnackbar } = useSnackbar();

  switch (downItem.way) {
    case "1":
    case "2":
      return <CopyButton downItem={downItem} enqueueSnackbar={enqueueSnackbar} resourceId={resourceId} />;
    case "7":
      return <ResilioButton downItem={downItem} enqueueSnackbar={enqueueSnackbar} resourceId={resourceId} />;
    default:
      return <HrefButton downItem={downItem} enqueueSnackbar={enqueueSnackbar} resourceId={resourceId} />;
  }
}
