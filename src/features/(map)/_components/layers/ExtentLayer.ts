import { CompositeLayer, COORDINATE_SYSTEM } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";

export class ExtentLayer extends CompositeLayer {
  shouldUpdateState() {
    return true;
  }
  renderLayers() {
    if (this.context) {
      
      return [
        new GeoJsonLayer({
          coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
          // coordinateOrigin: [
          //   this.context.viewport.longitude,
          //   this.context.viewport.latitude,
          // ] as [number, number],
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
                      (this.props as any).extentSize[0] / 2,
                      (this.props as any).extentSize[1] / 2,
                    ],
                    [
                      (this.props as any).extentSize[0] / 2,
                      (-this.props as any).extentSize[1] / 2,
                    ],
                    [
                      (-this.props as any).extentSize[0] / 2,
                      (-this.props as any).extentSize[1] / 2,
                    ],
                    [
                      (-this.props as any).extentSize[0] / 2,
                      (this.props as any).extentSize[1] / 2,
                    ],
                    [
                      (this.props as any).extentSize[0] / 2,
                      (this.props as any).extentSize[1] / 2,
                    ],
                  ],
                ],
                type: "Polygon",
              },
            },
          ],
          getPosition: (d: any) => d.position,
        }),
      ];
    } else {
      return null;
    }
  }
}
