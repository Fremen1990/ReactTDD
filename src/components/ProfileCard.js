import defaultProfileImage from "../assets/profile.png";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Input from "./Input";
import { deleteUser, updateUser } from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";
import { Modal } from "./Modal";
import { useHistory } from "react-router-dom";
import { logoutSuccess, updateSuccess } from "../state/authActions";

function ProfileCard({ user }) {
  const dispatch = useDispatch();
  const {
    id,
    username,
    // header
  } = useSelector((store) => ({
    id: store.id,
    username: store.username,
    // header: store.header, solved with Axios Interceptors
  }));
  const [inEditMode, setInEditMode] = useState(false);
  const [deleteApiProgress, setDeleteApiProgress] = useState(false);
  const [updateApiProgress, setUpdateApiProgress] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [modalVisible, setModalVisible] = useState(false);

  const history = useHistory();

  const onClickSave = async () => {
    setUpdateApiProgress(true);
    try {
      await updateUser(
        id,
        { username: newUsername }
        // , header
      );
      setInEditMode(false);
      dispatch(
        updateSuccess({
          username: newUsername,
        })
      );
    } catch (error) {}
    setUpdateApiProgress(false);
  };

  const onClickCancel = () => {
    setInEditMode(false);
    setNewUsername(username);
  };

  const onClickDelete = async () => {
    setDeleteApiProgress(true);
    try {
      await deleteUser(user.id);
      history.push("/");
      dispatch(logoutSuccess());
    } catch (e) {}
    setDeleteApiProgress(false);
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
          apiProgress={updateApiProgress}
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
          <>
            <div>
              <button
                onClick={() => setInEditMode(true)}
                className="btn btn-outline-success"
              >
                Edit
              </button>
            </div>
            <div className="pt-2">
              <button
                className="btn btn-danger"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={() => setModalVisible(true)}
              >
                Delete My Account
              </button>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
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
        {modalVisible && (
          <Modal
            content="Are you sure to delete your account"
            onClickCancel={() => setModalVisible(false)}
            onClickConfirm={onClickDelete}
            apiProgress={deleteApiProgress}
          />
        )}
        {/*<Modal*/}
        {/*  content="Are you sure to delete your account"*/}
        {/*  onClickCancel={() => setModalVisible(false)}*/}
        {/*/>*/}
      </div>
    </>
  );
}

export default ProfileCard;
