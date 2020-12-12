# kintone-btn-cron

kintone の任意のアプリの一覧画面で任意のIDのボタンを定期的にクリックするシステムのテンプレート

### 必須環境

* AWS SAM CLI - [AWS SAM CLI のインストール](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js(NPM) - [Node.js 12 のインストール](https://nodejs.org/ja/)
* Yarn - [Yarn のインストール](https://classic.yarnpkg.com/ja/docs/install/)
* Docker - [Docker のインストール](https://hub.docker.com/search/?type=edition&offering=community)

### 環境変数の指定

環境変数は SecretManager で管理している.

* `DOMAIN` - cybozu.com のURL (例：https://o6cxp.cybozu.com/)
* `USERNAME` - ログイン情報のログイン名
* `PASSWORD` - ログイン情報のパスワード
* `APP_URL` - 任意のアプリのURL (例：https://o6cxp.cybozu.com/k/5/)
* `ELEMENT_ID` - 任意のボタン要素のID (例：test_id)

### template.yml の変更

- `Resources`
  - `PuppeteerLayer` : `KintoneBtnCron` で必要になる `Puppeteer` のLambdaレイヤー
  - `AwsSdkLayer` : `KintoneBtnCron` で必要になる `AwsSdk` のLambdaレイヤー
  - `KintoneBtnCron` : メインのLambda関数
    - Properties
      - Events
        - CloudWatchEvent
          - Properties
            - Schedule : 指定された `cron` の定義に合わせて `KintoneBtnCron` が実行されるので、頻度を変更したい場合はここを変更する([ドキュメント](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-cloudwatchevents-expressions.html))
      - Timeout : 処理に必要な時間に合わせて変更する
      - Environment
        - Variables
          - SecretId : SecretManager のシークレットの名前を指定する. 仮で指定している(`KintoneBtnCronEnv`)ので、別の名前を使う場合は変更する
      - Policies : 仮で指定しているので、別の arn を指定する必要がある (`account-id` の部分が変わる)

### ボタンのクリックの待機処理の変更

`./src/index.js` の中に各パターンの推奨コードをコメントアウトして記載している.
タイムアウト時間や待機処理を任意のものに変更して、利用してください.

- ボタンクリックに非同期処理がないパターン
- ボタンクリック後に特定の要素が生成されるパターン
- ボタンクリック後にリロードされるパターン
- ボタンクリック後のフックがなく、指定時間待つことで解決するパターン

### ローカルでの実行方法

#### レイヤーのインストール

```bash
$ cd layers/aws-sdk/nodejs
$ yarn install
$ cd ../../../
$ cd layers/puppeteer/nodejs
$ yarn install
```

ローカルでもLambda関数の実行

```bash
$ sam local invoke KintoneBtnCron
```

### デプロイ

```bash
$ sam build
$ sam deploy
```
