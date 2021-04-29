/* worker1.js */
importScripts("./queryCities.js");

async function queryAddressList(url) {
  return fetch(url).then((res) => res.json());
}

self.onmessage = async function (oEvent) {
  const { type, payload } = oEvent.data;
  const addressList = await queryAddressList(payload.path);

  if (type === "queryByKeywords") {
    const { keywords } = payload;
    self.postMessage(queryCities(keywords, addressList));
    self.close();
  }
};
