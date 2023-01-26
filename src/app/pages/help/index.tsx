import * as React from "react";
import { noop, setTitle } from "utils";
import { Container, createStyles, Link as MuiLink, makeStyles, Theme, Typography } from "@material-ui/core";

import { postMetrics } from "API";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
    title: {
      marginBottom: theme.spacing(4),
    },
    item: {
      marginBottom: theme.spacing(4),
    },
  })
);

export function HelpPage() {
  setTitle("帮助页");
  const classes = useStyles();

  React.useEffect(() => {
    postMetrics("help").catch(noop);
  }, []);

  return (
    <Container className={classes.container}>
      <Typography variant="h5" component="h2" className={classes.title}>
        FAQ
      </Typography>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          如何下载
        </Typography>
        <Typography>一般来说，分享页面的下载链接是有电驴、磁力链和网盘的。</Typography>
        <Typography>网盘就去下载对应的客户端，电驴和磁力链，可以尝试下迅雷。</Typography>
        <Typography>
          磁力链还可以试试 qBittorrent、uTorrent、BitCommet，并且记得去同步一份最新的{" "}
          <MuiLink href="https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all.txt">
            tracker
          </MuiLink>{" "}
          哦。
        </Typography>
        <Typography> 另外值得一提的是，有些网盘支持离线资源，可以把磁力、ed2k贴进去。</Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          如何使用 Resilio Sync
        </Typography>
        <Typography>
          推荐使用 Resilio Sync 来进行资源下载，直接点击链接就可以。
          <Typography>如果你无法访问链接，也可以在客户端直接使用点击链接之后复制的 Key。</Typography>
          具体方法请移步
          <MuiLink href="https://zhuanlan.zhihu.com/p/280756218">
            《它一度被墙，如今又悄然复活，为你轰开一个隐秘新世界》
          </MuiLink>
          。
        </Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          是否会关站
        </Typography>
        <Typography>不会，我的主观意愿不会。即使被关站也不要怕，本项目的代码、数据库都是开源的。</Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          有些资源没有，是什么原因
        </Typography>
        <Typography>这个是做的归档数据，所以新剧是没有的。当然，如果我心情好，也许还会手动添加几部。</Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          搜索没结果，怎么回事
        </Typography>
        <Typography>是不是译名和人人影视那边不一样？试试原名？尽量缩短关键词？</Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          想要支持我
        </Typography>
        <Typography>
          谢谢你哦！可以通过点<MuiLink href="https://github.com/tgbot-collection/YYeTsBot">🌟</MuiLink>
          ，宣传，使用等方式来支持。当然你也可以通过{" "}
          <MuiLink href="https://afdian.net/@BennyThink">Buy Me a Coffee</MuiLink> 、
          <MuiLink href="https://www.buymeacoffee.com/bennythink">爱发电</MuiLink>或
          <MuiLink href="https://buy.stripe.com/dR67vU4p13Ox73a6oq">Stripe</MuiLink>来支持我！
        </Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          其他的使用方式
        </Typography>
        <Typography>
          还有一个<MuiLink href="https://t.me/yyets_bot">Telegram Bot</MuiLink>，数据和这个网站是同步的。
        </Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          可以商业化这个项目吗
        </Typography>
        <Typography>
          有一点需要先声明，我不会进行如加入会员制度等商业化行为。所有用户等捐赠是自发性并且不具有强制性。
        </Typography>
        <Typography>
          本项目使用
          <MuiLink href="https://github.com/tgbot-collection/YYeTsBot/blob/master/LICENSE"> MIT 协议</MuiLink>
          授权，因此你可以进行商业化，以任意形式进行分发、修改以及私有使用。你只要保持保持版权声明就可以了。
        </Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          网站打不开，无法搜索
        </Typography>
        <Typography>
          呃这个应该不太可能啊。可能你网络连接到 Cloudflare 不太稳？换个网络，再刷新试试看呢？还不行去 GitHub
          报错给我吧。
        </Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          本站会收集哪些信息
        </Typography>
        <Typography>主要有如下几种信息：</Typography>
        <Typography>
          1.
          你的IP地址会被记录在Nginx的日志中。在面临攻击、爬虫等恶意行为时，我会找到这个IP然后加到防火墙中。我不会公开或与第三方分享访问日志；
        </Typography>
        <Typography>2. 我使用了 Google Analytics，请参考 Google Analytics 的隐私政策；</Typography>
        <Typography>3. 我使用了 Google Adsense，请参考 Google Adsense 的隐私政策；</Typography>
        <Typography>4. 我使用了 Cloudflare，请参考 Cloudflare 的隐私政策；</Typography>
        <Typography>5. 我记录了metrics信息，用于优化日后访问量，此信息不包含个人信息，无法用于追踪你；</Typography>
        <Typography>
          6. 如果你选择注册，我会保存你的用户名、加密后的密码、注册时间、UA等信息。此类信息不会被公开或与第三方分享；
        </Typography>
        <Typography>7. 如果你选择收藏某些资源，那么日后可能用于统计排行榜，这项信息不会包含你的个人信息。</Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          注册需要提供什么
        </Typography>
        <Typography>
          任何人都可以注册，随便写个用户名密码就可以了，没有限制的哦。我使用了 pbkdf2_sha256 安全保存你的密码。
        </Typography>
        <Typography>我知道这个功能太简陋了，比如说无法找回密码，很多很多。凑合用吧 😂</Typography>
        <Typography>哦对了，你的用户信息不会被包含在上述数据库之中。</Typography>
      </div>

      <div className={classes.item}>
        <Typography variant="h6" component="h3" gutterBottom>
          注册用户有何好处
        </Typography>
        <Typography>
          注册用户可以发表评论，但是请注意文明用语。该网站是我的私人空间，不当言论可能会导致封号。
        </Typography>
        <Typography>日后可能会考虑转向为只有注册用户才能看到资源的模式。</Typography>
      </div>
    </Container>
  );
}
