import { useParams } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Posts() {
  const { page } = useParams();
  useDocumentTitle(`Posts Page ${page} | Blink (Vite)`);

  return (
    <div>
      <h1>Posts Page</h1>
      <p>Showing page: {page}</p>
    </div>
  );
}