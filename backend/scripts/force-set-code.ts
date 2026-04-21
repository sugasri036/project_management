import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database.config";
import WorkspaceModel from "../src/models/workspace.model";

const forceSetCode = async () => {
       await connectDatabase();

       // Find the workspace named "IBM" or the first one
       const workspace = await WorkspaceModel.findOne({ name: "IBM" }) || await WorkspaceModel.findOne();

       if (!workspace) {
              console.log("No workspace found.");
              return;
       }

       console.log(`Targeting workspace: ${workspace.name} (${workspace._id})`);
       console.log(`Old Client Code: ${workspace.inviteCodeClient}`);

       workspace.inviteCodeClient = "0e1733bc";
       await workspace.save();

       console.log(`New Client Code Set To: ${workspace.inviteCodeClient}`);

       // Verify immediately
       const check = await WorkspaceModel.findById(workspace._id);
       console.log(`Verification Read: ${check?.inviteCodeClient}`);

       // process.exit(0) is not needed if we just let it finish, but DB connection might keep it open.
       // Ideally we should close connection. 
       // For now just commenting out process to fix the "Cannot find name process" error if @types/node is missing globally in this context.
};

forceSetCode();
