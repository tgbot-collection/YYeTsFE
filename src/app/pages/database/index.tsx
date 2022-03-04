import * as React from "react";
import { noop, setTitle, toAbsoluteUrl } from "utils";
import { Button, Container, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";

import { getDatabase, GetDatabaseRes, postMetrics } from "API";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
    title: {
      marginBottom: theme.spacing(4),
    },
    db: {
      display: "grid",
      gridTemplateAreas: `
      'icon hash'
      'icon date'
      'icon button'
      `,
      gridTemplateColumns: "64px 1fr",
      gridGap: "8px",
      alignItems: "center",

      "& .icon": {
        gridArea: "icon",
      },
      "& .hash": {
        gridArea: "hash",
      },
      "& .date": {
        gridArea: "date",
      },
      "& .button": {
        gridArea: "button",
      },
    },
  })
);

export function DataBasePage() {
  setTitle("数据库下载");

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [db, setDb] = React.useState<GetDatabaseRes>({} as GetDatabaseRes);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);

    getDatabase()
      .then((res) => {
        setDb(res.data);
        setLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar(`获取数据库信息出错: ${err.message}`, { variant: "error" });
      });

    postMetrics("database").catch(noop);
  }, [enqueueSnackbar]);

  return (
    <Container className={classes.container}>
      <Typography variant="h5" component="h2" className={classes.title}>
        数据库下载
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} xl={4} className={classes.db}>
          <img src={toAbsoluteUrl("/svg/mongodb.svg")} alt="mongodb" className="icon" />
          {loading ? (
            <Skeleton />
          ) : (
            <Typography className="hash" noWrap title={db["yyets_mongo.gz"].checksum}>
              SHA1:&nbsp;
              <Typography component="span" variant="body2">
                {db["yyets_mongo.gz"].checksum}
              </Typography>
            </Typography>
          )}
          {loading ? (
            <Skeleton />
          ) : (
            <Typography className="date">
              Update:&nbsp;
              <Typography component="span" variant="body2">
                {db["yyets_mongo.gz"].date}
              </Typography>
            </Typography>
          )}
          <Button
            variant="outlined"
            href="/dump/yyets_mongo.gz"
            onClick={() => {
              gtag("event", "database", { type: "mongoDB" });
            }}
            style={{ textTransform: "none" }}
          >
            下载 mongoDB {db["yyets_mongo.gz"]?.size}
          </Button>
        </Grid>

        <Grid item xs={12} md={6} xl={4} className={classes.db}>
          <img src={toAbsoluteUrl("/svg/mysql.svg")} alt="mysql" className="icon" />
          {loading ? (
            <Skeleton />
          ) : (
            <Typography className="hash" noWrap title={db["yyets_mysql.zip"].checksum}>
              SHA1:&nbsp;
              <Typography component="span" variant="body2">
                {db["yyets_mysql.zip"].checksum}
              </Typography>
            </Typography>
          )}
          {loading ? (
            <Skeleton />
          ) : (
            <Typography className="date">
              Update:&nbsp;
              <Typography component="span" variant="body2">
                {db["yyets_mysql.zip"].date}
              </Typography>
            </Typography>
          )}
          <Button
            variant="outlined"
            href="/dump/yyets_mysql.zip"
            onClick={() => {
              gtag("event", "database", { type: "MySQL" });
            }}
            style={{ textTransform: "none" }}
          >
            下载 MySQL 5.7 {db["yyets_mysql.zip"]?.size}
          </Button>
        </Grid>

        <Grid item xs={12} md={6} xl={4} className={classes.db}>
          <img src={toAbsoluteUrl("/svg/sqlite.svg")} alt="sqlite" className="icon" />
          {loading ? (
            <Skeleton />
          ) : (
            <Typography className="hash" noWrap title={db["yyets_sqlite.zip"].checksum}>
              SHA1:&nbsp;
              <Typography component="span" variant="body2">
                {db["yyets_sqlite.zip"].checksum}
              </Typography>
            </Typography>
          )}
          {loading ? (
            <Skeleton />
          ) : (
            <Typography className="date">
              Update:&nbsp;
              <Typography component="span" variant="body2">
                {db["yyets_sqlite.zip"].date}
              </Typography>
            </Typography>
          )}
          <Button
            variant="outlined"
            href="/dump/yyets_sqlite.zip"
            onClick={() => {
              gtag("event", "database", { type: "SQLite" });
            }}
            style={{ textTransform: "none" }}
          >
            下载 SQLite {db["yyets_sqlite.zip"]?.size}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
