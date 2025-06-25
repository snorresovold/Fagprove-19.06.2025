import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Dropdown from "~/components/Dropdown";
import type { UserRole } from "~/interfaces/interfaces";

function Registration() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<UserRole>();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRoleSelect = (role: UserRole) => {
    console.log("Selected role:", role);
    setSelectedRole(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !selectedRole) {
      return alert(
        "Vær så snill å legg inn både passord, email og velg en rolle."
      );
    }

    if (password !== confirmPassword) {
      return alert("Passordene stemmer ikke overens. Vennligst prøv igjen.");
    }

    if (password.length < 6) {
      return alert("Passordet må være minst 6 tegn langt.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: user.email,
        role: selectedRole,
        createdAt: new Date().toISOString(),
      });

      navigate("/");
    } catch (error: any) {
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-center">Registrer</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="label text-sm font-medium">
              E-post
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full bg-white text-black rounded border border-gray-300"
              required
              autoComplete="email"
              placeholder="din@email.no"
            />
          </div>

          <div>
            <label htmlFor="password" className="label text-sm font-medium">
              Passord
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full bg-white text-black rounded border border-gray-300"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Minst 6 tegn"
            />
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="label text-sm font-medium"
            >
              Bekreft passord
            </label>
            <input
              id="confirm_password"
              type="password"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input w-full bg-white text-black rounded border border-gray-300"
              required
              minLength={6}
              placeholder="Bekreft passord"
            />
          </div>

          <p>Rolle</p>
          <Dropdown onRoleSelect={handleRoleSelect} />

          <p className="text-xs mt-2 text-center">
            Ved å registrere deg godtar du vår{" "}
            <a href="/personvern" className="underline text-blue-600">
              personvernerklæring
            </a>
            .
          </p>

          <button
            type="submit"
            className="w-full bg-white text-black rounded border border-gray-300 py-2 px-4 hover:bg-gray-100"
          >
            Registrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
