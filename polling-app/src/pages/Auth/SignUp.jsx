import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useNavigate } from "react-router";
import AuthInput from "../../components/input/AuthInput";
import { Link } from "react-router";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/input/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!username) {
      setError("Please enter a username");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");

    // Register API

    try {
      let profileImageUrl;
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        username,
        email,
        password,
        profileImageUrl,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something wen wrong.please try again");
      }
    }
  };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-primary text-center'>
          Create an Account
        </h3>
        <p className='text-xs text-slate-600 mt-[5px] mb-5 text-center'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <AuthInput
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label='Full Name :'
              placeholder='John'
              type='text'
            />

            <AuthInput
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email Adress :'
              placeholder='john@example.com'
              type='text'
            />

            <AuthInput
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              label='Username :'
              placeholder='@'
              type='text'
            />
            <AuthInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label='Password:'
              placeholder='Min 8 characters'
              type='password'
            />
          </div>
          {error && <p className='text-red-500 text-sm pb-2.5 mt-2'>{error}</p>}

          <button type='submit' className='btn-primary'>
            CREATE ACCOUNT
          </button>
          <p className='text-[13px] text-slate-600 mt-2'>
            Already have an account{" "}
            <Link className='font-medium text-primary underline' to='/login'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
