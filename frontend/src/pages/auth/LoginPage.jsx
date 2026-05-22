import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./LoginPage.css";

const LoginPage = () => {
  // ✅ Direct backend URL
  const API_BASE = "http://localhost:5000";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid username or password");
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setTimeout(() => {
        navigate("/home");
      }, 500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          
          <div className="logo-container" style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="Logo"
              className="w-52 h-17 object-contain mx-auto"
            />
          </div>

          <h1 className="login-header">Login</h1>

          <label className="input-field">
            <MdOutlineMail />
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              required
            />
          </label>

          <label className="input-field">
            <MdPassword />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>

          <button className="login-button" type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Login"}
          </button>

          {isError && (
            <p className="error-message">
              {error?.message || "Login failed"}
            </p>
          )}
        </form>

        <div className="signup-container">
          <p>Don't have an account?</p>
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;