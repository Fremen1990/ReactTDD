import { Component } from "react";
import { getUserById } from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";

class UserPage extends Component {
  state = {
    user: {},
  };

  async componentDidMount() {
    try {
      const response = await getUserById(this.props.match.params.id);
      this.setState({ user: response.data });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { user } = this.state;
    return (
      <div data-testid="user-page">
        <ProfileCard user={user} />
        {user.username}
      </div>
    );
  }
}

export default UserPage;
