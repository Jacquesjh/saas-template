import {Timestamp} from "firebase/firestore";

export interface Lead {
  email: string;
  createdAt: Timestamp;
}
