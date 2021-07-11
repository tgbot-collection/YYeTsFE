import * as React from "react";
import { Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { AnnounceObject, getAnnounce } from "API/announce";

export function Announce() {
  const [announce, setAnnounce] = React.useState<Array<AnnounceObject>>([]);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    getAnnounce({ size: 10, page: 1 })
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setAnnounce(res.data.data.slice(0, 1));
        }
      })
      .catch((error) => {
        enqueueSnackbar(`获取公告出错: ${error.message}`, { variant: "error" });
      });
  }, [enqueueSnackbar]);

  if (announce.length === 0) {
    return null;
  }

  return (
    <section>
      <Typography variant="h5" component="h2" gutterBottom>
        公告
      </Typography>

      <div style={{ padding: "0 16px" }}>
        {announce.map((item) => (
          <Typography key={item.content}>{item.content}</Typography>
        ))}
      </div>
    </section>
  );
}
