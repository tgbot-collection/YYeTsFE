import * as React from "react";
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";

import { GetTopRes, MovieInfo, MovieList } from "API";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
      [theme.breakpoints.up("md")]: {
        marginTop: theme.spacing(6),
      },
    },
    section: {
      display: "flex",
      alignItems: "center",
    },
    title: {
      margin: theme.spacing(1, 0),
    },
    rankNum: {
      width: "24px",
      textAlign: "center",
      marginRight: theme.spacing(1),
      fontWeight: "bold",
    },
    rankItem: {
      display: "flex",
      textDecoration: "none",
      margin: theme.spacing(0.5, 0),
    },
  })
);

interface SectionPropTypes {
  data: GetTopRes;
  loading: boolean;
}

export function Section(props: SectionPropTypes) {
  const { data } = props;

  const [section, setSection] = React.useState<Array<MovieList>>(data.US || []);
  const [sectionName, setSectionName] = React.useState<string>("美国");

  const mobile = useMediaQuery("(max-width: 600px)");
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const formatData: (data: Array<MovieList>) => Array<MovieInfo> = (data) => {
    if (mobile) return data.map((item) => item.data.info).slice(0, 10);

    return data.map((item) => item.data.info);
  };

  const formatSection = (data: { [key: string]: string }) => {
    return Object.keys(data)
      .map((key) => ({
        key,
        name: data[key],
      }))
      .filter((item) => !(item.key === "ALL" || item.key === "LIKE"));
  };

  const handleClickSection = (key: string, name: string) => {
    // @ts-ignore
    setSection(data[key]);
    setSectionName(name);

    popupState.close();
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <Typography component="h2" variant="h6" className={classes.title}>
          地区榜
        </Typography>

        <div>
          <Button size="large" color="primary" {...bindTrigger(popupState)}>
            {sectionName}
            <ExpandMoreIcon />
          </Button>
          <Menu {...bindMenu(popupState)}>
            {formatSection(data.class).map((item) => (
              <MenuItem onClick={() => handleClickSection(item.key, item.name)} key={item.key}>
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>

      <Grid container>
        {formatData(section).map((movieItem: MovieInfo, index) => (
          <Grid item xs={6} sm={4} key={movieItem.id}>
            <div className={classes.rankItem}>
              <Typography className={classes.rankNum}>{index + 1}</Typography>
              <Typography
                noWrap
                component={Link}
                to={{
                  pathname: "/resource",
                  search: `?id=${movieItem.id}`,
                }}
                color="inherit"
                style={{ textDecoration: "none" }}
              >
                {movieItem.cnname}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
