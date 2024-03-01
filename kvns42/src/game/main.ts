import "phaser";

import SettingUtil from "../util/SettingUtil";
import ScenarioUtil from "../util/ScenarioUtil";

/**
 * メインシーン
 */
class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "Main",
    });
  }

  tick = 0;
  currentSeqIndex = 0;
  currentPos = 0;
  textSpeed = SettingUtil.setting.text_speed;
  whoText: Phaser.GameObjects.Text | null = null;
  messageText: Phaser.GameObjects.Text | null = null;

  init() {
    console.log("init");
  }

  preload() {
    console.log("preload");
    ScenarioUtil.load();
    this.load.image("message", "../../asset/image/system/window_1.png");
  }

  create() {
    console.log("create");
    // this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");
    this.add.image(360, 640, "message");

    const whoStyle = { font: "32px BIZUDGothic", fill: "#ffffff", align: "center" };
    this.whoText = this.add.text(325, 10, "カコ", whoStyle);
    this.whoText.setTint(0xf05080);

    const messageStyle = { font: "42px BIZUDMincho", fill: "#ffffff", align: "center" };
    this.messageText = this.add.text(80, 120, "", messageStyle);
  }

  update() {
    // TODO: playerにする
    if (this.currentSeqIndex < ScenarioUtil.scenario.seqs.length) {
      const currentSeq = ScenarioUtil.scenario.seqs[this.currentSeqIndex];
      switch (currentSeq.type) {
        case "show_serif":
        case "show_narrative":
          if (this.messageText) {
            if (this.tick % this.textSpeed === 0) {
              const subMessage = currentSeq.text.slice(0, this.currentPos);
              this.messageText.text = subMessage;
              this.currentPos++;
            }
          }

          if (this.currentPos > currentSeq.text.length) {
            this.currentPos = 0;
            // TODO: クリックで進ませる
            this.currentSeqIndex++;
          }
          break;
        default:
          this.currentSeqIndex++;
      }
    }

    this.tick++;
  }
}

export default MainScene;
