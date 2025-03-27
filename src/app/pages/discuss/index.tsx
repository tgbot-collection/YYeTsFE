import * as React from "react";
import { noop, setTitle } from "utils";
import { Container, Link, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

import { postMetrics } from "API";
import { CommentComponent } from "features";
import { Adsense } from "@ctrl/react-adsense";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
  }),
);

export function DiscussPage() {
  setTitle("留言板");

  const classes = useStyles();

  React.useEffect(() => {
    postMetrics("discuss").catch(noop);
  }, []);

  return (
    <Container className={classes.container}>
      <Typography component="h2" variant="h4" gutterBottom>
        留言板
        <span style={{ fontSize: "medium", paddingLeft: "1rem" }}>
          人工智能大语言模型，
          <Link href="https://burn.hair/?lang=zh-CN&utm_source=yyets">快来使用头顶冒火吧</Link> ！ 头顶冒火 推荐使用
          <Link href="https://maomaoyun.net/#/register?code=XHn52jB3"> 猫猫云VPN</Link>
        </span>
      </Typography>

      <Typography gutterBottom style={{ marginBottom: "32px" }}>
        留下你想说的和建议吧
      </Typography>
      {process.env.REACT_APP_ADSENSE && (
        <Adsense
          className="adsbygoogle"
          client={`ca-pub-${process.env.REACT_APP_ADSENSE}`}
          slot="9564593623"
          style={{ display: "block" }}
          format="auto"
          responsive="true"
        />
      )}
      <CommentComponent id={233} loading={false} />
    </Container>
  );
}
