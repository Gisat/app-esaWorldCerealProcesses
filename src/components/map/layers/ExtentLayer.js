import { CompositeLayer } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { COORDINATE_SYSTEM } from "@deck.gl/core";

export default class ExtentLayer extends CompositeLayer {
  shouldUpdateState() {
    return true;
  }
  renderLayers(data) {
    if (this.context) {
      return [
        new GeoJsonLayer({
          coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
          coordinateOrigin: [
            this.context.viewport.longitude,
            this.context.viewport.latitude,
          ],
          getLineColor: [0, 0, 0],
          getLineWidth: 5,
          lineWidthUnits: "pixels",
          filled: false,
          data: [
            {
              type: "Feature",
              properties: { id: 1 },
              geometry: {
                coordinates: [
                  [
                    [
                      this.props.extentSize[0] / 2,
                      this.props.extentSize[1] / 2,
                    ],
                    [
                      this.props.extentSize[0] / 2,
                      -this.props.extentSize[1] / 2,
                    ],
                    [
                      -this.props.extentSize[0] / 2,
                      -this.props.extentSize[1] / 2,
                    ],
                    [
                      -this.props.extentSize[0] / 2,
                      this.props.extentSize[1] / 2,
                    ],
                    [
                      this.props.extentSize[0] / 2,
                      this.props.extentSize[1] / 2,
                    ],
                  ],
                ],
                type: "Polygon",
              },
            },
          ],
          getPosition: (d) => d.position,
        }),
      ];
    } else {
      return null;
    }
  }
}
