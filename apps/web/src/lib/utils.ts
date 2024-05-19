import createClient from "openapi-fetch";
import { paths } from "./api/v1";

export const client = createClient<paths>({
  baseUrl: "/",
});
