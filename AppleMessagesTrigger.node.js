import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";

export class AppleMessagesTrigger {
  description = {
    displayName: "Apple Messages Trigger",
    name: "appleMessagesTrigger",
    group: ["trigger"],
    version: 1,
    icon: "file:logo.png",
    description: "Emits new Apple messages",
    defaults: {
      name: "Apple Messages Trigger",
    },
    inputs: [],
    outputs: ["main"],
    credentials: [],
    properties: [
      {
        displayName: "Activation Key",
        name: "activationKey",
        type: "string",
        default: "",
        placeholder: "XXXX-XXXX-XXXX",
        description: "Activation key",
        required: true,
      },
      {
        displayName: "Poll Interval (seconds)",
        name: "pollInterval",
        type: "number",
        default: 5,
        description: "Poll interval used by the helper (seconds).",
      },
      {
        displayName: "Only Incoming",
        name: "onlyIncoming",
        type: "boolean",
        default: true,
        description:
          "Only emit incoming messages. Disable if you want to recieve from self.",
      },
      {
        displayName: "Only SMS",
        name: "onlySms",
        type: "boolean",
        default: false,
        description: "Only emit SMS (filter out iMessage).",
      },
    ],
  };

  async trigger() {
    const helperPath = new URL("./helpers/sms_forwarder_mac", import.meta.url).pathname;
    const activationKey = (this.getNodeParameter("activationKey", "")).trim();
    const pollInterval = this.getNodeParameter("pollInterval", 5);
    const onlyIncoming = this.getNodeParameter("onlyIncoming", true);
    const onlySms = this.getNodeParameter("onlySms", false);
    const self = this;
    if (!fs.existsSync(helperPath)) {
      throw new Error(`Helper binary not found at path: ${helperPath}`);
    }

    const args = [];

    if (activationKey !== "") {
      args.push("--activation-key", activationKey);
    }

    if (pollInterval && Number.isFinite(pollInterval)) {
      args.push("--poll-interval", String(pollInterval));
    }

    if (onlyIncoming) {
      args.push("--only-incoming");
    }
    if (onlySms) {
      args.push("--only-sms");
    }

    const proc = spawn(helperPath, args, { stdio: ["ignore", "pipe", "pipe"] });

		console.log(helperPath, args);
    proc.stdout.on("data", (data) => {
      const lines = data.toString().trim().split("\n");
			console.log(lines);
      for (const line of lines) {
        try {
          const msg = JSON.parse(line);
          self.emit([self.helpers.returnJsonArray([msg])]);
        } catch (err) {
          this.logger.error("Failed to parse helper output: " + err);
        }
      }
    });

    proc.stderr.on("data", (data) => {
      this.logger.error("Helper error: " + data.toString());
    });

    async function closeFunction() {
      proc.kill();
    }

    return {
      closeFunction,
    };
  }
}
