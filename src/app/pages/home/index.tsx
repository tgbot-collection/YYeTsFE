import * as React from "react";
import GitHubButton from "react-github-btn";
import { Button, Container, Link, Typography, Popover, Box, Grid, Chip } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { Adsense } from "@ctrl/react-adsense";

import { noop, setTitle, toAbsoluteUrl } from "utils";
import { postMetrics } from "API";
import { useStyles } from "./Styled";
import { LastComment } from "./LastComment";
import { Announce } from "./Announce";

export function HomePage() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  setTitle("首页");

  const classes = useStyles();

  React.useEffect(() => {
    postMetrics("home").catch(noop);
  }, []);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Container maxWidth="md" className={classes.content}>
        <img src={toAbsoluteUrl("/svg/logo.svg")} alt="logo" className={classes.logo} />
        <div>
          <Typography className={classes.title} variant="h3" component="h1" color="inherit" gutterBottom>
            人人影视分享站
          </Typography>
          <Typography variant="h5" component="p" color="textSecondary" gutterBottom>
            本站数据库
            <Link component={RouterLink} to="/database" color="secondary">
              可下载
            </Link>
            ， 如有疑问可以查看
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
          <Typography style={{ marginRight: "16px" }} onMouseEnter={handleClick} onClick={handleClick}>
            觉得不错，
            <Link>支持一下</Link>
          </Typography>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            PaperProps={{ style: { width: "75%", padding: "2rem" } }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={4}>
                <Typography variant="h4" gutterBottom>
                  Stripe（支付宝）
                </Typography>
                <img
                  src="https://raw.githubusercontent.com/tgbot-collection/YYeTsBot/master/assets/CNY.png"
                  style={{
                    width: "10rem",
                  }}
                  alt="Stripe"
                />
                <Typography gutterBottom>
                  <Link href="https://buy.stripe.com/dR67vU4p13Ox73a6oq">赞赏链接</Link>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>
                  加密货币
                </Typography>
                <Box display="flex">
                  <Chip label="USDT-TRC20" variant="outlined" color="secondary" size="small" />
                  <Typography gutterBottom>TL8kqCm9SwrV44qLaKvWbwrTtDN3sx5dVP</Typography>
                </Box>
                <Box display="flex">
                  <Chip label="Toncoin" variant="outlined" color="secondary" size="small" />
                  <Typography gutterBottom> UQBkXRAUVoEF2AA7QejHpsr3JmBWhsIfQTLURxJ3txc_rVFI</Typography>
                </Box>
                <Box display="flex">
                  <Chip label="TRX" variant="outlined" color="secondary" size="small" />
                  <Typography gutterBottom> TF9peZjC2FYjU4xNMPg3uP4caYLJxtXeJS</Typography>
                </Box>
                <Box display="flex">
                  <Chip label="XLM" variant="outlined" color="secondary" size="small" />
                  <Typography gutterBottom> GDGGEI35XJ7BQ6K3WLSVVFJA5JWGSIDVT4QAWAYHBG2Y3V3NLP76RC5U</Typography>
                </Box>
                <Box display="flex">
                  <Chip label="ALGO" variant="outlined" color="secondary" size="small" />
                  <Typography gutterBottom> Q3YIDNVGHNWYPPOWJE4K5UVTYGM33ADPNVRKXSTYGWAPAWADJSDZ34N6AA</Typography>
                </Box>
              </Grid>
            </Grid>
          </Popover>
        </div>
      </div>

      <Container maxWidth="md">
        <Announce />
        <br />
        <LastComment />
        {process.env.REACT_APP_ADSENSE && (
          <Adsense
            className="adsbygoogle"
            client={`ca-pub-${process.env.REACT_APP_ADSENSE}`}
            slot="3458388260"
            style={{ display: "block" }}
            format="auto"
            responsive="true"
          />
        )}
      </Container>
    </>
  );
}
