import consts from "@/constants";

const { schemaType } = consts;

const errorDef = {
  title: "Error",
  type: "object",
  properties: {
    message: schemaType.regularString,
    stack: schemaType.regularString,
    clientIp: schemaType.regularString,
    extraInfo: {
      type: "object",
    },
  },
  required: [],
};

export { errorDef };
