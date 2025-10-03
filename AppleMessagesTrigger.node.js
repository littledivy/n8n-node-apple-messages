import { spawn } from 'child_process';
import * as path from 'path';

export class AppleMessagesTrigger {
  description = {
    displayName: 'Apple Messages Trigger',
    name: 'appleMessagesTrigger',
    group: ['trigger'],
    version: 1,
    description: 'Emits new Apple SMS messages',
    defaults: {
      name: 'Apple Messages Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [],
    properties: [
      {
        displayName: 'Helper Path',
        name: 'helperPath',
        type: 'string',
        default: '',
        placeholder: new URL('./helper/sms_forwarder_mac', import.meta.url),
        description: 'Path to the helper binary',
        required: true,
      },
    ],
  };

  async trigger() {
    const helperPath = this.getNodeParameter('helperPath', '');
    const self = this;

    const proc = spawn(helperPath, [], { stdio: ['ignore', 'pipe', 'pipe'] });

    proc.stdout.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      for (const line of lines) {
        try {
          const msg = JSON.parse(line);
          self.emit([self.helpers.returnJsonArray([msg])]);
        } catch (err) {
          this.logger.error('Failed to parse helper output: ' + err);
        }
      }
    });

    proc.stderr.on('data', (data) => {
      this.logger.error('Helper error: ' + data.toString());
    });

    async function closeFunction() {
      proc.kill();
    }

    return {
      closeFunction,
    };
  }
}
