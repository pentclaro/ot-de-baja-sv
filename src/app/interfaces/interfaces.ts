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

type Render = (record: Record, recordIndex?: number, columnIndex?: number) => string;
type Event = (event: any) => any;

export interface Column {
  field: string,
  text: string,
  size: string,
  sortable?: boolean,
  attr?: string,
  resizable?: boolean,
  frozen?: boolean,
  render?: Render | string,
  editable?: Editable,
  style?: string,
  type?: string,
  min?: number,
  max?: number,
  gridMinWidth?: any,
  sizeCorrected?: any,
  sizeCalculated?: any,
  hidden?: boolean,
  info?: boolean | {
    [key: string]: any,
  },
  searchable?: boolean,
  title?: Event | string,
  sortMode?: Event,
  autoResize?: boolean,
  hideable?: boolean,
}

export interface Search {
  field: string,
  label: string,
  type: 'text' | 'int' | 'float' | 'hex' | 'money' | 'currency' | 'percent' | 'alphanumeric' | 'date' | 'time' | 'list' | 'combo' | 'enum',
  hidden?: boolean,
  inTag?: string,
  outTag?: string,
  options?: {
    items: any,
    [key: string]: any,
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
  type: 'button' | 'check' | 'radio' | 'drop' | 'menu' | 'menu-check' | 'menu-radio' | 'break' | 'spacer' | 'html' | 'color' | 'text-color',
  text: string,
  html?: string,
  tooltip?: Event | string,
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
  onClick?: Event,
  onRefresh?: Event
}

export interface Toolbar {
  items: Item[],
  onClick?: Event
}

export interface ColumnGroups {
  span: number,
  text: string,
  master?: boolean
}

export interface Record {
  recid: number,
  [key: string]: any,
  style?: string,
  summary?: boolean,
  editable?: boolean,
  expanded?: boolean | 'none' | 'spinner',
  changes?: any,
  info?: boolean
}

export interface Menu {
  id: number,
  text: string,
  icon: string
}

export interface Editable {
  type: 'text' | 'int' | 'float' | 'hex' | 'money' | 'currency' | 'percent' | 'alphanumeric' | 'date' | 'time' | 'datetime' | 'color' | 'list' | 'combo' | 'check' | 'checkbox' | 'select',
  inTag?: string,
  style?: string,
  [key: string]: any
}

export interface ColumnStyle {
  id: number,
  type: 'header' | 'group',
  style: {
    [key: string]: string,
  }
}
