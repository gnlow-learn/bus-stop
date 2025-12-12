import "https://esm.sh/adorable-css@1.6.2"
import { html, render } from "https://esm.sh/lit-html@3.3.1"

import {
    Map,
    View,
} from "https://esm.sh/ol@10.7.0"
import TileLayer from "https://esm.sh/ol@10.7.0/layer/Tile"
import OSM from "https://esm.sh/ol@10.7.0/source/OSM"
import { transform } from "https://esm.sh/ol@10.7.0/proj"

const lonLat =
(lon: number, lat: number) =>
    transform(
        [lon, lat],
        "EPSG:4326",
        "EPSG:3857",
    )

render(html`
    <app class="vbox(fill) h(100%) b(1)">
        <div id="map" class="h(100%)"/>
    </app>
`, document.body)

export const map = new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    view: new View({
        center: lonLat(128, 36),
        zoom: 7,
    }),
})
