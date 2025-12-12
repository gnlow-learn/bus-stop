import raw from "../orig/국토교통부_전국 버스정류장 위치정보_20251031.csv" with { type: "bytes" }

const decode =
(raw: Uint8Array<ArrayBuffer>) =>
    new TextDecoder("euc-kr").decode(raw)

const split =
(str: string) =>
    str
        .split("\r\n")
        .map(x => x.split(","))

const zip =
<T extends unknown[]>(...ass: T[]) =>
    ass[0].map((_, i) => ass.map(x => x[i]))

const wrap =
(data: string[][]) => {
    const [head, ...body] = data
    return body.map(v =>
        Object.fromEntries(
            zip(head, v)
        )
    )
}

export const data = wrap(split(decode(raw)))
