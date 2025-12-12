import * as z from "https://esm.sh/zod@4.1.13"

const decode =
(raw: Uint8Array<ArrayBuffer>) =>
    new TextDecoder("euc-kr").decode(raw)

const split =
(str: string) =>
    str
        .trim()
        .split("\r\n")
        .map(x =>
            x.split(/,(?<=".*".*)|,(?=.*".*")|,(?<!".*)(?!.*")/gm)
            .map(y => y || undefined)
        )

const zip =
<T extends unknown[]>(...ass: T[]) =>
    ass[0].map((_, i) => ass.map(x => x[i]))

const wrap =
<T>(data: T[][]) => {
    const [head, ...body] = data
    return body.map(v =>
        Object.fromEntries(
            zip(head, v)
        )
    )
}

export type Raw = z.infer<typeof Raw>

const lonLatFix =
(raw: Raw) => {
    if (raw.위도 && raw.경도) {
        if (Number(raw.위도) > Number(raw.경도)) {
            console.log("lonLatFix(swap)", raw.정류장명)
            return {
                ...raw,
                위도: raw.경도,
                경도: raw.위도,
            }
        }
        if (raw.위도 == raw.경도) {
            console.log("lonLatFix(naaa)", raw.정류장명)
            return {
                ...raw,
                위도: undefined,
                경도: undefined,
            }
        }
    }
    return raw
}

const Raw = z.object({
    정류장번호:     z.string(),
    정류장명:       z.string(),
    위도:          z.coerce.number().min(33).max(39).optional(),
    경도:          z.coerce.number().min(125).max(132).optional(),
    정보수집일:     z.coerce.date(),
    모바일단축번호:  z.string().optional(),
    도시코드:       z.string(),
    도시명:        z.string(),
    관리도시명:     z.string(),
})

export const parse =
(raw: Uint8Array<ArrayBuffer>) =>
    z.array(Raw).parse(
        wrap(split(decode(raw)))
            .map(lonLatFix)
    )
