import axios from "axios";

interface ResourceLink {
  address: string;
  passwd: string;
  way: string;
  way_cn: string;
}

interface ResourceDetail {
  dateline: string;
  episode: string;
  files: Array<ResourceLink>;
  itemid: string;
  name: string;
  yyets_trans: number;
}

interface SeasonItem {
  [key: string]: Array<ResourceDetail>;
}

export interface Season {
  formats: Array<string>;
  items: Array<SeasonItem>;
  season_cn: string;
  season_num: string;
}

export interface ResourceInfo {
  id: number;
  views: number;
  cnname: string;
  enname: string;
  aliasname: string;
  area: string;
  channel: string;
  channel_cn: string;
  year: Array<number>;
}

export interface GetResourceByIDRes {
  data: {
    info: ResourceInfo;
    list: Array<Season>;
  };
  info: string;
  status: number;
  is_like: boolean;
}

export function getResourceByID(id: string) {
  return axios.get<GetResourceByIDRes>("/api/resource", { params: { id } });
}
