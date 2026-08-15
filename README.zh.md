# @haibala/dsh-remote-web-ui

[English](README.md) | 中文

Haibala 的 DeepSeek Harness Web 移动端远程控制：电脑生成一次性二维码，手机扫码后进入独立的 `/m` 界面。

本包是 [`@linxin666/dsh-remote-web-ui`](https://github.com/zhu1090093659/dsh-web-ui) 的 fork（BSD-3-Clause），见 [NOTICE](NOTICE)。

## 安装

```sh
dsh plugin --profile web add github:haibara757/dsh-haibala-remote-web-ui
```

添加成功后重启 `dsh web`。仓库带预构建 `lib/`。

## 使用

1. 电脑用 `http://127.0.0.1:<端口>` 打开（配对面板只允许本机）。
2. 设置 → 远程：打开插件并保存。
3. 手机扫码（或打开复制的链接），进入 `/m`。
4. **停止**会撤销全部已配对设备；**刷新**会作废当前二维码。

侧栏「正在远程操控」只在至少一台已配对手机在线时显示。

## 用自己的域名走公网

关闭「自动公网隧道」。把反向代理或具名隧道指到 `http://127.0.0.1:<端口>`，再把「公网地址」填成该 origin，例如 `https://dsh.example.com`。保存后刷新二维码，选 **公网地址**，不要选局域网 IP。

连接插件也要信任该主机（`--trusted-host dsh.example.com`，或在 profile 里把它拼进 `ctx.webRuntime.trustedHosts`）。

Cloudflare quick tunnel 每次域名都会变，而且不转发 SSE，聊天会改成轮询。自己的稳定域名可以避免这一点。

## 许可证

BSD-3-Clause。原作版权 zhu1090093659；Haibala 修改 2026。
