import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Runtype } from "runtypes";
import chalk from "chalk";
import { Gravity } from "../src";
import get from "lodash.get";
import { random, sample, sleep, gravity } from "./lib";

const STATE: {
  client: null | AxiosInstance;
} = {
  client: null,
};

const validate = async ({
  name,
  request,
  runtype,
}: {
  name: string;
  request: Promise<AxiosResponse<any>>;
  runtype: Runtype;
}) => {
  try {
    const {
      data,
      config: { url, params },
    } = await request;

    console.log(
      chalk.green(`fetching: ${url}:${params ? JSON.stringify(params) : ""}`)
    );

    [].concat(...[data]).map((datum: any) => {
      try {
        runtype.check(datum);
        console.log(chalk.white(`ok ${name}:${datum.id}`));
      } catch ({ message, key, name: _name }) {
        console.error(
          chalk.redBright(`error ${name}:${datum.id} <${key}>: ${message}`),
          get(datum, key)
        );
      }
    });
  } catch (err) {
    console.error(chalk.red(err));
  }
};

const check = () => ({
  artists: async () => {
    return await validate({
      name: "Artist",
      request: STATE.client!.get("artists", { params: { page: random(2000) } }),
      runtype: Gravity.Artist,
    });
  },

  artworks: async () => {
    return await validate({
      name: "Artwork",
      request: STATE.client!.get("artworks", {
        params: { page: random(2000) },
      }),
      runtype: Gravity.Artwork,
    });
  },

  features: async () => {
    return await validate({
      name: "Feature",
      request: STATE.client!.get("features", {
        params: { page: random(100) },
      }),
      runtype: Gravity.Feature,
    });
  },

  orderedSets: async () => {
    return await validate({
      name: "OrderedSet",
      request: STATE.client!.get("sets", {
        params: { page: random(200) },
      }),
      runtype: Gravity.OrderedSet,
    });
  },

  orderedItems: async () => {
    // First get a random OrderedSet
    try {
      const {
        data: sets,
      }: {
        data: { id: string; item_type: string }[];
      } = await STATE.client!.get("sets", {
        params: { page: random(200) },
      });

      const { id, item_type } = sample(sets);

      console.log(chalk.cyanBright(`Set:${id}::Items:${item_type}`));

      return await validate({
        name: "OrderedItem",
        request: STATE.client!.get(`set/${id}/items`),
        runtype: Gravity.OrderedItem,
      });
    } catch (err) {
      console.error(chalk.red(err));
    }
  },

  sales: async () => {
    return await validate({
      name: "Sale",
      request: STATE.client!.get("sales", {
        params: { page: random(100) },
      }),
      runtype: Gravity.Sale,
    });
  },

  artist: async (id: string) => {
    return await validate({
      name: "Artwork",
      request: STATE.client!.get(`artist/${id}`),
      runtype: Gravity.Artist,
    });
  },

  artwork: async (id: string) => {
    return await validate({
      name: "Artwork",
      request: STATE.client!.get(`artwork/${id}`),
      runtype: Gravity.Artwork,
    });
  },

  feature: async (id: string) => {
    return await validate({
      name: "Feature",
      request: STATE.client!.get(`feature/${id}`),
      runtype: Gravity.Feature,
    });
  },
});

const run = async () => {
  STATE.client = STATE.client ?? (await gravity());

  const {
    artists,
    artworks,
    features,
    orderedSets,
    orderedItems,
    sales,
  } = check();

  await artists();
  await sleep(500);
  await artworks();
  await sleep(500);
  await features();
  await sleep(500);
  await orderedSets();
  await sleep(500);
  await orderedItems();
  await sleep(500);
  await sales();
  await sleep(500);

  await run();
};

run();
