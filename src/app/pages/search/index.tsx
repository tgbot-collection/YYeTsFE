import * as React from "react";
import * as yup from "yup";
import {
  Button,
  Container,
  createStyles,
  Divider,
  Select,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
  InputAdornment,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { Adsense } from "@ctrl/react-adsense";

import {
  cancelGetTop,
  CommentResult,
  ExtraResult,
  getSearchKw,
  getTop,
  GetTopRes,
  postMetrics,
  ResourceInfo,
} from "API";
import { noop, setTitle } from "utils";
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
    hr: {
      margin: theme.spacing(4, 0),
      [theme.breakpoints.up("sm")]: {
        margin: theme.spacing(6, 0),
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
  const [extraList, setExtraList] = React.useState<Array<ExtraResult>>([]);
  const [commentList, setCommentList] = React.useState<Array<CommentResult>>([]);
  const [select, setSelect] = React.useState<string>("default");

  const searchByKw = (search: string, type: string = "default") => {
    setTitle(`${search} - 搜索结果`);
    getSearchKw(search, type)
      .then((res) => {
        setListLoading(false);

        if (res.data) {
          const { data, extra, comment } = res.data;
          setList(data);
          setExtraList(extra);
          setCommentList(comment);
        }
      })
      .catch((error) => {
        enqueueSnackbar(`搜索出错：${error.message}`, { variant: "error" });
      });

    postMetrics("search").catch(noop);
  };

  const formik = useFormik({
    initialValues: {
      search: (parsedQuery.keyword as string) || "",
    },
    validationSchema,
    onSubmit: (values) => {
      ref.current.blur();

      history.replace({ pathname: "/search", search: `?keyword=${values.search}&type=${select}` });
      gtag("event", "search", { search_term: values.search });
      setMode("list");
      setListLoading(true);

      searchByKw(values.search, select);
    },
  });

  React.useEffect(() => {
    setSelect((parsedQuery.type as string) || "default");
    if (parsedQuery.keyword) {
      setMode("list");
      searchByKw(parsedQuery.keyword as string, parsedQuery.type as string);
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
        });
      postMetrics("top").catch(noop);
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
          placeholder="搜索关键字"
          className={classes.searchInput}
          autoFocus={!parsedQuery.keyword}
          value={formik.values.search}
          onChange={formik.handleChange}
          error={formik.touched.search && Boolean(formik.errors.search)}
          helperText={formik.touched.search && formik.errors.search}
          autoComplete="off"
          InputProps={{
            ref,
            startAdornment: (
              <InputAdornment position="start">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={select}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setSelect(e.target.value as string);
                  }}
                >
                  <MenuItem value="default">默认</MenuItem>
                  <MenuItem value="douban">豆瓣</MenuItem>
                </Select>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" size="small" className={classes.searchButton} type="submit">
          搜索
        </Button>
      </form>

      {mode === "top" ? (
        <>
          <RankComponent data={top.ALL} loading={rankLoading} />

          {process.env.REACT_APP_ADSENSE ? (
            <>
              <Divider className={classes.hr} />
              <Adsense
                className="adsbygoogle"
                client={`ca-pub-${process.env.REACT_APP_ADSENSE}`}
                slot="5356325344"
                style={{ display: "block" }}
                format="auto"
                responsive="true"
              />
              <Divider />
            </>
          ) : null}

          {!!Object.keys(top).length && <SectionComponent data={top} />}
        </>
      ) : (
        <SearchListComponent list={list} extraList={extraList} commentList={commentList} loading={listLoading} />
      )}
    </Container>
  );
}
