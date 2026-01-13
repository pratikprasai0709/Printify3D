import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError, AxiosResponse } from "axios";
import { registerApi } from "../../shared/config/api";


function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

const [errorMsg, setErrorMsg] = useState("");
const [successMsg, setSuccessMsg] = useState("");


  const navigate = useNavigate();

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  setErrorMsg("");
  setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Send only what backend needs
    const payload = {
      username: formData.username,
      password: formData.password,
    };

    registerApi(payload)
      .then((res: AxiosResponse<any>) => {
        // If your backend returns token + user on register, store it (same as login).
        if (res.data?.token) localStorage.setItem("token", res.data.token);
        if (res.data?.userData)
          localStorage.setItem("currentUser", JSON.stringify(res.data.userData));

        alert(res.data?.message || "Register successful");

        // Common flows:
        // 1) Go to login page after successful registration:
        navigate("/login");
        // OR 2) go home directly if token is returned:
        // navigate("/");
      })
      .catch((err: AxiosError<any>) => {

        console.log("AXIOS ERROR:", err);
        console.log("status:", err.response?.status);
        console.log("data:", err.response?.data);
        console.log("request:", err.request);
        console.log("message:", err.message);
        alert(err.response?.data?.message || "Register failed");
      });
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-900">
      <form className="bg-white p-6 rounded w-80" onSubmit={submit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChanges}
          name="username"
          value={formData.username}
          placeholder="Username"
          type="text"
          required
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChanges}
          name="password"
          value={formData.password}
          placeholder="Password"
          type="password"
          required
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChanges}
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm Password"
          type="password"
          required
        />

        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default Register;
