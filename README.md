## django-react-vite-ant

Django + React + Vite + Ant Design のテンプレートプロジェクトです。

## プロジェクト構成

```
/
├── backend/          # Django バックエンド
├── dashboard/        # 管理用フロントエンド (React + Vite + Ant Design)
├── portal/           # 公開用フロントエンド (React + Vite + Ant Design)
├── openapi.dashboard.json  # Dashboard用 OpenAPI スキーマ（自動生成）
├── openapi.portal.json     # Portal用 OpenAPI スキーマ（自動生成）
└── packages/         # サンプルコード（参考用）
```

## 技術スタック

### バックエンド
- Django 4.2
- Django REST Framework 3.16
- drf-spectacular 0.29（OpenAPI スキーマ生成）
- djangorestframework-simplejwt 5.5（JWT認証）

### フロントエンド
- React 19
- Vite 7
- TypeScript 5
- Ant Design 6
- TanStack Query 5（サーバー状態管理）
- orval 7（OpenAPI → TypeScript 自動生成）
- Zustand 5（クライアント状態管理 - dashboardのみ）
- React Router 7（ルーティング - dashboardのみ）

## セットアップ

### バックエンド

```bash
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py seed_data  # テストデータ作成
uv run python manage.py runserver
```

### フロントエンド（Dashboard）

```bash
cd dashboard
pnpm install
pnpm run generate:api  # OpenAPIからAPIクライアント生成
pnpm run dev
```

### フロントエンド（Portal）

```bash
cd portal
pnpm install
pnpm run generate:api  # OpenAPIからAPIクライアント生成
pnpm run dev
```

## API エンドポイント

| エンドポイント | 説明 |
|--------------|------|
| `/api/dashboard/` | 管理用API（認証必須） |
| `/api/portal/` | 公開用API（認証不要） |
| `/api/token/` | JWTトークン取得 |
| `/api/token/refresh/` | JWTトークンリフレッシュ |
| `/api/schema/dashboard/swagger/` | Dashboard API Swagger UI |
| `/api/schema/portal/swagger/` | Portal API Swagger UI |

## OpenAPI スキーマ生成

バックエンドでAPIを変更した後、OpenAPIスキーマを再生成するには：

```bash
cd backend
uv run python manage.py generate_schemas --output-dir ..
```

その後、各フロントエンドでAPIクライアントを再生成：

```bash
# Dashboard
cd dashboard && pnpm run generate:api

# Portal
cd portal && pnpm run generate:api
```

## デモ認証情報

- Email: `admin@example.com`
- Password: `admin123`

## 開発ポート

| サービス | ポート |
|---------|-------|
| Backend | 8000 |
| Dashboard | 5173 |
| Portal | 5174 |
