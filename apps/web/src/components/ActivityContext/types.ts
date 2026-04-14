export interface ActivityState {
  state: "Idle" | "Active" | "Prompted";
  remaining: number;
  open: boolean;
}
