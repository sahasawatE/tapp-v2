type AccResponse = {
  Acc_id: string;
  Bank_id: string;
  Bank_name: string;
  Branch_id: string;
  Transac_amout: string;
  Transac_date: string;
  Transac_detail: string;
  Transac_id: string;
  Transac_separator: string;
  Transac_time: string;
  Transac_type: string;
  User_firstname: string;
  User_id: string;
  User_lastname: string;
  account_amout: string;
  history_date: string;
  id_no: number;
  name_list_reference: string;
  type_list_reference: number;
};

type ReceiveOption = {
  Receipt: string;
  Receipt_name: string;
};

type BankOption = {
  Bank_id: string;
  Bank_name: string;
  id_list_reference: number;
  id_no: number;
  id_seperate_type: string;
};

type BankSeparateOption = {
  Bank_id: string;
  Bank_name: string;
  date: string;
  id: number;
  id_no: number;
  id_seperate: string;
  id_seperate_type: string;
  id_type: number;
  name_seperate: string;
  name_type: string;
  type_seperate: string;
};

type ExpenseOption = {
  Expanse_id: string;
  Expanse_name: string;
};

export type {
  AccResponse,
  ReceiveOption,
  BankOption,
  BankSeparateOption,
  ExpenseOption,
};
