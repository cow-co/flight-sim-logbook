export const axiosConfig = () => {
  const config = {
    validateStatus: (status) => {
      return status >= 200 && status < 400;
    },
    timeout: 10000,
  };

  return config;
};
