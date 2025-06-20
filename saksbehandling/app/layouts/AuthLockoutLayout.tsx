import React from 'react'
import { NavLink } from 'react-router';
import Header from '~/components/Header';
import { useAuth } from '~/hooks/useAuth'

function AuthLockoutLayout({ children }: React.PropsWithChildren<{}>) {
    const { user } = useAuth();

    if (user) {
      return (
        <>
        <Header />
          {children}
        </>
      )
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