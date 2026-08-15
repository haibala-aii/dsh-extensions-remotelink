# @haibala-aii/dsh-extensions-remotelink

English | [中文](README.zh.md)

Haibala mobile remote control for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) web GUI: the desktop mints a one-time QR, the phone pairs and lands on a standalone `/m` surface.

This is a fork of [`@linxin666/dsh-remote-web-ui`](https://github.com/zhu1090093659/dsh-web-ui) (BSD-3-Clause). See [NOTICE](NOTICE).

## Install

```sh
dsh plugin --profile web add github:haibala-aii/dsh-extensions-remotelink
```

Restart `dsh web` after the add succeeds. This repository ships prebuilt `lib/`.

## Use

1. Open the desktop GUI at `http://127.0.0.1:<port>` (the pairing panel is loopback-only).
2. Settings → Remote: turn the plugin on and save.
3. Scan the QR (or open the copied link) on the phone. The phone binds and opens `/m`.
4. **Stop** revokes every paired device. **Refresh** invalidates the current QR.

The sidebar chip **正在远程操控** appears only while at least one paired phone is online.

## Task-complete alerts

When an agent goes idle after running, the desktop GUI and an open phone `/m` page play a short chime and show a system notification (after the browser grants permission). Settings → Remote → **任务完成提醒** toggles this on both sides. Keep `/m` open on the phone; Android Chrome can still banner while the tab is in the background. The notification body is the session title only — never an origin or path.

## Public access (own domain)

Leave **自动公网隧道** off. Point a reverse proxy or named tunnel at `http://127.0.0.1:<port>`, then set **公网地址** to that origin, for example `https://dsh.example.com`. Save and refresh the QR; pick **公网地址**, not a LAN IP.

Also trust that host on the connection plugin (`--trusted-host dsh.example.com`, or a profile overlay that concatenates it onto `ctx.webRuntime.trustedHosts`).

A Cloudflare *quick* tunnel hostname changes every run and does not forward SSE; chat then polls. A stable hostname on your own domain avoids that churn.

## License

BSD-3-Clause. Original copyright zhu1090093659; Haibala modifications 2026.
