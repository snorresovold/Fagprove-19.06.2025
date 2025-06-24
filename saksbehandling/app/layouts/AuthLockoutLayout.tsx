import React from "react";
import { NavLink, Outlet } from "react-router";
import Header from "~/components/Header";
import { useAuth } from "~/hooks/useAuth";

function AuthLockoutLayout() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="h-screen flex flex-col">
        <nav className="">
          <Header />
        </nav>
        <main className="flex-grow overflow-hidden">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-semibold">Du er ikke logget inn</h2>
        <p className="text-gray-300">
          Logg inn eller lag en bruker for å bruke denne appen.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <NavLink
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-white"
          >
            Logg inn
          </NavLink>
          <NavLink
            to="/register"
            className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-white"
          >
            Registrer
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default AuthLockoutLayout;
