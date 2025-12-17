import { createContext, type ReactNode, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

/**
 * ステータスフィルターの型
 */
export type StatusFilter = "all" | "published" | "draft";

/**
 * 投稿フィルターの状態型
 *
 * Context + Zustand パターン（Zustand v5推奨）
 * グローバルではなく、特定のコンポーネントツリー内でのみ共有される状態を管理
 */
type PostFilterState = {
  // 状態
  searchQuery: string;
  statusFilter: StatusFilter;
  // アクション
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  reset: () => void;
};

/**
 * 投稿フィルターストアの初期状態
 */
const initialState = {
  searchQuery: "",
  statusFilter: "all" as StatusFilter,
};

/**
 * 投稿フィルターストアの作成関数
 *
 * Zustand v5では、createStore（vanilla）を使用してContext経由で提供する
 * パターンが推奨されている
 */
const createPostFilterStore = () =>
  createStore<PostFilterState>((set) => ({
    ...initialState,
    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    reset: () => set(initialState),
  }));

/**
 * 投稿フィルターストアの型
 */
type PostFilterStore = ReturnType<typeof createPostFilterStore>;

/**
 * 投稿フィルターコンテキスト
 */
const PostFilterContext = createContext<PostFilterStore | null>(null);

/**
 * 投稿フィルタープロバイダー
 *
 * このプロバイダーでラップされたコンポーネントツリー内でのみ
 * フィルター状態を共有できる
 *
 * @example
 * <PostFilterProvider>
 *   <PostListPage />
 * </PostFilterProvider>
 */
export const PostFilterProvider = ({ children }: { children: ReactNode }) => {
  // ストアインスタンスを1度だけ作成（React 18+ の StrictMode 対応）
  const storeRef = useRef<PostFilterStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createPostFilterStore();
  }

  return (
    <PostFilterContext.Provider value={storeRef.current}>
      {children}
    </PostFilterContext.Provider>
  );
};

/**
 * 投稿フィルターストアを使用するカスタムフック
 *
 * セレクター関数を使用して、必要な状態のみを取得できる
 * これにより、不要な再レンダリングを防ぐ
 *
 * @example
 * // 検索クエリのみ取得
 * const searchQuery = usePostFilterStore((state) => state.searchQuery)
 *
 * // アクションのみ取得
 * const setSearchQuery = usePostFilterStore((state) => state.setSearchQuery)
 *
 * // 複数の状態を取得
 * const { searchQuery, statusFilter } = usePostFilterStore((state) => ({
 *   searchQuery: state.searchQuery,
 *   statusFilter: state.statusFilter,
 * }))
 */
export const usePostFilterStore = <T,>(
  selector: (state: PostFilterState) => T,
): T => {
  const store = useContext(PostFilterContext);
  if (!store) {
    throw new Error(
      "usePostFilterStore must be used within a PostFilterProvider",
    );
  }
  return useStore(store, selector);
};

/**
 * フィルター状態全体を取得するフック
 *
 * 便利のために全状態を返すバージョンも提供
 * ただし、パフォーマンスを考慮する場合はセレクターを使用すること
 */
export const usePostFilter = () => {
  const searchQuery = usePostFilterStore((state) => state.searchQuery);
  const statusFilter = usePostFilterStore((state) => state.statusFilter);
  const setSearchQuery = usePostFilterStore((state) => state.setSearchQuery);
  const setStatusFilter = usePostFilterStore((state) => state.setStatusFilter);
  const reset = usePostFilterStore((state) => state.reset);

  return {
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    reset,
  };
};
