export const imageQueueOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};

export const profileQueueOptions = (profileImage: any) => {
  return {
    type: "image",
    filePath: profileImage.buffer.toString("base64"),
    fileName: profileImage.originalname,
    width: 600,
    height: 600,
    qualitity: 100,
  };
};
