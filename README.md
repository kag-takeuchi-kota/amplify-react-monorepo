# Amplify + React + TanStack Router を Monorepo で turbo するテンプレート

## 考えたこと

- 世のテンプレートはtsファイルを直接exportしているものが多いが規模が大きくなるにつれてLanguage Serverの消費メモリ増大
  - パッケージごとにビルドして、アーティファクト参照することで、サイズの小さい型定義ファイルの解決で済ませたい
    - コードジャンプ時にアーティファクトの型定義ファイルに飛んでしまうのは、mapファイルで実装に飛ばす
- amplify（インフラ部分）とアプリケーションの分離
  - packages/adapter が間に立って吸収する
  - アプリケーションはインフラを意識せず、adapterのインターフェースに依存（レイヤーを意識せざるを得ない構成。差し込みがしやすい）
- Feature Driven 的なディレクトリ構成にして、open-close原則が自然と守られる構成
  - AIにとってもわかりやすいし、AIによる誤爆の被害も少なくなる
- turboによる依存タスク管理
- apps/の中に複数アプリケーションを入れられる構成
  - ログ監視ダッシュボードのような開発者向けアプリケーションとか、AI Agentサーバーのような単独でも価値があるものをそこで構築したい
- パッケージを分ける単位
  - 分けたいレイヤーごと、完全に独立したロジック
  - パッケージの役割・責任を明確にできるなら分けちゃおう

## 使用技術

- amplify
- react
- shadcn (base ui)
- tailwindcss (styling)
- tanstack router (routing)
- vite (builder / dev server)
- tsdown (ts builder/bundler)
- turbo (task runner)
