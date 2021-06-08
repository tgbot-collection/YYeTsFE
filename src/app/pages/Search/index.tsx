import * as React from "react";
import { Button, Container, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";

import { Rank } from "./Rank";
import { cancelGetTop, getTop, GetTopRes } from "API";
import { Section } from "./Section";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(6),
      },
    },
    searchBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    searchInput: {
      flex: 1,
    },
    searchButton: {
      marginLeft: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(4),
      },
    },
  })
);

export function SearchPage() {
  const [top, setTop] = React.useState<GetTopRes>({} as GetTopRes);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getTop().then(({ data }) => {
      setTop(data);
      setLoading(false);
    });

    return cancelGetTop;
  }, []);

  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="md">
      <div className={classes.searchBar}>
        <TextField placeholder="电影标题" className={classes.searchInput} />
        <Button variant="contained" color="primary" size="small" className={classes.searchButton}>
          搜索
        </Button>
      </div>

      <Rank data={top.ALL} loading={loading} />
      {!!Object.keys(top).length && <Section data={top} loading={loading} />}
    </Container>
  );
}
