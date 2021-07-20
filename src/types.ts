import { Position } from "css";

export interface Property {
  property: string;
  value: string;
  position: PositionInfo;
}

export interface RuleSet {
  selectors: Array<string>;
  rules: Array<Property>;
}

export interface PositionInfo {
  start?: Position | undefined;
  end?: Position | undefined;
  source?: string | undefined;
  content?: string | undefined;
}
