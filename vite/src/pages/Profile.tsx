import { useParams } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Profile() {
  const { username } = useParams();
  useDocumentTitle(`@${username} | Blink (Vite)`);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Username: @{username}</p>
    </div>
  );
}