import * as React from "react";
import { setTitle, toAbsoluteUrl } from "utils";
import { Button, Container, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";

import { getDatabase, GetDatabaseRes } from "API";

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

  const [db, setDb] = React.useState<GetDatabaseRes>({
    "yyets_mongo.gz": {
      checksum: "b32e9d8e24c607a9f29889a926c15179d9179791",
      date: "2021-04-15 22:11:08",
    },
    "yyets_mysql.zip": {
      checksum: "6b24ae7cb7cef42951f7e2df183f0825512029e0",
      date: "2021-04-15 22:11:08",
    },
    "yyets_sqlite.zip": {
      checksum: "7e1659ab5cbc98b21155c3debce3015c39f1ec05",
      date: "2021-04-15 22:11:08",
    },
  });

  React.useEffect(() => {
    getDatabase()
      .then((res) => {
        setDb(res.data);
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
        <Grid item xs={12} md={6} lg={4} className={classes.db}>
          <img src={toAbsoluteUrl("/svg/mongodb.svg")} alt="mongodb" className="icon" />
          <Typography className="hash" noWrap title={db["yyets_mongo.gz"].checksum}>
            SHA1:&nbsp;
            <Typography component="span" variant="body2">
              {db["yyets_mongo.gz"].checksum}
            </Typography>
          </Typography>
          <Typography className="date">Update: {db["yyets_mongo.gz"].date}</Typography>
          <Button variant="outlined" href="/data/yyets_mongo.gz">
            下载
          </Button>
        </Grid>

        <Grid item xs={12} md={6} lg={4} className={classes.db}>
          <img src={toAbsoluteUrl("/svg/mysql.svg")} alt="mysql" className="icon" />
          <Typography className="hash" noWrap title={db["yyets_mysql.zip"].checksum}>
            SHA1:&nbsp;
            <Typography component="span" variant="body2">
              {db["yyets_mysql.zip"].checksum}
            </Typography>
          </Typography>
          <Typography className="date">Update: {db["yyets_mysql.zip"].date}</Typography>
          <Button variant="outlined" href="/data/yyets_mysql.zip">
            下载
          </Button>
        </Grid>

        <Grid item xs={12} md={6} lg={4} className={classes.db}>
          <img src={toAbsoluteUrl("/svg/sqlite.svg")} alt="sqlite" className="icon" />
          <Typography className="hash" noWrap title={db["yyets_sqlite.zip"].checksum}>
            SHA1:&nbsp;
            <Typography component="span" variant="body2">
              {db["yyets_sqlite.zip"].checksum}
            </Typography>
          </Typography>
          <Typography className="date">Update: {db["yyets_mongo.gz"].date}</Typography>
          <Button variant="outlined" href="/data/yyets_mongo.gz">
            下载
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
