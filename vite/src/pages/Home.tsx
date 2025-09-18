import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle('Home | Blink (Vite)');

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page</p>
    </div>
  );
}