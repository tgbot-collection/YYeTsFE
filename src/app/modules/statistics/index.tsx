import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { getMetrics, MetricsInfo } from "API";
import { useStyles } from "./styled";
import { Visitor } from "./Visitor";

export default function Statistics() {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = useState<Array<MetricsInfo>>([]);

  useEffect(() => {
    getMetrics()
      .then((res) => {
        setLoading(false);
        const dataArr = res.data.metrics;

        setData(dataArr);
      })
      .catch((error) => {
        enqueueSnackbar(`获取统计数据出错: ${error.message}`, { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography gutterBottom variant="h5" component="h2">
        数据统计
      </Typography>

      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Visitor data={data} loading={loading} />
        </Grid>
      </Grid>
    </Container>
  );
}
