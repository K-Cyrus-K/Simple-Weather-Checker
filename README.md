# 簡易天気チェッカー (Simple Weather Checker)

OpenWeatherMap APIを利用して、リアルタイムの気象情報を取得・表示するWebアプリケーションです。

## 1. プロジェクト概要
このプロジェクトは、シンプルかつ直感的なUIで、世界中の都市の天気や現在地の天気を素早く確認できるツールです。レスポンシブデザインに対応しており、PCおよびスマートフォンから快適に利用できます。

## 2. 目的
- ユーザーに迅速かつ正確な気象情報（気温、湿度、風速、天気アイコン）を提供すること。
- 都市名による検索と、デバイスの位置情報を利用した現在地の確認を両立させること。
- 検索履歴の保存により、頻繁にチェックする都市へのアクセスを容易にすること。

## 3. 機能一覧
- **都市名検索**: 入力欄に都市名（英名推奨）を入力して天気を表示。
- **現在地の天気取得**: 位置情報（Geolocation API）を使用して、今いる場所の天気をワンクリックで表示。
- **気温単位の切り替え**: 設定パネルから摂氏（°C）と華氏（°F）を切り替え可能。
- **検索履歴の保存**: 直近3件の検索記録をブラウザのローカルストレージに保存。履歴をクリックして再検索、Xボタンで削除が可能。
- **ビジュアル天気表示**: 天気状態に合わせたアイコンの動的変更と、背景アニメーション。
- **レスポンシブ対応**: デバイスの画面サイズに最適化されたカードレイアウト。

## 4. 技術スタック
- **フロントエンド**:
  - HTML5 (Semantic Tags)
  - CSS3 (Tailwind CSS v4 形式, カスタムアニメーション)
  - Vanilla JavaScript (ES6+)
- **API**:
  - [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather Data / Geocoding API)
- **アイコン/フォント**:
  - Font Awesome 7.0.1
  - SVG Weather Icons (プロジェクト内 `img/` フォルダ)

## 5. 開発環境
- **エディタ**: Visual Studio Code 推奨
- **拡張機能**: Live Server (ローカルでの動作確認用)
- **実行環境**: Google Chrome / Firefox / Safari 等のモダンブラウザ

## 6. セットアップ手順
1.  **リポジトリのクローン**:
    ```bash
    git clone [repository-url]
    ```
2.  **APIキーの取得**:
    - [OpenWeatherMap](https://home.openweathermap.org/users/sign_up) でアカウントを作成し、APIキーを取得します。
3.  **APIキーの設定**:
    - `js/fetchWeather.js` 内の `apiKey` 変数に、取得したキーを貼り付けます。
    ```javascript
    const apiKey = "YOUR_API_KEY_HERE";
    ```
4.  **アプリケーションの起動**:
    - `index.html` をブラウザで開くか、VS Codeの Live Server を起動します。

## 7. テスト方法
- **手動テスト**:
  - 都市名を入力し、正しい気温やアイコンが表示されるか確認。
  - 無効な都市名を入力し、エラーメッセージが表示されるか確認。
  - 位置情報の許可・拒否時の動作確認。
  - 摂氏/華氏の計算が正しいか確認。
- **ブラウザ開発者ツール**:
  - `Console` タブでAPI通信のエラーが出ていないか確認。
  - `Network` タブでAPIレスポンスの内容を確認。

## 8. デプロイ手順
- **GitHub Pages へのデプロイ**:
  1. GitHubリポジトリの `Settings` > `Pages` に移動。
  2. `Branch` を `main` に設定し、`Save` をクリック。
- **Vercel / Netlify**:
  - リポジトリを連携するだけで、静的サイトとして自動的にデプロイされます。

## 9. 貢献ガイドライン
1. このリポジトリをフォークします。
2. 新しい機能や修正のためのブランチを作成します (`git checkout -b feature/AmazingFeature`)。
3. 変更をコミットします (`git commit -m 'Add some AmazingFeature'`)。
4. ブランチにプッシュします (`git push origin feature/AmazingFeature`)。
5. プルリクエストを作成してください。

## 10. ライセンス情報
このプロジェクトは **MITライセンス** の下で公開されています。詳細は `LICENSE` ファイル（存在する場合）を参照してください。

---
© 2026 Cyrus Kwan. All Rights Reserved.
