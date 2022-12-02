import {Client, Account, Databases } from "appwrite";

// create a client
const client = new Client();
client.setEndpoint("http://localhost/v1").setProject("6389aabacf5b71521e5e");
export const account = new Account(client);
export const database = new Databases(client, "638a00104d3f0c1d442a");