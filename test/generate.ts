import chalk from "chalk";
import { sleep, gravity } from "./lib";
import { jsonToRuntype, writeRuntype, reduceRuntypes } from "white-cube";

const requireUncached = (module: string) => {
  delete require.cache[require.resolve(module)];
  return require(module);
};

const generate = async () => {
  const client = await gravity();

  let page = 0;

  const fetch = () => {
    page = page + 1;

    console.log(chalk.dim(`page +${page}`));

    return client.get("artworks", {
      params: { page, size: 100 },
    });
  };

  const iterate = async () => {
    try {
      const { Artwork } = requireUncached("../src/gravity/Artwork");

      if (!Artwork) {
        throw new Error("unable to reload Artwork");
      }

      const { data } = await fetch();
      const datums = [].concat(...[data]);
      const runtypes = datums.map(jsonToRuntype);
      const runtype = reduceRuntypes(runtypes, Artwork);

      writeRuntype({ name: "Artwork", object: runtype, path: "./src/gravity" });

      await sleep(10);

      await iterate();
    } catch (err) {
      console.error(chalk.red(err));
    }
  };

  iterate();
};

generate();
