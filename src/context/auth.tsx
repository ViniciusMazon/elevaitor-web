import React from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

interface Props {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStorageData() {
      const storageUser = localStorage.getItem('@EAuth:user');
      const storageToken = localStorage.getItem('@EAuth:token');
      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        // api.defaults.headers['Authorization'] = `${storageToken}`;
      }
    }
    loadStorageData();
    setLoading(false);
    console.log('Puxou local storage');
  }, []);

  async function signIn(email: string, password: string) {
    // const response = await api.post('/sign-in', { email, password });
    // setUser(response.data.user);

    const user = {
      name: email,
      email: email,
    };

    setUser(user);
    localStorage.setItem('@EAuth:user', JSON.stringify(user));
    localStorage.setItem('@EAuth:token', 'bearer token');
    console.log('Fez login');

    // api.defaults.headers['Authorization'] = `${response.data.token}`;
    // localStorage.setItem('@RNAuth:user', JSON.stringify(response.data.user));
    // localStorage.setItem('@RNAuth:token', response.data.token);
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  return context;
}