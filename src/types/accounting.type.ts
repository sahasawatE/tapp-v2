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

export type { AccResponse, ReceiveOption };
