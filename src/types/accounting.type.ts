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

interface bso extends BankSeparateOption {
  no: number;
  title: string;
}
interface bs extends BankOption {
  title: string;
}

type ListForm = {
  bank: bs;
  bank_separate: bso;
  bank_separate_date: string;
  amount: string;
};

type ReceiveForm = {
  type: ReceiveOption;
  bank: BankOption;
  bank_separate: bso;
  bank_separate_date: string;
  amount: string;
  detail: string;
  transac_date: string;
};

type ExpenseForm = {
  type: ExpenseOption;
  bank: BankOption;
  bank_separate: bso;
  bank_separate_date: string;
  amount: string;
  detail: string;
  transac_date: string;
};

type OtherForm = {
  detail: string;
  transac_date: string;
  dr: ListForm[];
  cr: ListForm[];
};

type AccOption = {
  Bank_id: string;
  Bank_name: string;
  id_no: number;
};

interface ao extends AccOption {
  title: string;
}

type RefOption = {
  id_reference: number;
  name_reference: string;
};

type UserOption = {
  User_firstname: string;
  User_id: string;
};

type SeparateOption = {
  id: number;
  id_seperate: string;
};

type DeepSearchForm = {
  show_today: boolean;
  show_everyone: boolean;
  quarter: string;
  start_date: string;
  end_date: string;
  separate: SeparateOption;
  ref: RefOption;
  user: UserOption;
  bank_condition: string;
  bank_from: ao;
  bank_to: ao;
};

export type {
  AccResponse,
  ReceiveOption,
  BankOption,
  BankSeparateOption,
  ExpenseOption,
  bso,
  bs,
  ReceiveForm,
  ExpenseForm,
  OtherForm,
  ListForm,
  AccOption,
  RefOption,
  UserOption,
  SeparateOption,
  ao,
  DeepSearchForm,
};
