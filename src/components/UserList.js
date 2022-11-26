import { Component } from "react";
import { loadUsers } from "../api/apiCalls";
import UserListItem from "./UserListItem";
import { withTranslation } from "react-i18next";
import Spinner from "./Spinner";

class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
    pendingApiCall: false,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async (pageIndex) => {
    this.setState({ pendingApiCall: true });
    try {
      const response = await loadUsers(pageIndex);
      const page = response.data;
      this.setState({ page: page });
    } catch (err) {
      console.log(err);
    }
    this.setState({ pendingApiCall: false });
  };

  render() {
    const { totalPages, page, content } = this.state.page;
    const { pendingApiCall } = this.state;
    const { t } = this.props;

    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>{t("users")}</h3>
        </div>
        <ul className="list-group list-group-flush">
          {content.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              history={this.props.history}
            />
          ))}
        </ul>
        <div className="card-footer text-center">
          {page !== 0 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-start"
              onClick={() => this.loadData(page - 1)}
            >
              {t("previousPage")}
            </button>
          )}
          {totalPages > page + 1 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-end"
              onClick={() => this.loadData(page + 1)}
            >
              {t("nextPage")}
            </button>
          )}
          {pendingApiCall && <Spinner />}
        </div>
      </div>
    );
  }
}

export default withTranslation()(UserList);
