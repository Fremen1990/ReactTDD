import { Component } from "react";
import { getUserById } from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import async from "async";
import { response } from "msw";

class UserPage extends Component {
  state = {
    user: {},
    pendingApiCall: false,
    failResponse: undefined,
  };
  componentDidMount() {
    this.loadUser();
  }

  // todo 80. Fix - Reload User After Navigation
  // async componentDidUpdate(previousProps, previousState) {
  //   this.setState({ pendingApiCall: true });
  //   try {
  //     const response = await getUserById(this.props.match.params.id);
  //     this.setState({ user: response.data });
  //   } catch (error) {
  //     this.setState({ failResponse: error.response.data.message });
  //   }
  //   this.setState({ pendingApiCall: false });
  // }

  loadUser = async () => {
    this.setState({ pendingApiCall: true });
    try {
      const response = await getUserById(this.props.match.params.id);
      this.setState({ user: response.data });
    } catch (error) {
      this.setState({ failResponse: error.response.data.message });
    }
    this.setState({ pendingApiCall: false });
  };

  render() {
    const { user, pendingApiCall, failResponse } = this.state;

    let content = (
      <Alert type="secondary" center>
        <Spinner size="big" />
      </Alert>
    );

    if (!pendingApiCall) {
      if (failResponse) {
        content = (
          <Alert type="danger" center>
            {failResponse}{" "}
          </Alert>
        );
      } else {
        content = <ProfileCard user={user} />;
      }
    }

    return <div data-testid="user-page">{content}</div>;
  }
}

export default UserPage;
