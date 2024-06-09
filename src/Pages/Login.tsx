import AuthForm from "../Components/AuthForm";
import SignCategory from "../Types/SignCategory";

export default function Login() {
  return <AuthForm category={SignCategory.SignIn} />;
}
