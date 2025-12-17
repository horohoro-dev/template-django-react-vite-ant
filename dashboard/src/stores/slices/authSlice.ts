import type { StateCreator } from "zustand";

/**
 * ユーザー型定義
 */
export type User = {
  id: number;
  email: string;
  username: string;
  is_staff?: boolean;
};

/**
 * 認証スライスの型定義
 *
 * Zustandのスライスパターンを使用し、認証関連の状態とアクションを定義
 */
export type AuthSlice = {
  // 状態
  user: User | null;
  isAuthenticated: boolean;
  // 派生状態（セレクター）
  isAdmin: () => boolean;
  // アクション
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

/**
 * 認証スライスの作成関数
 *
 * StateCreatorを使用して、他のスライスと組み合わせ可能な形式で定義
 *
 * @example
 * // 単独使用
 * const useAuthStore = create<AuthSlice>()(createAuthSlice)
 *
 * // 他のスライスと組み合わせ
 * const useBoundStore = create<AuthSlice & UISlice>()((...a) => ({
 *   ...createAuthSlice(...a),
 *   ...createUISlice(...a),
 * }))
 */
export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  // 初期状態
  user: null,
  isAuthenticated: false,

  // 派生状態をメソッドとして定義（セレクターパターン）
  isAdmin: () => get().user?.is_staff ?? false,

  // アクション
  login: (accessToken, refreshToken, user) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
});
