import * as React from "react";
import { Box, Container, createStyles, Divider, Grid, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { toAbsoluteUrl } from "utils";
import packageInfo from "../../../package.json";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
    },
    footer: {
      padding: theme.spacing(3, 0),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(8, 0),
      },
    },
    logo: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(4),
      "& img": {
        width: 28,
        height: 28,
        marginRight: theme.spacing(1.5),
      },
    },
    list: {
      marginBottom: theme.spacing(4),
      "& h3": {
        fontWeight: theme.typography.fontWeightMedium,
      },
      "& ul": {
        margin: 0,
        padding: 0,
        listStyle: "none",
      },
      "& li": {
        display: "flex",
        alignItems: "center",
        padding: "6px 0",
        color: theme.palette.text.secondary,
      },
    },
  })
);

export function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Divider />
      <Container maxWidth="md">
        <footer className={classes.footer}>
          <Grid container>
            <Grid item xs={12} sm={3}>
              <div className={classes.logo}>
                <img src={toAbsoluteUrl("/logo.png")} alt="logo" />
                <Link color="inherit" variant="body1" component={RouterLink} to="/">
                  人人影视分享
                </Link>
              </div>
            </Grid>

            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom>
                项目作者
              </Typography>
              <ul>
                <li>
                  <Link href="https://t.me/BennyThink" color="inherit" variant="body1">
                    Benny 小可爱
                  </Link>
                </li>
                <li>
                  <Link href="https://dmesg.app/" color="inherit" variant="body1">
                    Blog
                  </Link>
                </li>
              </ul>
            </Grid>

            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom>
                相关资源
              </Typography>
              <ul>
                <li>
                  <Link href="https://t.me/yyets_bot" color="inherit" variant="body1">
                    Telegram Bot
                  </Link>
                </li>
                <li>
                  <Link href="https://t.me/mikuri520" color="inherit" variant="body1">
                    Telegram Channel
                  </Link>
                </li>
                <li>
                  <Link color="inherit" variant="body1" component={RouterLink} to="/database">
                    数据库下载
                  </Link>
                </li>
              </ul>
            </Grid>

            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom>
                其他
              </Typography>
              <ul>
                <li>
                  <Link color="inherit" variant="body1" component={RouterLink} to="/help">
                    帮助页
                  </Link>
                </li>
                <li>
                  <Link href="https://yysubs.com" color="inherit" variant="body1">
                    加入字幕组
                  </Link>
                </li>
              </ul>
            </Grid>
          </Grid>

          <Box justifyContent="space-between" display="flex">
            <Typography color="textSecondary" variant="body2">
              Web Design by&nbsp;
              <Link href="https://blog.zuiyu1818.cn" color="secondary">
                Zuiyu
              </Link>
              ，Copyright © 2019 - {new Date().getFullYear()} YYeTs
            </Typography>

            <Typography color="textSecondary" variant="body2">
              v{packageInfo.version}
            </Typography>
          </Box>
        </footer>
      </Container>
    </div>
  );
}
