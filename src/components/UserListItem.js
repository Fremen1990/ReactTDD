import { withRouter } from "react-router-dom";
import defaultProfileImage from "../assets/profile.png";

function UserListItem({ user, history }) {
  return (
    <li
      className="list-group-item list-group-item-action"
      key={user.id}
      onClick={() => history.push(`/user/${user.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/*<Link to={`/user/${user.id}`}>{user.username}</Link>*/}
      <img
        src={defaultProfileImage}
        alt="profile"
        width="30"
        className="rounded-circle shadow-sm"
      />
      {user.username}
    </li>
  );
}

export default withRouter(UserListItem);
