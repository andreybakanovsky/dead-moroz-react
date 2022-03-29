import * as yup from "yup";

const schema = yup.object().shape({
  grade: yup.string().min(1).max(10).required(),
  comment: yup.string().max(1000),
});

export default schema;
