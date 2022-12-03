import defaultProfileImage from "../assets/profile.png";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Input from "./Input";
import { updateUser } from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";

function ProfileCard({ user }) {
  const dispatch = useDispatch();
  const { id, username,
      // header
  } = useSelector((store) => ({
    id: store.id,
    username: store.username,
    // header: store.header, solved with Axios Interceptors
  }));
  const [inEditMode, setInEditMode] = useState(false);
  const [apiProgress, setApiProgress] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);

  const onClickSave = async () => {
    setApiProgress(true);
    try {
      await updateUser(id, { username: newUsername }
          // , header
      );
      setInEditMode(false);
      dispatch({
        type: "user-update-success",
        payload: { username: newUsername },
      });
    } catch (error) {}
    setApiProgress(false);
  };

  const onClickCancel = () => {
    setInEditMode(false);
    setNewUsername(username);
  };

  let content;
  if (inEditMode) {
    content = (
      <>
        <Input
          label="Change your username"
          id="username"
          initialValue={newUsername}
          onChange={({ target }) => setNewUsername(target.value)}
        />
        <ButtonWithProgress
          className="btn btn-primary"
          onClick={onClickSave}
          apiProgress={apiProgress}
        >
          Save
        </ButtonWithProgress>
        <button className="btn btn-outline-secondary" onClick={onClickCancel}>
          Cancel
        </button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{newUsername}</h3>
        {user.id === id && (
          <button
            onClick={() => setInEditMode(true)}
            className="btn btn-outline-success"
          >
            Edit
          </button>
        )}
      </>
    );
  }

  return (
    <div className="card text-center">
      <div className="card-header">
        <img
          src={defaultProfileImage}
          alt="profile"
          width="200"
          height="200"
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body">{content}</div>
    </div>
  );
}

export default ProfileCard;
