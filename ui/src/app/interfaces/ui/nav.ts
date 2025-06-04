export interface Nav {
  name: string,
  route: string,
  disabled?: boolean,
  dropdown?: Nav[]
}
