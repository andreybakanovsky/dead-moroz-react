import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().min(2).max(20).required(),
  age: yup.number().required().positive().integer(),
});

export default schema;
