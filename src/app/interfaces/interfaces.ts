export interface DialogDataDefault {
}

export interface User {
  id?: number,
  fullName: string,
  email: string,
  phone: string,
  picture: string,
  facebookId: string,
  fcmId: string,
  company?: number,
  profile?: number
}

export interface Profile {
  id?: number,
  title: string,
  countryId?: number,
  config: string,
  users?: string
}

// w2ui
export interface Columns {
  field: string,
  caption: string,
  size: string,
  sortable?: boolean,
  attr?: string,
  resizable?: boolean,
  frozen?: boolean,
  render?: string,
  editable?: any,
  style?: string,
  type?: string
}

export interface Searches {
  field: string,
  caption: string,
  type: string,
  hidden?: boolean,
  inTag?: string,
  outTag?: string,
  options?: {
    items: any
  }
}

export interface SearchData {
  field: string,
  value: string | string[],
  operator: 'is' | 'in' | 'between' | 'begins with' | 'contains' | 'ends with',
  type: 'text' | 'int' | 'float' | 'date'
}

export interface Show {
  toolbar?: boolean,
  footer?: boolean,
  toolbarAdd?: boolean,
  toolbarDelete?: boolean,
  toolbarSave?: boolean,
  toolbarEdit?: boolean,
  header?: boolean,
  lineNumbers?: boolean,
  selectColumn?: boolean,
  expandColumn?: boolean
}

export interface Item {
  id: string | number,
  type: 'button' | 'check' | 'radio' | 'drop' | 'menu' | 'break' | 'spacer' | 'html',
  text: string,
  html?: string,
  tooltip?: any,
  count?: any,
  hidden?: boolean,
  disabled?: boolean,
  checked?: boolean,
  img?: string,
  icon?: string,
  route?: any,
  arrow?: boolean,
  style?: any,
  color?: any,
  transparent?: any,
  group?: any,
  items?: Item[],
  selected?: any,
  overlay?: {},
  onClick?(event: any): any,
  onRefresh?(event: any): any
}

export interface Toolbar {
  items: Item[]
}

export interface ColumnGroups {
  span: number,
  caption: string,
  master?: boolean
}

export interface Recid {
  recid: number,
  [x: string]: any,
  style?: string,
  summary?: boolean,
  editable?: boolean,
  expanded?: boolean | 'none' | 'spinner',
  changes?: any
}

export interface Menu {
  id: number,
  text: string,
  icon: string
}