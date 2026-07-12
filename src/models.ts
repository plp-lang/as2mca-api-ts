/**
 * Ответ с данными успешно инициализированной сессии.
 */
export interface SessionInfo {
  /** Идентификатор сессии. */
  session_id: string;
  /** Имя отладочного канала. */
  debug_pipe_name: string;
}
