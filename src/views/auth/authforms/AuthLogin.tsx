import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:2000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Simpan ke LocalStorage sesuai rekomendasi
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.data));
        
        // Redirect ke Dashboard (Sesuaikan path dashboard kamu)
        navigate("/"); 
      } else {
        // Sesuai response backend kamu: 'massage'
        alert(result.massage || "Login Gagal");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Koneksi ke server gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="Username" value="Username" />
          </div>
          <TextInput
            id="Username"
            type="text"
            sizing="md"
            required
            className="form-control form-rounded-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            required
            className="form-control form-rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </Label>
          </div>
          <Link to={"/"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          color={"primary"} 
          className="w-full bg-primary text-white rounded-xl"
        >
          {loading ? "Processing..." : "Sign in"}
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;