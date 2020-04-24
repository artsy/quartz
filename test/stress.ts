import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Runtype } from "runtypes";
import chalk from "chalk";
import { Gravity } from "../src";
import get from "lodash.get";

const xapp = async () => {
  const endpoint = `${process.env.GRAVITY_API_BASE}/xapp_token?client_id=${process.env.GRAVITY_ID}&client_secret=${process.env.GRAVITY_SECRET}`;
  const {
    data: { xapp_token: token },
  } = await axios.get(endpoint);
  return { token };
};

const gravity = async () => {
  const { token } = await xapp();
  return axios.create({
    baseURL: process.env.GRAVITY_API_BASE,
    headers: { "x-xapp-token": token },
  });
};

const random = (max: number) => Math.floor(Math.random() * Math.floor(max));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const validate = async ({
  name,
  request,
  runtype,
}: {
  name: string;
  request: Promise<AxiosResponse<any>>;
  runtype: Runtype;
}) => {
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
};

const check = (client: AxiosInstance) => ({
  artists: async () => {
    return await validate({
      name: "Artist",
      request: client.get("artists", { params: { page: random(2000) } }),
      runtype: Gravity.Artist,
    });
  },

  artworks: async () => {
    return await validate({
      name: "Artwork",
      request: client.get("artworks", { params: { page: random(2000) } }),
      runtype: Gravity.Artwork,
    });
  },

  artwork: async (id: string) => {
    return await validate({
      name: "Artwork",
      request: client.get(`artwork/${id}`),
      runtype: Gravity.Artwork,
    });
  },
});

const run = async () => {
  const client = await gravity();

  const { artists, artworks } = check(client);

  await artists();
  await sleep(500);
  await artworks();
  await sleep(500);

  run();
};

run();
