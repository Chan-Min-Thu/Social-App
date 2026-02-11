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
    quality: 100,
  };
};

export const coverQueueOptions = (coverImage: any) => {
  return {
    type: "image",
    filePath: coverImage.buffer.toString("base64"),
    fileName: coverImage.originalname,
    width: 900,
    height: 600,
    quality: 100,
  };
};
