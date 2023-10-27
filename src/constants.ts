const consts = {
  collections: {
    errors: "errors",
  },
  schemaType: {
    regularString: {
      type: "string",
    },
    nullableString: {
      type: ["string", "null"],
    },
    phone: {
      type: ["string", "null"],
      pattern: "^[0-9]{10}$",
    },
    noNegetiveNumber: {
      type: "number",
      min: 0,
    },
  },
};

export default consts;
