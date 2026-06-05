import figma from "@figma/code-connect/react";
import { InfoBubble } from "./InfoBubble";

// Figma component: alert / info (node 96:19177)
figma.connect(InfoBubble, "https://www.figma.com/design/KP2YfQWZ7kQc4MpWVbHcBn/Strawberry-Portal?node-id=96:19177", {
  props: {
    text: figma.string("Text"),
    position: figma.enum("Position", {
      top: "top",
      bottom: "bottom",
      left: "left",
      right: "right",
    }),
  },
  example: (props) => (
    <InfoBubble text={props.text} position={props.position} />
  ),
});
