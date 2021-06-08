import * as React from "react";
import GitHubButton from "react-github-btn";
import { Button, Container, createStyles, Grid, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { toAbsoluteUrl } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: theme.palette.primary.main,
      textAlign: "center",
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(8),
      [theme.breakpoints.up("md")]: {
        paddingTop: theme.spacing(16),
        paddingBottom: theme.spacing(8),
        flexDirection: "row",
        alignItems: "flex-start",
        textAlign: "left",
      },
    },
    logo: {
      flexShrink: 0,
      width: 120,
      height: 120,
      borderRadius: "50%",
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        marginRight: theme.spacing(8),
        width: 195,
        height: 195,
      },
    },
    title: {
      marginLeft: -12,
      whiteSpace: "nowrap",
      letterSpacing: ".7rem",
      textIndent: ".7rem",
      fontWeight: theme.typography.fontWeightLight,
      [theme.breakpoints.only("xs")]: {
        fontSize: 28,
      },
    },
    button: {
      marginTop: theme.spacing(4),
    },
    social: {
      padding: theme.spacing(2, 0),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 21,
      boxSizing: "content-box",
      "& a": {
        color: theme.palette.background.paper,
      },
    },
    sponsor: {
      margin: "16px 0",
      display: "flex",
      alignItems: "center",

      "& img": {
        width: 40,
        height: 40,
      },
    },
  })
);

export function HomePage() {
  document.title = "首页";

  const classes = useStyles();

  return (
    <>
      <Container maxWidth="md" className={classes.content}>
        <img src={toAbsoluteUrl("/logo.png")} alt="logo" className={classes.logo} />
        <div>
          <Typography className={classes.title} variant="h3" component="h1" color="inherit" gutterBottom>
            人人影视分享站
          </Typography>
          <Typography variant="h5" component="p" color="textSecondary">
            本站数据库
            <Link component={RouterLink} to="/database" color="secondary">
              永久开源免费
            </Link>
            ，请不要做无意义的爬虫。
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
          <Typography style={{ marginRight: "16px" }}>支持一下: </Typography>

          <Link href="https://afdian.net/@BennyThink" style={{ transform: "translate3d(0, 3px,0)" }}>
            <img src={toAbsoluteUrl("sponsor/afdian.png")} alt="afdian" className="img" />
          </Link>
          <Link href="https://www.buymeacoffee.com/bennythink">
            <img
              src={toAbsoluteUrl("sponsor/coffee.jpg")}
              style={{
                marginLeft: "24px",
                transform: "scale(0.9)",
              }}
              alt="coffee"
              className="img"
            />
          </Link>
        </div>

        <Typography variant="h5" component="h2" style={{ marginTop: "40px" }}>
          特别鸣谢
        </Typography>

        <Container style={{ marginTop: "16px" }}>
          <Grid container>
            <Grid item xs={6} sm={3} style={{ margin: "8px 0" }}>
              <Typography align="center">人人影视</Typography>
            </Grid>
            <Grid item xs={6} sm={3} style={{ margin: "8px 0" }}>
              <Typography align="center">追新番</Typography>
            </Grid>
            <Grid item xs={6} sm={3} style={{ margin: "8px 0" }}>
              <Typography align="center">磁力下载站</Typography>
            </Grid>
            <Grid item xs={6} sm={3} style={{ margin: "8px 0" }}>
              <Typography align="center">FIX字幕侠</Typography>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}
