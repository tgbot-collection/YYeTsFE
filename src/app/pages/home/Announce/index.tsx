import * as React from "react";
import { Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { Skeleton } from "@material-ui/lab";

import { AnnounceObject, getAnnounce } from "API/announce";

export function Announce() {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [announce, setAnnounce] = React.useState<Array<AnnounceObject>>([]);

  React.useEffect(() => {
    getAnnounce({ size: 10, page: 1 })
      .then((res) => {
        setLoading(false);
        if (Array.isArray(res.data.data)) {
          setAnnounce(res.data.data.slice(0, 1));
        }
      })
      .catch((error) => {
        enqueueSnackbar(`获取公告出错: ${error.message}`, { variant: "error" });
      });
  }, [enqueueSnackbar]);

  return (
    <section>
      <Typography variant="h5" component="h2" gutterBottom>
        公告
      </Typography>

      <div style={{ padding: "0 16px" }}>
        {announce.length > 0 ? (
          announce.map((item) => <Typography key={item.content}>{item.content}</Typography>)
        ) : (
          <Typography>{loading ? <Skeleton height={24} /> : "暂无公告"}</Typography>
        )}
      </div>
    </section>
  );
}
