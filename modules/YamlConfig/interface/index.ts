export interface IStep {
  description?: string;
  key: string;
  label?: string;
  options?: { key: string; label: string }[];
  type: string;
}

export interface IStepValue {
  customValue?: any;
  value?: any;
}