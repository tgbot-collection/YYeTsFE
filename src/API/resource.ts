import axios from "axios";

interface SeasonItem {}

export interface Season {
  formats: Array<string>;
  items: Array<SeasonItem>;
  season_cn: string;
  season_num: string;
}

export interface MovieDetail {
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
    info: MovieDetail;
    list: Array<Season>;
  };
  info: string;
  status: number;
}

export function getResourceByID(id: string) {
  return axios.get<GetResourceByIDRes>("/api/resource", { params: { id } });
}
