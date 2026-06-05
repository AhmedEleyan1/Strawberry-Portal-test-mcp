import figma from "@figma/code-connect/react";
import { Card } from "./Card";

// Figma component: Cards (page node 6:3041)
figma.connect(Card, "https://www.figma.com/design/KP2YfQWZ7kQc4MpWVbHcBn/Strawberry-Portal?node-id=6:3041", {
  props: {
    className: figma.string("ClassName"),
    children: figma.children("*"),
  },
  example: (props) => (
    <Card className={props.className}>
      {props.children}
    </Card>
  ),
});
