import * as React from "react";
import clsx from "clsx";
import { Avatar as MuiAvatar, SvgIcon } from "@material-ui/core";

import { formatAvatar } from "utils";
import { useStyles } from "./styled";

interface AvatarPropTypes {
  username: string;
  admin: boolean;
  className?: string;
}

export function Avatar(props: AvatarPropTypes) {
  const { admin, username, className } = props;

  const classes = useStyles();

  return (
    <div className={clsx(classes.wrap, className)}>
      <MuiAvatar className={clsx(classes.avatar, { [classes.purple]: admin })} src={formatAvatar(username)} >{formatAvatar(username)}</MuiAvatar>
      {admin && (
        <SvgIcon className={classes.circle} viewBox="0 0 1024 1024" titleAccess="管理员">
          ad
          <path
            d="M515.040168 509.675166m-487.499826 0a487.499825 487.499825 0 1 0 974.999651 0 487.499825 487.499825 0 1 0-974.999651 0Z"
            fill="#fecc11"
          />
          <path
            d="M328.695774 497.693329l169.176388 33.799511-140.205379 314.210269L701.563395 472.835487l-194.749563-31.832343 93.35103-267.355921z"
            fill="#FFFFFF"
          />
        </SvgIcon>
      )}
    </div>
  );
}
