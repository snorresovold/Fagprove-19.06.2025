import React from 'react'
import { NavLink, Outlet } from 'react-router';
import Header from '~/components/Header';
import { useAuth } from '~/hooks/useAuth'

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
      <>
        <p>Du er ikke logget inn, logg inn eller lag en bruker for å bruke denne appen</p>
        <NavLink to="/login" > Logg in </NavLink>
        <NavLink to="/register" > Registrer </NavLink>
      </>
    )
}

export default AuthLockoutLayout