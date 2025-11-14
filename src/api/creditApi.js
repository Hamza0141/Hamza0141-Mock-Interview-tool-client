// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api', // adjust for your API
//   withCredentials: true, // if you use cookies for auth
// });

import axiosClient from "./axiosClient";


export async function fetchCreditSummary(profile_id) {
  const res = await axiosClient.get("/user/credits", {
    params: { profile_id }, // or omit if backend takes from token
  });
  console.log(res);
  return res.data;
}

export async function createPaymentIntent({ profile_id, pack_id }) {
  const res = await axiosClient.post("/user/credits/payment-intent", {
    profile_id,
    pack_id,
  });
    console.log(res);
  return res.data;
}
