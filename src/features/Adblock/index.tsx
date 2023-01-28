import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useDetectAdBlock } from "adblock-detect-react";

export function Adblock() {
  const adBlockDetected = useDetectAdBlock();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `adblock=1; path=/; expires=${expires};`;
    setOpen(false);
  };

  const displayWarning = adBlockDetected && !document.cookie.includes("adblock=1") && process.env.REACT_APP_ADSENSE;

  React.useEffect(() => {
    if (displayWarning) {
      setOpen(true);
    }
  }, [displayWarning]);

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">检测到广告屏蔽器</DialogTitle>
        <DialogContent>
          <DialogContentText>为了支持本站的长期运营，请将我们的网站加入广告屏蔽器的白名单。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            我知道了
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
