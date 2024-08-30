import {Timestamp} from "firebase/firestore";

export interface Lead {
  email: string;
  name: string;
  createdAt: Timestamp;
}
