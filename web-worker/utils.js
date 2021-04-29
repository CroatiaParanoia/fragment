function arraybuffer2String(buf) {
  return new Promise((resolve) => {
    const b = new Blob([buf]);
    const r = new FileReader();
    r.onload = function (e) {
      resolve(e.target.result);
    };
    r.readAsText(b, "utf-8");
  });
}

function string2Arraybuffer(str) {
  return new Promise((resolve) => {
    var b = new Blob([str]);
    var f = new FileReader();
    f.onload = function (e) {
      resolve(e.target.result);
    };
    f.readAsArrayBuffer(b);
  });
}
