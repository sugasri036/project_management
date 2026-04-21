import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database.config";
import WorkspaceModel from "../src/models/workspace.model";

const listCodes = async () => {
       await connectDatabase();
       const workspaces = await WorkspaceModel.find({});

       console.log("--- WORKSPACES ---");
       workspaces.forEach(w => {
              console.log(`Name: ${w.name}`);
              console.log(`ID: ${w._id}`);
              console.log(`Member Code: ${w.inviteCode}`);
              console.log(`Client Code: ${w.inviteCodeClient}`);
              console.log("------------------");
       });

       process.exit(0);
};

listCodes();
