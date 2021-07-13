import * as React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

export function MagnetIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 1024 1024" style={{ transform: "scale(0.8)" }}>
      <path d="M238.933 284.459v273.066a273.067 273.067 0 0 0 545.963 10.24l0.17-10.24V284.46h182.06v273.066c0 251.307-203.777 455.083-455.126 455.083S56.875 808.875 56.875 557.525V284.46h182.058zM967.125 11.392v182.016H785.024l0.043-182.016h182.058z m-910.25 0h182.058v182.016H56.832V11.392z" />{" "}
    </SvgIcon>
  );
}
