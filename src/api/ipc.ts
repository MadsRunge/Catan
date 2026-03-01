export interface SaveResult {
  success: boolean
  error?: string
}

export interface LoadResult<T> {
  success: boolean
  data?: T
  error?: string
}

declare global {
  interface Window {
    gamePersistence: {
      saveGame: (gameState: unknown) => Promise<SaveResult>
      loadGame: <T>() => Promise<LoadResult<T>>
      hasSavedGame: () => Promise<boolean>
      clearGame: () => Promise<SaveResult>
    }
  }
}

export const persistence = {
  save: async (gameState: unknown): Promise<SaveResult> => {
    return window.gamePersistence.saveGame(gameState)
  },
  load: async <T>(): Promise<LoadResult<T>> => {
    return window.gamePersistence.loadGame<T>()
  },
  hasSaved: async (): Promise<boolean> => {
    return window.gamePersistence.hasSavedGame()
  },
  clear: async (): Promise<SaveResult> => {
    return window.gamePersistence.clearGame()
  },
}
