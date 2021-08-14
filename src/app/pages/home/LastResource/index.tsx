import * as React from "react";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { getLastResource, LastResourceInfo } from "API";
import { formatDate } from "utils";
import { Skeleton } from "@material-ui/lab";

export function LastResource() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [lastResource, setLastResource] = React.useState<Array<LastResourceInfo>>([]);

  const history = useHistory();

  React.useEffect(() => {
    getLastResource()
      .then((res) => {
        setLoading(false);
        setLastResource(res.data.data);
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <section>
        <Typography variant="h5" component="h2">
          最近更新
        </Typography>

        <div style={{ padding: "8px 16px" }}>
          {Array.from(new Array(5)).map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} style={{ margin: "16px 0" }}>
              <Skeleton variant="rect" height={24} width={150} />
              <Skeleton variant="rect" height={20} style={{ margin: "4px 0" }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <Typography variant="h5" component="h2">
        最近更新
      </Typography>

      <List>
        {lastResource.map((item) => (
          <ListItem
            key={item.name}
            dense
            button
            onClick={() => history.push(`/resource?id=${item.resource_id}`, { title: item.res_name })}
          >
            <ListItemText
              primary={
                <Typography noWrap>
                  {item.res_name}
                  <Typography component="span" color="textSecondary">
                    &nbsp;{formatDate(item.date)}
                  </Typography>
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="textSecondary" noWrap>
                  {item.name}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </section>
  );
}
