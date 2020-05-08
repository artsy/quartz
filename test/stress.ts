import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Runtype } from "runtypes";
import chalk from "chalk";
import { Gravity } from "../src";
import get from "lodash.get";
import { random, sleep, gravity } from "./lib";

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
    const { data } = await request;

    [].concat(...[data]).map((datum: any) => {
      try {
        runtype.check(datum);
        console.log(chalk.white(`ok ${name}:${datum.id}`));
      } catch ({ message, key }) {
        console.error(
          chalk.redBright(`error ${name}:${datum.id} <${key}>: ${message}`),
          get(datum, key)
        );
      }
    });
  } catch (err) {
    console.error(chalk.redBright(err));
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

  const { artists, artworks, features } = check();

  await artists();
  await sleep(500);
  await artworks();
  await sleep(500);
  await features();
  await sleep(500);

  await run();
};

run();
