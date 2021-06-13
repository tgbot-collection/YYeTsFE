import axios from "./axiosConfig";

export interface GetDatabaseRes {
  "yyets_mongo.gz": {
    checksum: string;
    date: string;
    size: string;
  };
  "yyets_mysql.zip": {
    checksum: string;
    date: string;
    size: string;
  };
  "yyets_sqlite.zip": {
    checksum: string;
    date: string;
    size: string;
  };
}

export function getDatabase() {
  return axios.get<GetDatabaseRes>("/api/db_dump");
}
