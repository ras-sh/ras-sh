import { httpRouter } from "convex/server";
import { ossStats } from "./ossStats";

const http = httpRouter();

ossStats.registerRoutes(http);

export default http;
