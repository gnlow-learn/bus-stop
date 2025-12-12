import "https://esm.sh/adorable-css@1.6.2"
import { html, render } from "https://esm.sh/lit-html@3.3.1"

import {
    Map,
    View,
    Feature,
} from "https://esm.sh/ol@10.7.0"
import * as layer from "https://esm.sh/ol@10.7.0/layer"
import * as source from "https://esm.sh/ol@10.7.0/source"
import * as geom from "https://esm.sh/ol@10.7.0/geom"
import { transform } from "https://esm.sh/ol@10.7.0/proj"
import * as style from "https://esm.sh/ol@10.7.0/style"

import { parse } from "./src/parse.ts"

const data = parse(
    await fetch("./orig/국토교통부_전국 버스정류장 위치정보_20251031.csv")
        .then(x => x.bytes())
)

const lonLat =
(lon: number, lat: number) =>
    transform(
        [lon, lat],
        "EPSG:4326",
        "EPSG:3857",
    )

const vs = new source.Vector({
    features: data.filter(x => x.위도 && x.경도)
        .map(x => new Feature({
            geometry: new geom.Point(lonLat(x.경도!, x.위도!)),
        })),
})

render(html`
    <app class="vbox(fill) h(100%) b(1)">
        <div id="map" class="h(100%)"/>
    </app>
`, document.body)

export const map = new Map({
    target: "map",
    layers: [
        new layer.Tile({
            source: new source.OSM(),
        }),
        new layer.Vector({
            source: new source.Cluster({
                distance: 20,
                minDistance: 10,
                source: vs,
            }),
            style: feature => new style.Style({
                image: new style.Circle({
                    radius: 10,
                    fill: new style.Fill({ color: "#95c6de" }),
                    stroke: new style.Stroke({ color: "#546771" })
                }),
                text: new style.Text({
                    text: feature.get("features").length+"",
                }),
            })
        })
    ],
    view: new View({
        center: lonLat(128, 36),
        zoom: 7,
    }),
})
