import * as React from "react";
import {
  AppBar,
  Button,
  createStyles,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  IconButton,
  Toolbar,
  Typography,
  Link as MuLink,
  Divider,
} from "@material-ui/core";
import { AccountCircle, GitHub, Search } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";

import { logout, toAbsoluteUrl } from "utils";
import { UserContext } from "./UserContext";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    href: {
      marginRight: theme.spacing(2),
    },
    logo: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      borderRadius: "50%",
    },
    nowrap: {
      display: "inline-block",
      textTransform: "none",
      width: "100%",
      maxWidth: 200,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    danger: {
      color: theme.palette.error.main,
    },
  })
);

export function Header() {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const loginPopupState = usePopupState({ variant: "popover", popupId: "loginMenu" });
  const githubPopupState = usePopupState({ variant: "popover", popupId: "githubMenu" });

  const { name: username, setName } = React.useContext(UserContext);

  const classes = useStyles();

  const handleLogout = () => {
    setName("");
    loginPopupState.close();

    logout();
    enqueueSnackbar("退出成功", { variant: "warning" });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/home" className={classes.href}>
          <img src={toAbsoluteUrl("/logo.png")} className={classes.logo} alt="logo" />
        </Link>

        <Typography variant="h6" className={classes.title}>
          YYeTs
        </Typography>

        {location.pathname !== "/search" && (
          <IconButton color="inherit" component={Link} to="/search">
            <Search />
          </IconButton>
        )}

        <IconButton color="inherit" {...bindTrigger(githubPopupState)}>
          <GitHub fontSize="small" />
        </IconButton>
        <Menu
          {...bindMenu(githubPopupState)}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={githubPopupState.close}>
            <MuLink href="https://github.com/tgbot-collection/YYeTsBot" color="inherit">
              YYeTsBot
            </MuLink>
          </MenuItem>
          <MenuItem onClick={githubPopupState.close}>
            <MuLink href="https://github.com/wyx1818/YYeTsFE" color="inherit">
              YYeTsFE
            </MuLink>
          </MenuItem>
        </Menu>

        {username ? (
          <>
            <IconButton color="inherit" {...bindTrigger(loginPopupState)}>
              <AccountCircle />
            </IconButton>
            <Menu
              {...bindMenu(loginPopupState)}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem className={classes.nowrap} disabled>
                {username}
              </MenuItem>
              <MenuItem onClick={loginPopupState.close}>
                <Link to="/me" style={{ color: "inherit", textDecoration: "none" }}>
                  个人中心
                </Link>
              </MenuItem>
              <Divider />

              <MenuItem onClick={handleLogout} className={classes.danger}>
                退出
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
