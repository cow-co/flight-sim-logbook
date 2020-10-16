export const axiosConfig = () => {
  const config = {
    validateStatus: (status) => {
      return status >= 0;
    },
    timeout: 10000,
  };

  return config;
};
