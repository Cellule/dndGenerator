export default function chooseRandomWithWeight(arr, totalWeight) {
  var rnum = ((Math.random() * totalWeight) + 1) | 0;
  var i = 0;
  while(rnum > 0) {
    rnum -= arr[i++].w;
  }
  return arr[i - 1].v;
}
