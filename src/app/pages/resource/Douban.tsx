import * as React from "react";
import { Button, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

import { DoubanInfo, getDoubanByID } from "API";
import { DoubanRateIcon } from "Icon";
import { useDomeSize } from "hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
    },
    container: {
      display: "flex",
    },
    post: {
      borderRadius: 4,
      boxShadow: theme.shadows[4],
      width: "30vw",
      maxWidth: 170,
      marginRight: 12,
    },
    info: {
      flex: 1,
      overflow: "hidden",
    },
    introduction: {
      position: "relative",
      transition: theme.transitions.create("max-height", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflow: "hidden",
      marginBottom: 16,
    },
    button: {
      position: "absolute",
      top: 39,
      right: 2,
      backgroundColor: theme.palette.background.default,
    },
  })
);

interface DoubanPropTypes {
  id: string;
}

export function DoubanComponent(props: DoubanPropTypes) {
  const { id } = props;
  const MAX_HEIGHT = 60;

  const [doubanInfo, setDoubanInfo] = React.useState<DoubanInfo>({} as DoubanInfo);
  const [showMore, setShowMore] = React.useState<boolean>(false);

  const [rect, ref] = useDomeSize();

  React.useEffect(() => {
    getDoubanByID(id).then((res) => {
      setDoubanInfo(res.data);
    });
  }, [id]);

  const handleClick = () => {
    setShowMore((pre) => !pre);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div>
          <img src={`/api/douban?resource_id=${id}&type=image`} alt={doubanInfo.name} className={classes.post} />
        </div>

        <div className={classes.info}>
          <Typography variant="body2" noWrap style={{ marginBottom: 16 }}>
            {doubanInfo.genre?.join("、")} | {doubanInfo.year}
          </Typography>

          <div className={classes.introduction} style={{ maxHeight: showMore ? `${rect.height}px` : MAX_HEIGHT }}>
            <Typography variant="body2" ref={ref} style={{ wordBreak: "break-all" }} component="div">
              <DoubanRateIcon rate={Number(doubanInfo.rating) || 0} style={{ float: "left", marginRight: 8 }} />
              {doubanInfo.introduction}
              {rect.height > MAX_HEIGHT && (
                <div
                  className={classes.button}
                  style={{ display: showMore ? "inline-block" : "block", position: showMore ? "static" : "absolute" }}
                >
                  <Button
                    onClick={handleClick}
                    color="primary"
                    style={{ padding: "0 4px", minWidth: "auto", lineHeight: "1.43", fontWeight: "bold" }}
                    disableRipple
                  >
                    {showMore ? "收起" : "展开"}
                  </Button>
                </div>
              )}
            </Typography>
          </div>

          {/* 其他信息 */}
          {doubanInfo.directors?.length > 0 && (
            <Typography variant="body2" noWrap>
              <Typography component="span" style={{ fontWeight: "bold" }} variant="body2">
                导演:&nbsp;
              </Typography>
              {doubanInfo.directors.join("、")}
            </Typography>
          )}

          {doubanInfo.writers?.length > 0 && (
            <Typography variant="body2" noWrap>
              <Typography component="span" style={{ fontWeight: "bold" }} variant="body2">
                编剧:&nbsp;
              </Typography>
              {doubanInfo.writers?.join("、")}
            </Typography>
          )}

          {doubanInfo.actors?.length > 0 && (
            <Typography variant="body2" noWrap>
              <Typography component="span" style={{ fontWeight: "bold" }} variant="body2">
                演员:&nbsp;
              </Typography>
              {doubanInfo.actors.join("、")}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
