import axios from "axios";

export const xapp = async () => {
  const endpoint = `${process.env.GRAVITY_API_BASE}/xapp_token?client_id=${process.env.GRAVITY_ID}&client_secret=${process.env.GRAVITY_SECRET}`;

  console.log(`Connecting to ${endpoint}`);

  const {
    data: { xapp_token: token },
  } = await axios.get(endpoint);

  return { token };
};
