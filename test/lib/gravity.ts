import axios from "axios";
import { xapp } from "./xapp";

export const gravity = async () => {
  const { token } = await xapp();

  return axios.create({
    baseURL: process.env.GRAVITY_API_BASE,
    headers: { "x-xapp-token": token },
  });
};
