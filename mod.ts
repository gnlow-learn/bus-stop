import { parse } from "./src/parse.ts"
import raw from "./orig/국토교통부_전국 버스정류장 위치정보_20251031.csv?raw" with { type: "bytes" }

const data = parse(raw)

console.log(data[0])
