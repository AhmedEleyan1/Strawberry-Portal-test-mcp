import figma from "@figma/code-connect/react";
import { CustomSelect } from "./CustomSelect";

// Figma component: Dropdowns (page node 6:3039)
figma.connect(CustomSelect, "https://www.figma.com/design/KP2YfQWZ7kQc4MpWVbHcBn/Strawberry-Portal?node-id=6:3039", {
  props: {
    selectedLabel: figma.string("Selected Label"),
    items: figma.string("Items"),
  },
  example: (props) => (
    <CustomSelect
      selectedLabel={props.selectedLabel}
      items={["Option 1", "Option 2", "Option 3"]}
      onSelect={(value) => console.log(value)}
      id="select-id"
    />
  ),
});
