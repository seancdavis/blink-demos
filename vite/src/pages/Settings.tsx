import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Settings() {
  useDocumentTitle('Settings | Blink (Vite)');

  return (
    <div>
      <h1>Settings Page</h1>
      <p>Manage your account settings</p>
    </div>
  );
}