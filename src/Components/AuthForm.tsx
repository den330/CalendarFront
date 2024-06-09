import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignCategory from "../Types/SignCategory";
import { signup, login } from "../Utilities/ConnectionHub";
import { useLogInContext } from "../CustomHooks/useLogInContext";

export default function AuthForm({ category }: { category: SignCategory }) {
  const { setLoggedIn } = useLogInContext();
  const navigate = useNavigate();
  interface Credential {
    email: string;
    password: string;
  }
  const [credential, setCredential] = useState<Credential>({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCredential((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  async function logInFlow() {
    const response = await login(credential.email, credential.password);
    const userId = response.data.userId;
    setLoggedIn({ status: true, userId });
    navigate("/calendarList");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (credential.email.endsWith("@gmail.com")) {
      alert("Please use the Google Sign Up/In button");
      return;
    }
    try {
      if (category === SignCategory.SignUp) {
        await signup(credential.email, credential.password);
      }
      await logInFlow();
    } catch (error) {
      alert(`${category} failed: ${error}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          {category}
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {category}
          </button>
        </form>
      </div>
    </div>
  );
}
