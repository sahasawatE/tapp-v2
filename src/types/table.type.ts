type Header = {
  title: string;
  key: string;
  sortable?: false;
  width?: number | string;
  removable?: false;
  align?: "center" | "start" | "end";
};

type HeaderProp = Header[];

type TableProps = {
  headers: HeaderProp;
  data: any[];
};

type DataResponse = {
  content: any[];
  page: number;
  perpage: number;
  total: number;
};

export type { Header, HeaderProp, TableProps, DataResponse };
