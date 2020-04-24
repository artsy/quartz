import {
  Dictionary,
  Record,
  String,
  Number,
  Null,
  Array,
  Boolean,
} from "runtypes";

export const Image = Record({
  id: String,
  position: Number,
  aspect_ratio: Number.Or(Null),
  downloadable: Boolean,
  original_width: Number.Or(Null),
  original_height: Number.Or(Null),
  is_default: Boolean,
  image_url: String.Or(Null),
  image_versions: Array(String),
  image_urls: Dictionary(String, "string"), // TODO: Flesh out expected keys
  tile_size: Number.Or(Null),
  tile_overlap: Number.Or(Null),
  tile_format: String.Or(Null),
  tile_base_url: String.Or(Null),
  max_tiled_height: Number.Or(Null),
  max_tiled_width: Number.Or(Null),
  gemini_token: String,
  gemini_token_updated_at: String.Or(Null),
});
