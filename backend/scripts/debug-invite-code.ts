import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database.config";
import WorkspaceModel from "../src/models/workspace.model";

const checkCode = async () => {
       await connectDatabase();
       const code = "0e1733bc"; // The code from the screenshot

       console.log(`Searching for code: ${code}`);

       const w1 = await WorkspaceModel.findOne({ inviteCode: code });
       if (w1) console.log(`Found as MEMBER inviteCode for workspace: ${w1.name}`);

       const w2 = await WorkspaceModel.findOne({ inviteCodeClient: code });
       if (w2) console.log(`Found as CLIENT inviteCodeClient for workspace: ${w2.name}`);

       if (!w1 && !w2) console.log("Code NOT FOUND in any workspace.");

       process.exit(0);
};

checkCode();
