import * as yup from "yup";
const year = new Date().getFullYear();

const schema = yup.object().shape({
  year: yup.number().required().min(2000).max(year).integer(),
  content: yup.string().max(1000),
});

export default schema;
