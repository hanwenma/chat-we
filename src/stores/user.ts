import { defineStore } from "pinia";

export interface Ueser {
  uuid: string;
  name: string;
  message: string;
  date: string;
  avatar: string;
  online: boolean;
  first: boolean;
}
const data = window.sessionStorage.getItem("user");
const persist = data ? JSON.parse(data) : { uuid: "", name: "" };

export const useUser = defineStore("user", {
  state: () => ({
    user: persist,
    online: 1
  }),
});