/* eslint-disable prettier/prettier */
export type MessageDto = {
  id: number;
  content: string;
  sender: {
    address: string;
  };
  created: string;
};
