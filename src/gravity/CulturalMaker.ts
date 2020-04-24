import { Record, String } from "runtypes";

// TODO: These are rarer so need to validate specifically
export const CulturalMaker = Record({
  _id: String,
  id: String,
  name: String,
  full_name: String,
  created_at: String,
  updated_at: String,
});
