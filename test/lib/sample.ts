import { random } from "./random";

export const sample = <T>(xs: T[]) => xs[random(xs.length - 1)];
