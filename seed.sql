-- Run after you create/log in as a Supabase user and replace YOUR_USER_UUID.
insert into projects (user_id,name,health,priority,next_milestone,blocker,next_action,owner) values
('YOUR_USER_UUID','GTM Command Center','green','critical','Stabilize next release','None','Finish Pipeline UX and deployment QA','Michael'),
('YOUR_USER_UUID','SAVi','amber','critical','Investor-ready deck and outreach','Final market/investor updates','Complete market slide and final deck pass','Michael'),
('YOUR_USER_UUID','Velocity / VHL','red','critical','Engagement terms aligned','Compensation and scope alignment','Resolve open terms and progress engagement','Michael'),
('YOUR_USER_UUID','Babson Diagnostics','green','high','Advance active client deliverables','None','Confirm next milestones across pricing and Epic work','Michael'),
('YOUR_USER_UUID','PlasticBegone','amber','high','Scientific validation and advisor outreach','External validation pathway','Advance expert outreach and validation','Michael'),
('YOUR_USER_UUID','Bluedoor','green','high','GTM and growth execution','Competing priorities','Prioritize highest-value revenue work','Michael');
