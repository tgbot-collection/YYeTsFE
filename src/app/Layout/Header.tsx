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
} from "@material-ui/core";
import { GitHub, Search } from "@material-ui/icons";
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
    noUp: {
      textTransform: "none",
    },
  })
);

export function Header() {
  const location = useLocation();
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const { enqueueSnackbar } = useSnackbar();

  const { name: username, setName } = React.useContext(UserContext);

  const classes = useStyles();

  const handleLogout = () => {
    setName("");
    popupState.close();

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
        <IconButton color="inherit" component="a" href="https://github.com/tgbot-collection/YYeTsBot">
          <GitHub />
        </IconButton>
        {username ? (
          <>
            <Button color="inherit" className={classes.noUp} {...bindTrigger(popupState)}>
              {username}
            </Button>
            <Menu
              {...bindMenu(popupState)}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={popupState.close}>
                <Link to="/me" style={{ color: "inherit", textDecoration: "none" }}>
                  个人中心
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>退出</MenuItem>
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
