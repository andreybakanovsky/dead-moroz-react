import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().min(2).max(20),
  email: yup.string().email().required(),
});

export default schema;
