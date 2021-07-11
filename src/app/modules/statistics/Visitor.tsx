import * as React from "react";
import { Column } from "@ant-design/charts";
import { ColumnConfig } from "@ant-design/charts/es/column";

import { MetricsInfo } from "API";

interface LineData {
  date: string;
  category: string;
  value: number;
}

interface ColumnPropTypes {
  data: Array<MetricsInfo>;
  loading: boolean;
  theme: "light" | "dark";
}

export function Visitor(props: ColumnPropTypes) {
  const { data, loading = true, theme } = props;

  const VISITOR_CHART = ["home", "top", "resource"];
  const labelMap = {
    home: "首页",
    top: "排行榜",
    resource: "资源详情",
  };

  const formatData = (rawData: Array<MetricsInfo>) => {
    const newArr: LineData[] = [];
    rawData.forEach((item) => {
      const { date } = item;
      Object.keys(item).forEach((key) => {
        if (VISITOR_CHART.includes(key)) {
          // @ts-ignore
          newArr.push({ date, category: labelMap[key], value: item[key] });
        }
      });
    });

    return newArr;
  };

  const config: ColumnConfig = {
    data: formatData(data),
    theme,
    loading,
    isGroup: true,
    xField: "date",
    yField: "value",
    seriesField: "category",
    color: ["#1979C9", "#D62A0D", "#FAA219"],
  };
  return <Column {...config} />;
}
