import React, { useEffect, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Adsense } from "@ctrl/react-adsense";
import { useSnackbar } from "notistack";

import { noop } from "utils";

import { postMetrics } from "../../../API";

export function RedirectPage() {
  const { enqueueSnackbar } = useSnackbar();

  const targetUrl = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("url") || "";
  }, []);

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (!targetUrl) return undefined;
    if (targetUrl === "loop") {
      setSeconds(3600);
    }

    postMetrics("redirect").catch(noop);

    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  if (!targetUrl) {
    return (
      <Card style={{ maxWidth: 640, margin: "40px auto" }}>
        <CardContent>
          <Typography variant="h6">链接无效</Typography>
          <Typography color="textSecondary">没有找到要跳转的目标链接。</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 720, margin: "40px auto" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          正在打开资源链接 {targetUrl}
        </Typography>

        <Typography color="textSecondary" paragraph>
          {seconds} 秒后将自动跳转到网友分享的网盘链接。
        </Typography>

        <Typography paragraph>⚠️ 如果链接无法打开、访问较慢，可能与地区网络或网盘限制有关。</Typography>

        <div
          style={{
            padding: 16,
            margin: "20px 0",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            解决打不开 / 没速度问题
          </Typography>
          <Typography variant="subtitle2" paragraph>
            使用 VPN 可以改善部分网盘访问失败、速度慢、地区限制等问题。
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            href="https://maomaoyun.org/#/register?code=kscCUYgT"
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={() => {
              postMetrics("vpnClick");
            }}
          >
            查看推荐 VPN
          </Button>
        </div>

        {process.env.REACT_APP_ADSENSE && (
          <Adsense
            className="adsbygoogle"
            client={`ca-pub-${process.env.REACT_APP_ADSENSE}`}
            slot="8326668457"
            style={{ display: "block" }}
            format="auto"
            responsive="true"
          />
        )}

        <Button variant="outlined" color="primary" href={targetUrl} rel="nofollow noopener noreferrer">
          立即打开
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          style={{ marginLeft: "1rem" }}
          onClick={() => {
            navigator.clipboard.writeText(targetUrl).then(() => {
              enqueueSnackbar("链接地址已复制", {
                variant: "success",
              });
            });
          }}
        >
          复制链接
        </Button>
      </CardContent>
    </Card>
  );
}
