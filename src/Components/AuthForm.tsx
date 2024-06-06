import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignCategory from "../Types/SignCategory";
import { signup, login } from "../Utilities/ConnectionHub";

export default function AuthForm({ category }: { category: SignCategory }) {
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
    setCredential((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (category === SignCategory.SignUp) {
        await signup(credential.email, credential.password);
        navigate("/login");
      } else {
        await login(credential.email, credential.password);
        navigate("/calendarList");
      }
    } catch (error) {
      alert(`${category} failed: ${error}`);
    }
  }
  return (
    <div className="flex flex-col">
      <h1>{category}</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" onChange={handleChange} />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
        />
        <button type="submit">{category}</button>
      </form>
    </div>
  );
}
