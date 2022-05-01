import { CSSProperties, useState, useEffect, useCallback } from "react";

import html2canvas from "html2canvas";

type Props = {
  width: number;
  height: number;
};

const Overlay = (props: Props) => {
  const { width, height } = props;

  // state
  const [style, setStyle] = useState<CSSProperties>({});
  const [fullScreenStyle, setFullScreenStyle] = useState<CSSProperties>({});
  const [backStyle, setBackStyle] = useState<CSSProperties>({});
  const [shootStyle, setShootStyle] = useState<CSSProperties>({});

  // mounted
  useEffect(() => {}, []);

  useEffect(() => {
    setStyle({
      position: "absolute",
      left: 0,
      top: 0,
      color: "blue",
      fontSize: "100px",
      width,
      height,
    });

    const zoomRatio = width / 720;

    setBackStyle({
      position: "absolute",
      left: 0,
      top: 0,
      width: `${80 * zoomRatio}px`,
    });

    setFullScreenStyle({
      position: "absolute",
      left: `${640 * zoomRatio}px`,
      top: 0,
      width: `${80 * zoomRatio}px`,
    });

    setShootStyle({
      position: "absolute",
      left: `${295 * zoomRatio}px`,
      top: `${1200 * zoomRatio}px`,
      width: `${130 * zoomRatio}px`,
    });
  }, [width, height]);

  const isFullScreen = () => {
    let fullScreen = false;
    if (
      document.fullscreenElement ||
      document.mozFullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      fullScreen = true;
    }

    return fullScreen;
  };

  const backClicked = useCallback(() => {}, []);

  const fullScreenClicked = useCallback(() => {
    if (isFullScreen()) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
      } else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen();
      } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();
      }
    }
  }, []);

  const shootClicked = useCallback(() => {
    const parent = document.querySelector("#parent") as HTMLElement;
    if (parent) {
      html2canvas(parent).then((canvas) => {
        const downloadEle = document.createElement("a");
        downloadEle.href = canvas.toDataURL("image/png");
        downloadEle.download = "screenshot_.png";
        downloadEle.click();
      });
    }
  }, []);

  return (
    <div style={style}>
      <img src="../../asset/image/system/back.png" style={backStyle} onClick={backClicked} />
      <img src="../../asset/image/system/full_screen.png" style={fullScreenStyle} onClick={fullScreenClicked} />
      <img src="../../asset/image/system/shoot.png" style={shootStyle} onClick={shootClicked} />
    </div>
  );
};

export default Overlay;
