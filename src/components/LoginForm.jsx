import { useState } from "react";
import { login } from "../utils/api";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";

export const LoginForm = ({ onAuth }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login(form);
      onAuth && onAuth(res.user);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login Error"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-start flex-col">
      <input
        name="email"
        type="email"
        placeholder="E-Mail"
        value={form.email}
        onChange={handleChange}
        autoComplete="off"
        required
        className="p-1 rounded focus:ring-1 focus:ring-[var(--color-b-shadow)] focus:border-[var(--color-b-shadow)] outline-none w-full bg-white/10"
      />
      <div className="relative">
        <input
          className="p-1 rounded focus:ring-1 focus:ring-[var(--color-b-shadow)] focus:border-[var(--color-b-shadow)] outline-none w-full bg-white/10"
          type={show ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          name="password"
          placeholder="Passwort"
          required
        />
        <span
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-2 cursor-pointer"
        >
          {show ? <BsEyeFill /> : <BsEyeSlash />}
        </span>
      </div>
      <button
        type="submit"
        className="p-1.5 w-full hover:shadow-[0_0_10px_#00FFFF] rounded bg-[var(--color-b-shadow)] text-[var(--color-b)] hover:drop-shadow-lg transition hover:text-white hover:bg-white/20"
      >
        Login
      </button>
      {error && <div className="text-red-700">{error}</div>}
    </form>
  );
};
