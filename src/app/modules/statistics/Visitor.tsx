import * as React from "react";
import { Column, ColumnConfig } from "@ant-design/charts";

import { MetricsInfo } from "API";
import dayjs from "dayjs";

interface LineData {
  date: string;
  category: string;
  value: number;
}

interface ColumnPropTypes {
  data: Array<MetricsInfo>;
  loading: boolean;
}

export function Visitor(props: ColumnPropTypes) {
  const { data, loading = true } = props;

  const [min, setMin] = React.useState<number>(0);

  const formatData = (rawData: Array<MetricsInfo>) => {
    const VISITOR_CHART = ["home", "top", "resource"];
    const labelMap = {
      home: "首页",
      top: "排行榜",
      resource: "资源页",
    };

    const newArr: LineData[] = [];
    let computerMin = 99999;
    rawData.forEach((item) => {
      const { date } = item;
      Object.keys(item).forEach((key) => {
        if (VISITOR_CHART.includes(key)) {
          // @ts-ignore
          const value = item[key];
          if (value < computerMin) {
            computerMin = value;
          }
          // @ts-ignore
          newArr.unshift({ date, category: labelMap[key], value });
        }
      });
    });

    setMin(computerMin);
    return newArr;
  };

  const chartData = React.useMemo(() => formatData(data), [data]);

  const config: ColumnConfig = {
    data: chartData,
    loading,
    isGroup: true,
    xField: "date",
    yField: "value",
    seriesField: "category",
    xAxis: {
      label: {
        formatter: (datum) => dayjs(datum).format("MM-DD"),
      },
    },
    yAxis: { min },
  };

  return <Column {...config} />;
}
