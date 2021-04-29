/* worker2.js */
importScripts("./utils.js");
importScripts("./queryCities.js");

self.onmessage = async function (oEvent) {
  const { keywords, value } = oEvent.data;
  const addressList = await arraybuffer2String(value);

  self.postMessage(queryCities(keywords, JSON.parse(addressList)));

  self.close();
};
