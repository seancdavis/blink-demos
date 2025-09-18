import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Register() {
  useDocumentTitle('Register | Blink (Vite)');

  return (
    <div>
      <h1>Register Page</h1>
      <p>Create a new account</p>
    </div>
  );
}