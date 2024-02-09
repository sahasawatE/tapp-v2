type UserListItem = {
  User_branch: string;
  User_firstname: string;
  User_id: string;
  statis: number;
};

type User = {
  No: number;
  No_user: number;
  User_detail: string;
  User_branch: string;
  User_firstname: string;
  User_id: string;
  User_lastname: string;
  User_level: string;
};

type UserResponse = {
  token: string;
  user: User;
};

export type { UserListItem, User, UserResponse };
