import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import CreatePoll from "./pages/Dashboard/CreatePoll";
import MyPolls from "./pages/Dashboard/MyPolls";
import VotedPolls from "./pages/Dashboard/VotedPolls";
import Bookmarks from "./pages/Dashboard/Bookmarks";
import UserProvider, { UserContext } from "./context/UserContext";
import axiosInstance from "./utils/axiosInstance";
import { API_PATHS } from "./utils/apiPaths";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
function App() {
  const { updateUser, user } = useContext(UserContext);

  // useEffect(() => {
  //   function fetchUserInfo() {
  //     axiosInstance
  //       .get(API_PATHS.AUTH.GET_USER_INFO)
  //       .then((response) => {
  //         console.log(response);
  //         if (response && response.data) {
  //           updateUser(response.data);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user info", error);
  //       });
  //   }

  //   fetchUserInfo();
  // }, [updateUser]);

  return (
    <Suspense fallback={<h2>Loading</h2>}>
      <div className=' image-auth'>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/signup' exact element={<SignUp />} />
          <Route path='/dashboard' exact element={<Home />} />
          <Route path='/dashboard' exact element={<Home />} />
          <Route path='/create-poll' exact element={<CreatePoll />} />
          <Route path='/my-polls' exact element={<MyPolls />} />
          <Route path='/create-poll' exact element={<CreatePoll />} />
          <Route path='/voted-polls' exact element={<VotedPolls />} />
          <Route path='/bookmarked-polls' exact element={<Bookmarks />} />
        </Routes>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </Suspense>
  );
}

const Root = () => {
  let isAuthenticated = !!localStorage.getItem("token");

  let route = "/login";
  if (isAuthenticated) {
    route = "/dashboard";
  }
  return <Navigate to={route} />;
};

export default App;
