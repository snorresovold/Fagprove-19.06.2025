import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "FirebaseConfig";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vær så snill å legg inn både passord og email.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("logget inn som:", userCredential.user.email);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("login feilet, sjekk email og passordet ditt.");
    }
  };

  return (
<div className="flex justify-center items-center min-h-screen bg-base-200">
  <div className="card w-full max-w-sm bg-base-100 shadow-xl p-8 rounded-2xl">
    <h2 className="text-3xl font-bold text-center mb-6">Logg inn</h2>
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="label-text block mb-1 font-medium">
          E-post
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="din@epost.no"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white text-black rounded border border-gray-300 p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="label-text block mb-1 font-medium">
          Passord
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white text-black rounded border border-gray-300 p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-white text-black rounded border border-gray-300 py-2 px-4 mt-2 hover:bg-gray-100 hover:cursor-pointer"
      >
        Logg inn
      </button>
    </form>
  </div>
</div>
  );
}

export default Login;