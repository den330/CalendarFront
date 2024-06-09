import AuthForm from "../Components/AuthForm";
import SignCategory from "../Types/SignCategory";

export default function Signup() {
  return <AuthForm category={SignCategory.SignUp} />;
}
