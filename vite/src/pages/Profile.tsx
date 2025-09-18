import { useParams } from 'react-router';

export default function Profile() {
  const { username } = useParams();

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Username: @{username}</p>
    </div>
  );
}