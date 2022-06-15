import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().min(2).max(20).required(),
  age: yup
    .number()
    .typeError('age must be a number')
    .required()
    .positive()
    .integer(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  password_confirmation: yup.string().min(6).required(),
});

export default schema;
