async function queryAddressList() {
  return fetch("./cities.json").then((res) => res.json());
}

const input = document.querySelector("input");

let addressJson = [];

queryAddressList().then((res) => {
  addressJson = Array(10).fill(res).flat();
});

// 根据数据创建 blob 本地url， webworker 端再进行请求
async function queryByWebWorker1() {
  const blob = new Blob([JSON.stringify(addressJson)]);
  const url = URL.createObjectURL(blob);

  const worker = new Worker("./worker.js");
  console.log("---------- start ----------");
  worker.postMessage({
    payload: { path: url, keywords: input.value },
    type: "queryByKeywords",
  });
  console.time("webworker1");
  worker.onmessage = function (event) {
    console.timeEnd("webworker1");
    console.log(event.data.length, "查询结果数据长度");
    console.log("---------- end ----------");
  };
}

// 将数据转为 arrayBuffer 进行传输，worker端再进行to string处理
async function queryByWebWorker2() {
  const arraybuffer = await string2Arraybuffer(JSON.stringify(addressJson));
  const worker = new Worker("./worker2.js");

  console.log("---------- start ----------");
  worker.postMessage({ value: arraybuffer, keywords: input.value }, [
    arraybuffer,
  ]);

  console.time("webworker2");
  worker.onmessage = function (event) {
    console.timeEnd("webworker2");
    console.log(event.data.length, "查询结果数据长度");
    console.log("---------- end ----------");
  };
}
// 将数据直接传输，不过注意此传输为按值拷贝，而不是拷贝内存地址。js运行环境和 worker运行环境不一致
async function queryByWebWorker3() {
  const worker = new Worker("./worker3.js");

  console.log("---------- start ----------");
  worker.postMessage({ value: addressJson, keywords: input.value });
  console.time("webworker3");
  worker.onmessage = function (event) {
    console.timeEnd("webworker3");
    console.log(event.data.length, "查询结果数据长度");
    console.log("---------- end ----------");
  };
}
// 本地js查询
async function queryByLocal() {
  console.log("---------- start ----------");
  console.time("local");
  const value = queryCities(input.value, addressJson);
  console.timeEnd("local");
  console.log(value.length, "查询结果数据长度");
  console.log("---------- end ----------");
}

const list = [
  {
    selector: "#webworker1",
    label: "webworker1",
    onClick: queryByWebWorker1,
  },
  {
    selector: "#webworker2",
    label: "webworker2",
    onClick: queryByWebWorker2,
  },
  {
    selector: "#webworker3",
    label: "webworker3",
    onClick: queryByWebWorker3,
  },
  {
    selector: "#local",
    label: "本地js查询",
    onClick: queryByLocal,
  },
];

function init(ls) {
  const root = document.querySelector("#root");
  const fragment = document.createDocumentFragment();

  ls.forEach((element) => {
    const btn = document.createElement("button");

    btn.addEventListener("click", element.onClick);
    btn.innerText = element.label;

    fragment.append(btn);
  });

  root.append(fragment);
}

init(list);
