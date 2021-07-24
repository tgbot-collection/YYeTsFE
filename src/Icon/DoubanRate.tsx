import * as React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

interface DoubanRatePropTypes extends SvgIconProps {
  rate: number;
}

export function DoubanRateIcon(props: DoubanRatePropTypes) {
  const { rate } = props;

  const getRingPercent = (percent: number, r: number) => {
    const perimeter = Math.PI * 2 * r; // 周长
    return `${(percent / 10) * perimeter} ${perimeter}`;
  };

  return (
    <SvgIcon viewBox="0 0 180 180" fontSize="large" {...props}>
      <defs>
        <linearGradient id="svg_1" x1="0%" y1="0%" x2="100%" y2="64.9%">
          <stop offset="0%" stopColor="#f8cb9c" />
          <stop offset="50%" stopColor="#ef9383" />
          <stop offset="100%" stopColor="#ea7575" />
        </linearGradient>
      </defs>
      <circle cx="90" cy="90" r="80" strokeWidth="12" stroke="#ffffff" fill="none" />
      <circle
        cx="90"
        cy="90"
        r="80"
        strokeWidth="12"
        stroke="url(#svg_1)"
        fill="none"
        strokeLinecap="round"
        transform="matrix(0,-1,1,0,0,180)"
        strokeDasharray={getRingPercent(rate || 100, 80)}
      />
      <text x="90" y="90" fill="red" textAnchor="middle" dominantBaseline="middle" fontSize={48} fontWeight="bold">
        {rate === 0 ? "无" : rate}
      </text>
    </SvgIcon>
  );
}
