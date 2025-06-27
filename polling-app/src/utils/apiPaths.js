export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/get-user",
    UPDATE_PROFILE: "/api/v1/auth/update",
  },
  POLLS: {
    CREATE: "/api/v1/poll/create",
    GET_ALL: "/api/v1/poll/get-all-polls",
    GET_BY_ID: (pollId) => `/api/v1/poll/${pollId}`,
    VOTE: (pollId) => `/api/v1/poll/${pollId}/vote`,
    CLOSE: (pollId) => `/api/v1/poll/${pollId}/close`,
    BOOKMARK: (pollId) => `/api/v1/poll/${pollId}/bookmark`,
    GET_BOOKMARKED: "/api/v1/poll/user/bookmarked",
    VOTED_POLLS: "/api/v1/poll/voted-polls",
    DELETE: (pollId) => `/api/v1/poll/${pollId}`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};
