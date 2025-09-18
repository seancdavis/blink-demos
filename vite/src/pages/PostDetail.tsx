import { useParams } from 'react-router';

export default function PostDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Post Detail</h1>
      <p>Post ID: {id}</p>
    </div>
  );
}