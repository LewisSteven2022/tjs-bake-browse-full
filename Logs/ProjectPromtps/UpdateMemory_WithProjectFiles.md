GPT, update your memory with these instructions:

Every time we implement a new feature, we must always fully document it. This document will hold all the technical details of the feature. It will give us examples of how to implement it in the future, how to test it, what files we need to update, what parts of the code we need to change, etc. This document will be stored in /Logs/Feature_Documentation/The file name should be dynamically created based on the last file in the folder, e.g. if the last file is 01_Feature_Name.md (01_Suggestions_Form.md), the new file should be 02_Email_Submission.md and so on.

If you have any other ideas, or you have a future enhancement that we can look at in the future, please add it to the file in /Logs/EnhancementList/futureEnhancementsList.md. This will be our master source where we look to add improvement. Each time we prompt, read this file to see if you have already added it. Follow the file format in all cases.

Every two hours, you must scan all of the files in the project and map out a list of files in tree view. This will be good to understand the project structure and how the files are related to each other. This will be logged in /ProjectStructure/projectStructure.md. Likewise for the database schema and API schema, we must always keep these up to date end document these in /Logs/Schemas/Database_Schema/databaseSchema.md and /Logs/Schemas/API_Schema/apiSchema.md.

Any API changes we make must be updated in the API Schema and API documentation. This is stored in /Logs/Schemas/API_Schema/apiSchema.md and /Logs/API_Documentation/apiDocumentation.md.

Every time we do something, we must always check to see if we need to update our todo list. This todo list will hold all our next step information in. It will be our guide to a successful release. This sits in the root of the project in the file to-dos.md. Every time we update a task in there, we must always update the date and time of the task. We must also update the status of the task.

If you think that we would benefit from learning about a concept or why we did something, update it in the Learning_Material.md file thats stored in /Logs/Learning_Material.md. This will be our master source where we look to add improvement. Each time we prompt, read this file to see if you have already added it. Follow the file format in all cases.

Every file we update must have a last updated date and time. This will be logged in the file at the top along with the name of the file and the name of the person who updated it (GPT or Claude depending on who the LLM agent is)

We must always have documentation in mind, and we must always be updating the documentation. This is our guide to a successful release. We must create very detailed deployment guides for deploying our projects to production. These guides must be written in a way that junior developers can understand and follow on their own and ge the deployment completed without issues. We must ALWAYS list out what variables we need to set or change when we move from local to production and in exactly what files these are in.

Any bugs we catch should be written into the bug tracking log. This is stored in /Logs/Bug_Tracking/bugTrackingLog.md. We must always update the bug tracking log with the date and time of the bug, the name of the bug, the description of the bug, the steps to reproduce the bug, the expected behavior, the actual behavior, and the fix.

Read the projectArchetecture.md file located in /Logs/Project Docs/ and update the file. It MUST follow the same format.
