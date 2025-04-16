import {
  createContext,
  useState,
  useContext,
  useSyncExternalStore,
  useEffect,
} from "react";

const AuthContext = createContext();
export default AuthContext;

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

const subscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!getAccessToken());
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [tokenRefresh, setTokenRefresh] = useState(getRefreshToken());

  const accessTokenFromStorage = useSyncExternalStore(
    subscribe,
    getAccessToken
  );
  const refreshTokenFromStorage = useSyncExternalStore(
    subscribe,
    getRefreshToken
  );

  useEffect(() => {
    //console.log(accessToken);
    setLoggedIn(!!accessTokenFromStorage);
    setAccessToken(accessTokenFromStorage);
  }, [accessTokenFromStorage]);

  useEffect(() => {
    setTokenRefresh(refreshTokenFromStorage);
  }, [refreshTokenFromStorage]);

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    setAccessToken(null);
    setTokenRefresh(null);
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, accessToken, tokenRefresh, setLoggedIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
