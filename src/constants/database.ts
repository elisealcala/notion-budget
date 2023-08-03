enum Database {
  ACCOUNTS = "accounts",
  CATEGORIES = "categories",
  EXPENSES = "expenses",
  INCOMES = "incomes",
  TRANSFERS = "transfers",
}

type Data = {
  databaseLink: string;
};

export const notionData: Record<Database, Data> = {
  [Database.ACCOUNTS]: {
    databaseLink: "70129f242df34bf9822c71b75bfa72da",
  },
  [Database.CATEGORIES]: {
    databaseLink: "81cc68bbce9d4187a5ed3c52c950d8b8",
  },
  [Database.EXPENSES]: {
    databaseLink: "98f68b650d544c6697e75b47e067c3cb",
  },
  [Database.INCOMES]: {
    databaseLink: "1ebc9dc6d22242439808e998fa0667fb",
  },
  [Database.TRANSFERS]: {
    databaseLink: "70129f242df34bf9822c71b75bfa72da",
  },
};
