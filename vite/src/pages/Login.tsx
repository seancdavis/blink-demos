import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Login() {
  useDocumentTitle('Login | Blink (Vite)');

  return (
    <div>
      <h1>Login Page</h1>
      <p>Please log in to your account</p>
    </div>
  );
}