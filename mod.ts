import { parse } from "./src/parse.ts"
import raw from "https://cdn.jsdelivr.net/gh/gnlow/raw@0.1.0/file/1db7e5d0" with { type: "bytes" }

const data = parse(raw)

console.log(data[0])
