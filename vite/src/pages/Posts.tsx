import { useParams } from 'react-router';

export default function Posts() {
  const { page } = useParams();

  return (
    <div>
      <h1>Posts Page</h1>
      <p>Showing page: {page}</p>
    </div>
  );
}