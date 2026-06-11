# Discord JP/KR Translation Bot

Discordサーバー内の日本語チャンネルと韓国語チャンネルの間で、メッセージをDeepL APIで自動翻訳して転送するBotです。

## 機能

- japaneseチャンネルに投稿されたメッセージを韓国語に翻訳し、koreanチャンネルへ投稿
- koreanチャンネルに投稿されたメッセージを日本語に翻訳し、japaneseチャンネルへ投稿
- Bot自身を含むBot投稿、空メッセージ、対象外チャンネルの投稿は無視
- 添付ファイルがある場合は、翻訳文の下に添付URLを転送
- エラーは `console.error` に出力

## 必要なもの

- Node.js 18以上
- Discord Bot Token
- DeepL API Key
- 翻訳対象にする2つのDiscordチャンネルID

## Discord Developer PortalでBotを作る手順

1. [Discord Developer Portal](https://discord.com/developers/applications) を開きます。
2. `New Application` をクリックして、任意のアプリ名を入力します。
3. 左メニューの `Bot` を開き、`Add Bot` をクリックします。
4. `Reset Token` または `View Token` からBot Tokenを取得します。
5. 取得したTokenは `.env` の `DISCORD_TOKEN` に設定します。

## Message Content IntentをONにする

このBotは投稿された本文を読み取る必要があるため、Message Content Intentを有効にしてください。

1. Discord Developer Portalで作成したアプリを開きます。
2. 左メニューの `Bot` を開きます。
3. `Privileged Gateway Intents` の中にある `Message Content Intent` をONにします。
4. 変更を保存します。

## Bot招待URLの作り方

1. Discord Developer Portalで作成したアプリを開きます。
2. 左メニューの `OAuth2` > `URL Generator` を開きます。
3. `Scopes` で `bot` を選択します。
4. `Bot Permissions` で以下を選択します。
   - `View Channels`
   - `Send Messages`
   - `Read Message History`
5. 生成されたURLを開き、Botを追加したいDiscordサーバーを選択して招待します。

## インストール

```bash
npm install
```

## .envの設定方法

`.env.example` をコピーして `.env` を作成します。

```bash
cp .env.example .env
```

Windows PowerShellの場合:

```powershell
Copy-Item .env.example .env
```

`.env` に以下を設定してください。

```env
DISCORD_TOKEN=your_discord_bot_token
DEEPL_API_KEY=your_deepl_api_key
JAPANESE_CHANNEL_ID=your_japanese_channel_id
KOREAN_CHANNEL_ID=your_korean_channel_id
```

チャンネルIDはDiscordの開発者モードをONにしたあと、対象チャンネルを右クリックして `チャンネルIDをコピー` から取得できます。

## 起動

```bash
npm start
```

起動に成功すると、コンソールにBotのログイン名が表示されます。

## 注意

- Botに対象チャンネルを閲覧・投稿できる権限を付与してください。
- DeepL APIの利用量や料金は、利用しているDeepLプランに従います。
- Discord Developer Portalで `Message Content Intent` がOFFのままだと、メッセージ本文を読み取れません。
