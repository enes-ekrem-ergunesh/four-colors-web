export interface Classroom {
  id: number,
  course_id: number,
  name: string,
  number_of_sessions: number,
  expected_session_duration: number,
  created_at: string,
  updated_at: string | null,
  deleted_at: string | null
}
