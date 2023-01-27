# YYeTs

YYeTsBot 前端

React App

自适应 PC、移动端，亮色、暗色模式

## 部署

1. 安装依赖

    ```shell
    yarn
    ```

1. 复制 `.env.example` 为 `.env`，修改其中的变量

    ```dotenv
    # 接口域名
    REACT_APP_DOMAIN=xxx
    # google analytic 追踪 ID
    REACT_APP_GA=xxx
    # Sentry DSN
    REACT_APP_SENTRY_DSN=xxx
    # 是否生成 sourcemap
    GENERATE_SOURCEMAP=true
    # adsense
    REACT_APP_ADSENSE=xxx
```

1. build 项目

    ```shell
    yarn build
    ```
