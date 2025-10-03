# n8n nodes for Apple Messages

Bring your iPhone SMS & iMessage into n8n, locally on your Mac.
It lets you capture every incoming message on Apple Messages (iMessage / RCS / SMS) and automate it with n8n.

This project is not affiliated with Apple. “macOS”, “iMessage” and “iPhone” are trademarks of Apple Inc.

> This package only works for n8n instances self-hosted on bare-metal macOS.
 
## How to install

1. In your n8n dashboard, go to Settings → Community Nodes and install `n8n-nodes-apple-messages`.

2. Get an activation key from [here](https://littledivy.gumroad.com/l/imessage-n8n-node) at any price you wish. It will look like this: `XXXX-YYYY-ZZZZ`.

3. Enable Message Forwarding on your iPhone. See https://support.apple.com/en-in/102545

3. Grant Full Disk Access (macOS) to `n8n`. This is required to collected forwarded messages from the file system.

    System Settings → Privacy & Security → Full Disk Access → add: `n8n` or `node`

## Usage

Just enter your activation key you got from Step 2 and it's all setup!

<img width="787" height="325" alt="image" src="https://github.com/user-attachments/assets/8f43fac0-18d8-41a2-880e-d861a132ad38" />

## FAQs

**Q: I see no events after sending a message.**

Try these things:

- Ensure Full Disk Access is granted (See installation instructions).
- Ensure Message Forwarding is enabled on your iPhone (See installation instructions).
- Confirm SMS/iMessage reaches the Mac (green/blue bubble appears in Messages).
- Disable Only SMS if you’re testing with iMessage (blue bubble).
- Delete `~/.sms_forwarder_lastrow` and try again.

--

**Q: I still can't get this to work. Do you offer support?**

Yes, reach me via email at me@littledivy.com.

--

**Q: Will this work if I am outside?**

Yes, this should work as long as your n8n instance is running. It does not require iPhone and Mac to be on the same network.

--

**Q: Can I use this on cloud n8n?**

No. This only works on n8n instances hosted on macOS connected to same iCloud as your iPhone. You can setup a relay that forwards events from your Mac to a remote instance.
