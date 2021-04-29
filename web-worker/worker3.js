/* worker3.js */
importScripts("./queryCities.js");

self.onmessage = async function (oEvent) {
  const { keywords, value } = oEvent.data;

  self.postMessage(queryCities(keywords, value));

  self.close();
};
