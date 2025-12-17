import type { StateCreator } from "zustand";

/**
 * テーマ型定義
 */
export type Theme = "light" | "dark";

/**
 * UIスライスの型定義
 *
 * サイドバーの状態やテーマ設定など、UI関連のグローバル状態を管理
 */
export type UISlice = {
  // 状態
  sidebarCollapsed: boolean;
  theme: Theme;
  // アクション
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

/**
 * UIスライスの作成関数
 *
 * @example
 * // MainLayoutでの使用
 * const sidebarCollapsed = useBoundStore((state) => state.sidebarCollapsed)
 * const toggleSidebar = useBoundStore((state) => state.toggleSidebar)
 */
export const createUISlice: StateCreator<UISlice> = (set) => ({
  // 初期状態
  sidebarCollapsed: false,
  theme: "light",

  // アクション
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
});
