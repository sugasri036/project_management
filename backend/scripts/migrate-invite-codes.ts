import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database.config";
import WorkspaceModel from "../src/models/workspace.model";
import { generateInviteCode } from "../src/utils/uuid";

const migrate = async () => {
       await connectDatabase();
       console.log("Connected to DB");

       const workspaces = await WorkspaceModel.find({});
       console.log(`Found ${workspaces.length} workspaces.`);

       for (const w of workspaces) {
              if (!w.inviteCodeClient) {
                     console.log(`Updating workspace: ${w.name} (${w._id})`);
                     w.inviteCodeClient = generateInviteCode();
                     await w.save();
                     console.log(`  Added client code: ${w.inviteCodeClient}`);
              } else {
                     console.log(`Workspace ${w.name} already has client code: ${w.inviteCodeClient}`);
              }
       }

       console.log("Migration complete.");
       process.exit(0);
};

migrate();
