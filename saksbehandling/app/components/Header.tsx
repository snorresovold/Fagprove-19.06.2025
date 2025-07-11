import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "FirebaseConfig";
import { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogOutPopup, setShowLogOutPopup] = useState(false);
  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);
  const { user, logout, deleteAccount, loading } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/";

  const handleLogout = () => {
    logout();
    setShowLogOutPopup(false);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    setShowDeleteAccountPopup(false);
  };

  if (loading) {
    return <div className="loader">Loading...</div>; // Replace with your loading component
  }

  return (
    <header className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Back button */}
          <div>
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Tilbake
              </button>
            )}
          </div>

          {/* Right side: User info and dropdown */}
          <div className="relative">
            {user!.email}
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              type="button"
              className="overflow-hidden rounded-full border border-gray-300 shadow-inner dark:border-gray-600 ml-4"
            >
              <span className="sr-only">User menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 120"
                className="w-12 h-12"
                fill="currentColor"
              >
                <path
                  d="M12.26,21.44C29.87,2.01,50.18-8.56,65.43,8.73
                    c4,0.19,7.57,1.52,10.57,4.34c6.28,5.89,7.23,16.92,4.38,25.69v7.63
                    c1.94,1.27,3.18,3.66,3.76,6.39c0.37,1.76,0.46,3.69,0.29,5.54
                    c-0.18,1.91-0.65,3.75-1.41,5.24c-1.09,2.15-2.75,3.66-5,3.99
                    c-2.2,2.34-4.35,4.84-6.28,7.26c-2.11,2.65-3.92,5.16-5.16,7.21
                    c-0.96,1.59-0.66,2.63-0.31,3.81c0.17,0.59,0.35,1.2,0.48,1.88
                    c3.85,0.84,7.34,1.49,10.47,2.08c19.87,3.72,26.03,4.87,26.03,30.71
                    c0,1.32-1.07,2.38-2.38,2.38H51.62H2.38c-1.32,0-2.38-1.07-2.38-2.38
                    C0,94.66,6.16,93.5,26.03,89.78c3.15-0.59,6.66-1.25,10.54-2.09
                    c0.13-0.51,0.3-0.99,0.47-1.47c0.4-1.14,0.8-2.28-0.37-4.2
                    c-1.24-2.05-3.05-4.56-5.16-7.21c-1.92-2.42-4.08-4.92-6.28-7.26
                    c-2.25-0.33-3.91-1.85-5-3.99c-0.76-1.5-1.23-3.34-1.41-5.24
                    c-0.18-1.85-0.08-3.78,0.29-5.54c0.57-2.72,1.8-5.09,3.72-6.37
                    l-2.58-1.53C19.56,37.23,21.57,23.95,12.26,21.44z
                    M75.62,36.7c-0.43-3.15-1.25-5.79-2.42-8c-1.5-1.87-3.68-3.46-6.48-5.51
                    l-0.32-0.23c-0.59-0.44-1.19-0.85-1.79-1.23c-9.42,6.11-13.98,4.68-21.58,5.93
                    c-6.89,1.13-12.48,3.69-15.41,8.37v11.5c0,1.13-0.79,2.08-1.85,2.32
                    c-0.96,0.29-1.65,1.73-2.02,3.53c-0.27,1.31-0.34,2.75-0.21,4.13
                    c0.13,1.32,0.43,2.56,0.93,3.53c0.44,0.87,1.01,1.46,1.67,1.47l0.14,0
                    c0.69-0.01,1.32,0.27,1.76,0.74l0,0c2.52,2.65,5.01,5.51,7.19,8.25
                    c2.19,2.75,4.11,5.43,5.49,7.71c2.33,3.84,1.56,6.03,0.8,8.22
                    c-0.22,0.63-0.44,1.27-0.44,1.87c0,1.2-0.89,2.19-2.04,2.36
                    c-4.59,1.03-8.59,1.78-12.13,2.44C10.64,97.5,5.18,98.53,4.79,118.12h46.83
                    h46.83C98.06,98.53,92.6,97.5,76.34,94.45c-3.58-0.67-7.64-1.43-12.31-2.48
                    c-1.1-0.25-1.86-1.23-1.85-2.32h-0.01c0-0.93-0.24-1.74-0.46-2.5
                    c-0.65-2.23-1.23-4.21,0.81-7.58c1.38-2.28,3.3-4.96,5.49-7.71
                    c2.18-2.74,4.67-5.6,7.19-8.25c0.51-0.53,1.2-0.78,1.88-0.73l0.01,0
                    c0.66-0.01,1.23-0.6,1.67-1.47c0.49-0.97,0.8-2.21,0.93-3.53
                    c0.13-1.38,0.06-2.82-0.21-4.13c-0.38-1.83-1.09-3.29-2.07-3.54
                    c-1.08-0.27-1.8-1.24-1.8-2.31h0V36.7z"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <ul className="py-1">
                  <li>
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (user!.email) {
                          try {
                            await sendPasswordResetEmail(auth, user!.email);
                            alert(
                              "Du vil få en e-post for å tilbakestille passordet ditt snart."
                            );
                          } catch (error: any) {
                            alert(error.code + ": " + error.message);
                          }
                        }
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Reset passord
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDropdown(false);
                        setShowLogOutPopup(true);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logg ut
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDropdown(false);
                        setShowDeleteAccountPopup(true);
                      }}
                      className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Slett konto
                    </a>
                  </li>
                </ul>
              </div>
            )}

            {/* Logout Confirmation Popup */}
            {showLogOutPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Logg ut
                  </h2>
                  <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Er du sikker på at du vil logge ut?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowLogOutPopup(false)}
                      className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      Avbryt
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Logg ut
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Account Confirmation Popup */}
            {showDeleteAccountPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Slett konto
                  </h2>
                  <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Er du sikker på at du vil slette kontoen din? Dette kan ikke
                    angres.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDeleteAccountPopup(false)}
                      className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      Avbryt
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Slett konto
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
