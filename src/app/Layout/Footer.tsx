import * as React from "react";
import { Container, createStyles, Divider, Grid, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { toAbsoluteUrl } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(6),
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
    badge: {
      alignSelf: "center",
      padding: "1px 3px",
      backgroundColor: theme.palette.type === "light" ? "rgb(235, 87, 87)" : "#c55e5e",
      color: "#fff",
      borderRadius: 3,
      marginLeft: 6,
      fontSize: "10px",
      lineHeight: "1.3",
      textTransform: "uppercase",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      display: "inline-block",
    },
    design: {
      display: "flex",
      alignItems: "center",
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
            <Grid item xs={12} sm={4}>
              <div className={classes.logo}>
                <img src={toAbsoluteUrl("/logo.png")} alt="logo" />
                <Link color="inherit" variant="body1" component={RouterLink} to="/">
                  YYeTs
                </Link>
              </div>
            </Grid>

            <Grid item xs={6} sm={4} className={classes.list}>
              <Typography component="h2" gutterBottom>
                联系方式
              </Typography>
              <ul>
                <li>
                  <Link href="https://t.me/BennyThink" color="inherit" variant="body1">
                    Benny 小可爱
                  </Link>
                  <span className={classes.badge}>owner</span>
                </li>
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
                  <Link href="https://dmesg.app/" color="inherit" variant="body1">
                    Blog
                  </Link>
                </li>
              </ul>
            </Grid>

            <Grid item xs={6} sm={4} className={classes.list}>
              <Typography component="h2" gutterBottom>
                Credits
              </Typography>
              <ul>
                <li>
                  <Link href="http://www.zmz2019.com" color="inherit" variant="body1">
                    人人影视
                  </Link>
                </li>
                <li>
                  <Link href="http://www.zhuixinfan.com/main.php" color="inherit" variant="body1">
                    追新番
                  </Link>
                </li>
                <li>
                  <Link href="http://oabt005.com/home.html" color="inherit" variant="body1">
                    磁力下载站
                  </Link>
                </li>
                <li>
                  <Link href="https://www.zimuxia.cn" color="inherit" variant="body1">
                    FIX字幕侠
                  </Link>
                </li>
              </ul>
            </Grid>
          </Grid>

          <Typography color="textSecondary" variant="body2">
            遵循 &nbsp;
            <Link color="inherit" href="https://github.com/mui-org/material-ui/blob/master/LICENSE">
              MIT
            </Link>
            &nbsp;发布， Copyright © {new Date().getFullYear()} YYeTs。
          </Typography>

          <Typography className={classes.design} variant="body2" color="textSecondary">
            Design by
            <Link href="https://github.com/wyx1818">&nbsp;Zuiyu</Link>
            <span className={classes.badge}>FE</span>
          </Typography>
        </footer>
      </Container>
    </div>
  );
}
