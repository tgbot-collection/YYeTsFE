import * as React from "react";
import { setTitle, toAbsoluteUrl } from "utils";
import { Button, Container, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";

import { getDatabase, GetDatabaseRes } from "API";
import { Skeleton } from "@material-ui/lab";

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

  const [db, setDb] = React.useState<GetDatabaseRes>({} as GetDatabaseRes);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);

    getDatabase()
      .then((res) => {
        setDb(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          {loading ? <Skeleton /> : <Typography className="date">Update: {db["yyets_mongo.gz"].date}</Typography>}
          <Button variant="outlined" href="/data/yyets_mongo.gz">
            下载 MongoDB {db["yyets_mongo.gz"]?.size}
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
          {loading ? <Skeleton /> : <Typography className="date">Update: {db["yyets_mysql.zip"].date}</Typography>}
          <Button variant="outlined" href="/data/yyets_mysql.zip">
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
          {loading ? <Skeleton /> : <Typography className="date">Update: {db["yyets_sqlite.zip"].date}</Typography>}
          <Button variant="outlined" href="/data/yyets_sqlite.zip">
            下载 SQLite {db["yyets_sqlite.zip"]?.size}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
