import figma from "@figma/code-connect/react";
import { DetailsField } from "./DetailsField";

// Figma component: Inputs (page node 6:3038) — DetailsField maps to the inline-editable input pattern
figma.connect(DetailsField, "https://www.figma.com/design/KP2YfQWZ7kQc4MpWVbHcBn/Strawberry-Portal?node-id=6:3038", {
  props: {
    label: figma.string("Label"),
    value: figma.string("Value"),
    fieldType: figma.enum("Type", {
      Text: "text",
      Number: "number",
      Select: "select",
      Textarea: "textarea",
      Checkbox: "checkbox",
      Link: "link",
    }),
    editable: figma.boolean("Editable"),
    hasInfo: figma.boolean("Has Info"),
    infoText: figma.string("Info Text"),
    tooltipPosition: figma.enum("Tooltip Position", {
      Top: "top",
      Right: "right",
      Bottom: "bottom",
      Left: "left",
    }),
  },
  example: (props) => (
    <DetailsField
      id="field_id"
      label={props.label}
      value={props.value}
      fieldType={props.fieldType}
      editable={props.editable}
      hasInfo={props.hasInfo}
      infoText={props.infoText}
      tooltipPosition={props.tooltipPosition}
    />
  ),
});
