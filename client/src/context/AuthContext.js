import { useAuth } from "../context/auth-context";

export default function AuthContext(Component) {
  return function WrappedComponent(props) {
    const authCreds = useAuth();
    return <Component {...props} authCreds={authCreds} />;
  };
}
