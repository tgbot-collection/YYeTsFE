import * as React from "react";
import GitHubButton from "react-github-btn";
import { Button, Container, Link, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { noop, setTitle, toAbsoluteUrl } from "utils";
import { postMetrics } from "API";
import { useStyles } from "./Styled";
import { LastComment } from "./LastComment";
import { Announce } from "./Announce";

export function HomePage() {
  setTitle("首页");

  const classes = useStyles();

  React.useEffect(() => {
    postMetrics("home").catch(noop);
  }, []);

  return (
    <>
      <Container maxWidth="md" className={classes.content}>
        <img src={toAbsoluteUrl("/logo.png")} alt="logo" className={classes.logo} />
        <div>
          <Typography className={classes.title} variant="h3" component="h1" color="inherit" gutterBottom>
            人人影视分享站
          </Typography>
          <Typography variant="h5" component="p" color="textSecondary" gutterBottom>
            本站数据库
            <Link component={RouterLink} to="/database" color="secondary">
              永久开源免费
            </Link>
            ，请不要做无意义的爬虫。
          </Typography>
          <Typography variant="h5" component="p" color="textSecondary">
            如有疑问可以先查看
            <Link component={RouterLink} to="/help">
              帮助页
            </Link>
          </Typography>

          <Button className={classes.button} variant="outlined" color="primary" component={RouterLink} to="/search">
            开始使用
          </Button>
        </div>
      </Container>

      <div className={classes.social}>
        <div>
          <GitHubButton
            href="https://github.com/tgbot-collection/YYeTsBot"
            data-show-count
            data-icon="star"
            data-text="star"
          />

          <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" style={{ marginLeft: "8px" }} />
        </div>

        <div className={classes.sponsor}>
          <Typography style={{ marginRight: "16px" }}>觉得不错，支持一下: </Typography>

          <Link href="https://afdian.net/@BennyThink" style={{ transform: "translate3d(0, 3px,0)" }}>
            <img src={toAbsoluteUrl("/sponsor/afdian.png")} alt="afdian" className="img" />
          </Link>
          <Link href="https://www.buymeacoffee.com/bennythink">
            <img
              src={toAbsoluteUrl("/sponsor/coffee.jpg")}
              style={{
                marginLeft: "24px",
                transform: "scale(0.9)",
                borderRadius: "50%",
              }}
              alt="coffee"
              className="img"
            />
          </Link>
        </div>
      </div>

      <Container maxWidth="md">
        <Announce />
        <br />
        <LastComment />
      </Container>
    </>
  );
}
