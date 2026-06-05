import figma from "@figma/code-connect/react";
import { StatusBadge } from "./StatusBadge";

// Figma component set: Badges (page node 6:3037)
figma.connect(StatusBadge, "https://www.figma.com/design/KP2YfQWZ7kQc4MpWVbHcBn/Strawberry-Portal?node-id=6:3037", {
  props: {
    status: figma.string("Status"),
  },
  example: (props) => (
    <StatusBadge status={props.status} />
  ),
});
