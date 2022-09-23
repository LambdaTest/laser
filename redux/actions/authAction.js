import { apiStatus } from "../helper";

export const logOut = () => {
  return (dispatch) => {
      console.log("User logged out")
      dispatch(apiStatus('CLEAR_AUTH_DATA'));
  };
};
  