import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AuthSlice, createAuthSlice } from "./slices/authSlice";
import { createUISlice, type UISlice } from "./slices/uiSlice";

/**
 * 統合ストアの型定義
 *
 * 複数のスライスを組み合わせたストア
 */
export type BoundStore = AuthSlice & UISlice;

/**
 * 統合ストア
 *
 * Zustandのスライスパターンを使用して、複数の独立した状態管理を
 * 1つのストアに統合。persistミドルウェアで永続化も対応。
 *
 * @example
 * // コンポーネントでの使用（セレクターで必要な部分のみ取得）
 * const user = useBoundStore((state) => state.user)
 * const logout = useBoundStore((state) => state.logout)
 *
 * // 複数の状態を一度に取得（shallow比較推奨）
 * import { useShallow } from 'zustand/react/shallow'
 * const { user, isAuthenticated } = useBoundStore(
 *   useShallow((state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }))
 * )
 */
export const useBoundStore = create<BoundStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: "app-storage",
      // 永続化する状態を選択（関数は除外）
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
);

// 個別のスライスもエクスポート（必要に応じて単独使用可能）
export type { AuthSlice, User } from "./slices/authSlice";
export type { Theme, UISlice } from "./slices/uiSlice";
