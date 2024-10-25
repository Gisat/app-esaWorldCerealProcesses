import { distance } from "@turf/distance";
import { Coord } from "@turf/helpers";

export const getPoinsDistance = (point1: Coord, point2: Coord) => {
  return distance(point1, point2, { units: "meters" });
};
