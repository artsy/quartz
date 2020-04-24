import {
  Boolean,
  Number,
  String,
  Array,
  Record,
  Dictionary,
  Static,
  Undefined,
  Null,
} from "runtypes";

export const EmbeddedArtist = Record({
  _id: String,
  id: String,
  alternate_names: Array(String).Or(Undefined),
  artworks_count: Number,
  birthday: String.Or(Null),
  blurb: String.Or(Undefined),
  collections: String.Or(Undefined),
  consignable: Boolean,
  deathday: String.Or(Null),
  disable_price_context: Boolean.Or(Undefined),
  display_auction_link: Boolean.Or(Undefined),
  forsale_artworks_count: Number,
  hometown: String.Or(Undefined),
  image_url: String.Or(Null),
  image_urls: Dictionary(String, "string"), // TODO: Flesh out expected keys
  image_versions: Array(String),
  location: String.Or(Undefined),
  name: String,
  nationality: String.Or(Null),
  original_height: Number.Or(Null),
  original_width: Number.Or(Null),
  public: Boolean,
  published_artworks_count: Number,
  sortable_id: String,
  target_supply: Boolean,
  years: String,
});

export type EmbeddedArtist = Static<typeof EmbeddedArtist>;

export const Artist = EmbeddedArtist.And(
  Record({
    // TODO
  })
);

export type Artist = Static<typeof Artist>;
