import Cropper from "react-easy-crop";
import { PhotoCamera, Save, CropRotate } from "@material-ui/icons";
import { getCroppedImg } from "utils";
import { Button, makeStyles, Modal, Theme, Typography, createStyles, Avatar } from "@material-ui/core";
import { useSnackbar } from "notistack";
import Compressor from "compressorjs";

import * as React from "react";
import { uploadAvatar } from "../../../API";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    uploadButton: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(7),
    },
    largeAvatar: {
      width: theme.spacing(30),
      height: theme.spacing(30),
    },
    paper: {
      position: "absolute",
      width: 800,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      top: theme.spacing(5),
      left: 0,
      right: 0,
      bottom: theme.spacing(5),
      margin: "auto",
    },
    cropper: {
      position: "relative",
      width: "100%",
      height: "61.8%",
    },
  })
);

export function AvatarUploader(props: any) {
  const { enqueueSnackbar } = useSnackbar();
  const { avatar } = props;

  const classes = useStyles();
  const [oldAvatar, setOldAvatar] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState("");
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [cropped, setCropped] = React.useState(new Blob());
  const [rotation, setRotation] = React.useState(0);
  const onCropComplete = (croppedAreaPercentage: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
    const canvasElement = getCroppedImg(selectedFile, croppedAreaPixels);
    canvasElement.toBlob((blob) => {
      // @ts-ignore
      setCropped(blob);
    });
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  React.useEffect(() => {
    setOldAvatar(avatar);
  }, [avatar]);

  function doUpload(result: Blob) {
    const formData = new FormData();
    const reader = new FileReader();
    formData.append("image", result);
    uploadAvatar(formData)
      .then((r) => {
        reader.readAsDataURL(result);
        reader.onload = () => {
          setSelectedFile(reader.result as string);
          setOldAvatar(reader.result as string);
        };
        enqueueSnackbar(r.data.message, { variant: "success" });
      })
      .catch((error) => {
        enqueueSnackbar(error.response, { variant: "error" });
      })
      .then(() => {
        setModalOpen(false);
      });
  }

  function uploadCropImage() {
    /* eslint-disable no-new */
    new Compressor(cropped, {
      width: 400,
      height: 400,
      quality: 0.6,
      success(result) {
        doUpload(result);
      },
      error(err) {
        enqueueSnackbar(err.message, { variant: "error" });
      },
    });
  }

  function openCropWindow(event: any) {
    const file = event.target.files[0];

    if (file.size > 1024 * 1024 * 10) {
      enqueueSnackbar("图片大小不能超过10M", { variant: "error" });
      return;
    }
    if (file.type === "image/gif") {
      doUpload(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedFile(reader.result as string);
      setModalOpen(true);
    };
  }

  return (
    <>
      <Typography>修改头像，支持jpg、png、gif等格式，大小不超过10M</Typography>
      <Avatar src={oldAvatar} className={classes.largeAvatar} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <h2 id="simple-modal-title" className={classes.uploadButton}>
            裁剪头像
          </h2>
          <div id="simple-modal-description" className={classes.cropper}>
            <Cropper
              image={selectedFile}
              crop={crop}
              rotation={rotation}
              onRotationChange={setRotation}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <Button
            className={classes.uploadButton}
            variant="contained"
            color="primary"
            onClick={() => uploadCropImage()}
            startIcon={<Save />}
          >
            确定
          </Button>
          <Button
            className={classes.uploadButton}
            variant="contained"
            color="secondary"
            onClick={() => setRotation(rotation + 90)}
            startIcon={<CropRotate />}
          >
            旋转
          </Button>
        </div>
      </Modal>
      <div className={classes.uploadButton}>
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<PhotoCamera />}
            onChange={(event) => {
              openCropWindow(event);
            }}
          >
            上传头像
            <input accept="image/*" id="contained-button-file" type="file" hidden />
          </Button>
        </label>
      </div>
    </>
  );
}
