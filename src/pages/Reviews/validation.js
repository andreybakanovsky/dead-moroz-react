import * as yup from "yup";

const schema = yup.object().shape({
  grade: yup
    .number()
    .typeError('grade must be a number')
    .required()
    .min(1)
    .max(10)
    .integer(),
  comment: yup.string().max(1000),
});

export default schema;
