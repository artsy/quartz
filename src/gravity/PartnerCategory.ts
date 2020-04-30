import { Record, String, Boolean } from "runtypes";

export const PartnerCategory = Record({
  _id: String,
  id: String,
  category_type: String,
  name: String,
  internal: Boolean,
});
