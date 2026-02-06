import { enUS } from "date-fns/locale";

export const localeValues = {
  locale: "en" as string,
  dialog: {
    ok: "OK",
    cancel: "Cancel",
  },
  modal: {
    confirm: "Confirm",
    cancel: "Cancel",
  },
  pagination: {
    morePages: "More pages",
    rowsPerPage: "Rows Per Page",
  },
  picker: {
    selectDate: "Select Date",
    dayPicker: enUS,
  },
  empty: {
    description: "No record",
  },
} as const;
