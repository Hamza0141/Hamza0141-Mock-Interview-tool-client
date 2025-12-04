import axiosClient from "./axiosClient";

export async function fetchCreditPacks() {

  const res = await axiosClient.get("/credit-packs");
  return res.data; 
}

export async function createPaymentIntent({ profile_id, pack_id }) {
  const res = await axiosClient.post("/user/credits/payment-intent", {
    profile_id,
    pack_id,
  });
  return res.data; // { success, clientSecret, ... }
}

export async function fetchTransactionStatus(paymentIntentId) {
  const res = await axiosClient.get(
    `/user/credits/transaction-status/${paymentIntentId}`
  );
  return res.data; // { success, status }
}
