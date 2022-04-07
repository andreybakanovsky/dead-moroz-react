import * as yup from "yup";
const year = new Date().getFullYear();

const schema = yup.object().shape({
  name: yup.string().max(100).required(),
  description: yup.string().max(1000),
});

export default schema;
