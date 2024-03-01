import { CSSProperties, useState, useEffect, useCallback, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";

import * as THREE from "three";
import Phaser from "phaser";
import MainScene from "./game/main";
import Overlay from "./component/Overlay";
import { render } from "react-dom";

import { AppInfo } from "./state/const";
import { ShioriType, DefaultShiori } from "./state/shiori";

import SettingUtil from "./util/SettingUtil";

const config: Phaser.Types.Core.GameConfig = {
  width: 720,
  height: 1280,
  type: Phaser.AUTO,
  pixelArt: false,
  // backgroundColor: 0xcdcdcd,
  transparent: true,
  preserveDrawingBuffer: true,
  scale: {
    mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    parent: "game",
    fullscreenTarget: "game",
  },

  scene: [MainScene],
};

/**
 * PhaserのGameを生成するためのクラス
 */
class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

const App = () => {
  const rootStyle: CSSProperties = {
    width: "100vw",
    height: "100vh",
  };

  const parentStyle: CSSProperties = {
    position: "relative",
    // width: "100vw",
    // height: "100vh",
  };

  const threeCanvasStyle: CSSProperties = {};

  const createBox = () => {
    const width = 720;
    const height = 1280;

    const renderer: any = new THREE.WebGLRenderer({
      canvas: document.querySelector("#three-canvas") as HTMLCanvasElement,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // renderer.setClearColor(0x000000, 0);
    renderer.setClearColor(0x004200, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, +1000);

    const geometry = new THREE.BoxGeometry(400, 400, 400);
    const material = new THREE.MeshNormalMaterial();
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    const tick = () => {
      box.rotation.y += 0.001;
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    return renderer;
  };

  // state
  const [parentWidth, setParentWidth] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  const [gameStyle, setGameStyle] = useState<CSSProperties>({});

  const rootRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const calcParentSize = useCallback((canvasWidth: number, canvasHeight: number) => {
    let width = 0;
    let height = 0;
    if ((canvasWidth * 16) / 9 > canvasHeight) {
      width = Math.floor((canvasHeight * 9) / 16);
      height = canvasHeight;
    } else {
      width = canvasWidth;
      height = Math.floor((canvasWidth * 16) / 9);
    }

    return [width, height];
  }, []);

  const resize = useCallback((width: number, height: number, threeRenderer: any, game: any) => {
    setParentWidth(width);
    setParentHeight(height);
    parentRef.current.style.width = `${width}px`;
    parentRef.current.style.height = `${height}px`;

    if (threeRenderer) {
      threeRenderer.setSize(width, height);
    }

    // if (game) {
    // game.scale.resize(width, height);
    // game.scale.displaySize.setAspectRatio(width / height);
    // game.scale.refresh();
    // }

    setGameStyle({
      position: "absolute",
      left: 0,
      top: 0,
      width,
      height,
    });
  }, []);

  // mounted
  useEffect(() => {
    SettingUtil.load();

    const threeRenderer = createBox();
    const game = new Game(config);

    const [width, height] = calcParentSize(window.innerWidth, window.innerHeight);
    resize(width, height, threeRenderer, game);

    const resizeObserver = new ResizeObserver((entries) => {
      const rootWidth = entries[0].contentRect.width;
      const rootHeight = entries[0].contentRect.height;

      const [width, height] = calcParentSize(rootWidth, rootHeight);
      resize(width, height, threeRenderer, game);
    });

    if (rootRef.current) {
      resizeObserver.observe(rootRef.current);
    }

    return () => {
      game?.destroy(true);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div style={rootStyle} ref={rootRef}>
      <div id="parent" style={parentStyle} ref={parentRef}>
        <canvas id="three-canvas" style={threeCanvasStyle} />
        <div id="game" className="App" style={gameStyle} />
        <Overlay width={parentWidth} height={parentHeight} />
      </div>
    </div>
  );
};

export default App;
