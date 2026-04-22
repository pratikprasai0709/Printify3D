import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../shared/config/api";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Send only what backend needs
    const payload = {
      username: formData.username,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
    };

    registerApi(payload)
      .then((res: AxiosResponse<any>) => {
        // If your backend returns token + user on register, store it (same as login).
        if (res.data?.token) localStorage.setItem("token", res.data.token);
        if (res.data?.userData)
          localStorage.setItem("currentUser", JSON.stringify(res.data.userData));

        toast.success(res.data?.message || "Register successful");

        // Common flows:
        // 1) Go to login page after successful registration:
        navigate("/login");
      })
      .catch((err: AxiosError<any>) => {

        console.log("AXIOS ERROR:", err);
        console.log("status:", err.response?.status);
        console.log("data:", err.response?.data);
        console.log("request:", err.request);
        console.log("message:", err.message);
        toast.error(err.response?.data?.message || "Register failed");
      });
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-100">
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
          name="phoneNumber"
          value={formData.phoneNumber}
          placeholder="Phone Number (10 digits)"
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-gray-800"
          type="submit"
        >
          Signup
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
