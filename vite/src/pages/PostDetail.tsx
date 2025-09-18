import { useParams } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function PostDetail() {
  const { id } = useParams();
  useDocumentTitle(`Post ${id} | Blink (Vite)`);

  return (
    <div>
      <h1>Post Detail</h1>
      <p>Post ID: {id}</p>
    </div>
  );
}