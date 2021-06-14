import * as React from "react";
import * as yup from "yup";
import { Button, Container, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

import { cancelGetTop, getSearchKw, getTop, GetTopRes, postMetrics, ResourceInfo } from "API";
import { setTitle } from "utils";
import { SectionComponent } from "./Section";
import { SearchListComponent } from "./SearchList";
import { RankComponent } from "./Rank";

const validationSchema = yup.object({
  search: yup.string().required("请输入电影名"),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
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
      alignSelf: "flex-start",
      marginLeft: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(4),
      },
    },
  })
);

export function SearchPage() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const parsedQuery = queryString.parse(useLocation().search);

  /* 显示模式，热门还是搜索列表 */
  const [mode, setMode] = React.useState<"top" | "list">("top");
  const ref = React.useRef<HTMLInputElement>(null!);

  const [rankLoading, setRankLoading] = React.useState<boolean>(true);
  const [top, setTop] = React.useState<GetTopRes>({} as GetTopRes);

  const [listLoading, setListLoading] = React.useState<boolean>(true);
  const [list, setList] = React.useState<Array<ResourceInfo>>([]);

  const searchByKw = (search: string) => {
    setTitle(`${search} - 搜索结果`);
    getSearchKw(search)
      .then((res) => {
        setListLoading(false);

        setList(res.data.data.map((item) => item.data.info));
      })
      .catch((error) => {
        enqueueSnackbar(`搜索出错：${error.message}`, { variant: "error" });
      })
      .finally(() => {
        postMetrics("search").catch();
      });
  };

  const formik = useFormik({
    initialValues: {
      search: (parsedQuery.keyword as string) || "",
    },
    validationSchema,
    onSubmit: (values) => {
      ref.current.blur();

      history.replace({ pathname: "/search", search: `?keyword=${values.search}` });
      gtag("event", "search", { search_term: values.search });

      setTimeout(() => {
        setMode("list");
        setListLoading(true);
      }, 100);

      searchByKw(values.search);
    },
  });

  React.useEffect(() => {
    if (parsedQuery.keyword) {
      setMode("list");

      searchByKw(parsedQuery.keyword as string);
    } else {
      setTitle("搜索资源");
      getTop()
        .then((res) => {
          if (res) {
            setTop(res.data);

            setRankLoading(false);
          }
        })
        .catch((error) => {
          enqueueSnackbar(error.message, { variant: "error" });
        })
        .finally(() => {
          postMetrics("top").catch();
        });
    }

    return cancelGetTop;
    // eslint-disable-next-line
  }, [enqueueSnackbar]);

  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="lg">
      <form className={classes.searchBar} onSubmit={formik.handleSubmit}>
        <TextField
          name="search"
          placeholder="搜索片名"
          className={classes.searchInput}
          autoFocus={!parsedQuery.keyword}
          value={formik.values.search}
          onChange={formik.handleChange}
          error={formik.touched.search && Boolean(formik.errors.search)}
          helperText={formik.touched.search && formik.errors.search}
          autoComplete="off"
          inputProps={{ ref }}
        />
        <Button variant="contained" color="primary" size="small" className={classes.searchButton} type="submit">
          搜索
        </Button>
      </form>

      {mode === "top" ? (
        <>
          <RankComponent data={top.ALL} loading={rankLoading} />
          {!!Object.keys(top).length && <SectionComponent data={top} />}
        </>
      ) : (
        <SearchListComponent list={list} loading={listLoading} />
      )}
    </Container>
  );
}
