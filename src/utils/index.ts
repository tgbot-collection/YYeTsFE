import { useSelector } from "react-redux";

export * from "./assetsHelper";
export * from "./randomString";
export * from "./logout";
export * from "./setTitle";
export * from "./formatData";
export * from "./noop";
export * from "./imageCrop";

export function ShowAdsense(): boolean {
  const data = useSelector((state: any) => state.adsenseState.data);
  return !data?.includes(window.location.href);
}
