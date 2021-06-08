import {
  Container,
  createStyles,
  Divider,
  Grid,
  Link,
  makeStyles,
  styled,
  Theme,
  Typography,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { toAbsoluteUrl } from "utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(6),
    },
    footer: {
      padding: theme.spacing(3, 0),
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
        padding: "6px 0",
        color: theme.palette.text.secondary,
      },
    },
    badge: {
      alignSelf: "center",
      padding: "1px 3px",
      backgroundColor:
        theme.palette.type === "light" ? "rgb(235, 87, 87)" : "#c55e5e",
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
                <Link
                  color="inherit"
                  variant="body1"
                  component={RouterLink}
                  to="/"
                >
                  影视分享站
                </Link>
              </div>
            </Grid>

            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom>
                作者
              </Typography>
              <ul>
                <li>
                  <Link
                    href="https://t.me/BennyThink"
                    color="inherit"
                    variant="body1"
                  >
                    Benny 小可爱
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://t.me/mikuri520"
                    color="inherit"
                    variant="body1"
                  >
                    Telegram Channel
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://dmesg.app/"
                    color="inherit"
                    variant="body1"
                  >
                    博客
                  </Link>
                </li>
              </ul>
            </Grid>

            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom>
                资源
              </Typography>
              <ul>
                <li>
                  <Link
                    component={RouterLink}
                    to="/help"
                    color="inherit"
                    variant="body1"
                  >
                    帮助
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://t.me/BennyThink"
                    color="inherit"
                    variant="body1"
                  >
                    Github
                  </Link>
                </li>
              </ul>
            </Grid>

            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom>
                贡献者
              </Typography>
              <ul>
                <li>
                  <Link
                    href="https://github.com/wyx1818"
                    color="inherit"
                    variant="body1"
                  >
                    zuiyu
                  </Link>
                  <span className={classes.badge}>前端</span>
                </li>
                <li>
                  <Link
                    href="https://github.com/secsilm"
                    color="inherit"
                    variant="body1"
                  >
                    Alan Lee
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/2926295173"
                    color="inherit"
                    variant="body1"
                  >
                    AOIAN
                  </Link>
                </li>
              </ul>
            </Grid>
          </Grid>
        </footer>
      </Container>
    </div>
  );
}
