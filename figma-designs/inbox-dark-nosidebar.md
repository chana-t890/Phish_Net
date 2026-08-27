# inbox-dark-nosidebar

- Figma node: 39:92
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=39-92&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Dark-theme inbox experience with the same layout as the light design but using dark surfaces and higher-contrast text.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/654ed323-b639-478f-b66a-9d22573f2d94";
const imgMoon = "https://www.figma.com/api/mcp/asset/187be843-cb58-403e-b7db-05fbf47be685";
const imgEllipse = "https://www.figma.com/api/mcp/asset/cdcae824-c8ae-40d9-91b2-bc3944d25063";
const imgFrame = "https://www.figma.com/api/mcp/asset/8c67c1f4-cf20-4f66-bec3-461c705c89b5";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/36ec4423-9367-42f2-bb33-54955ac8f828";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/f732c5e8-9f0b-4f90-984a-9139c50d441b";

export default function InboxDarkNosidebar() {
  return (
    <div className="bg-[#0f172a] content-stretch flex flex-col items-start relative size-full" data-node-id="39:92" data-name="inbox-dark-nosidebar">
      <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="39:93" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="39:94" data-name="brand">
          <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[32px]" data-node-id="39:95" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="39:810" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="39:98">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="39:99" data-name="header-controls">
          <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="39:100" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="39:101" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#1e3a8a] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="39:103" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12.8px] whitespace-nowrap" data-node-id="39:104">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-node-id="39:105" data-name="Frame">
        <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[340px]" data-node-id="39:106" data-name="email-list-panel">
          <div className="content-stretch flex items-start p-[20px] relative shrink-0 w-full" data-node-id="39:107" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[18px] whitespace-nowrap" data-node-id="39:108">
              Training Inbox
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:109" data-name="Frame">
            <div className="bg-[#1e2c4a] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:110" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:111" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:112" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:113" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:114">
                    IT Support Desk
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:115">
                  10:42 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:116">
                Urgent: Direct Account Re-verification Needed
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:117">
                We have detected temporary irregular connection patterns on your LDAP account. To avoid suspension, please re-authenticate within...
              </p>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:118" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:119" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:120" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:121" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:122">
                    Docusign Office
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:123">
                  9:15 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:124">
                Completed: Q3 Regional Budget Planning.pdf
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:125">
                Please find the completed document regarding regional strategy and financial sign-off for execution starting...
              </p>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:126" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:127" data-name="Frame">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:128" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:129">
                    HR Benefits Team
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:130">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] min-w-full not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-[min-content] whitespace-nowrap" data-node-id="39:131">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-[min-content]" data-node-id="39:132">
                The updated benefits enrollment portal is open now. Please confirm your direct deposit details and health option allocations...
              </p>
              <div className="content-stretch flex gap-[4px] items-center pt-[4px] relative shrink-0" data-node-id="39:133" data-name="Frame">
                <div className="relative shrink-0 size-[14px]" data-node-id="39:134" data-name="Frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[10px] whitespace-nowrap" data-node-id="39:136">
                  Handled correctly (Reported)
                </p>
              </div>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:137" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:138" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:139" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:140" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:141">
                    Slack Notifications
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:142">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:143">
                New direct message from Susan Vance (Director of Ops)
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:144">
                Hey, can you double check this vendor invoice for compliance? Let me know ASAP as she wants validation today...
              </p>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:145" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:146" data-name="Frame">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:147" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:148">
                    Weekly Team Lunch
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:149">
                  Jul 10
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:150">{`Menu Selections: Friday Catering & Dietary Restrictions`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:151">{`Hope you are all having a great week! Let's choose our meal formats and note any severe food allergy parameters on...`}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a2540] content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-node-id="39:152" data-name="Frame">
          <div className="border border-[#334155] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-node-id="39:153" data-name="email-header">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:154" data-name="Frame">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:155" data-name="Frame">
                <div className="bg-[#7f1d1d] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="39:156" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[15px] whitespace-nowrap" data-node-id="39:157">
                    IT
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:158" data-name="Frame">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[14px]" data-node-id="39:159">{`IT Support Desk <it-support@secure-verify.example.net>`}</p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[12px]" data-node-id="39:160">
                    To: john.doe@corporate-hq.com
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap" data-node-id="39:161">
                  Today at 10:42 AM
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[20px] whitespace-nowrap" data-node-id="39:162">
              Urgent: Direct Account Re-verification Needed
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-node-id="39:163" data-name="email-body">
            <div className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[16px] items-start leading-[22px] not-italic relative shrink-0 text-[#f8fafc] text-[14px] w-full" data-node-id="39:164" data-name="Frame">
              <p className="relative shrink-0 whitespace-nowrap" data-node-id="39:165">
                Dear Valued Employee,
              </p>
              <p className="min-w-full relative shrink-0 w-[min-content]" data-node-id="39:166">
                Our Security Operations Center (SecOps) has flagged inconsistent LDAP authentication requests linked to your network profile over the last 24 hours. To ensure compliance with our updated multi-factor criteria and avoid immediate account suspension, you are required to re-authenticate.
              </p>
              <p className="relative shrink-0 whitespace-nowrap" data-node-id="39:167">
                Please click the secure corporate bridge link below to finish validation before the automatic cutoff deadline of 5:00 PM today.
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="39:168" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap" data-node-id="39:169">
                Attachments (1)
              </p>
              <div className="border border-[#334155] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[320px]" data-node-id="39:170" data-name="Frame">
                <div className="relative shrink-0 size-[20px]" data-node-id="39:171" data-name="Frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:173" data-name="Frame">
                  <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#f8fafc] text-[13px]" data-node-id="39:174">
                    LDAP_Instruction_Manual.pdf
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[11px]" data-node-id="39:175">
                    420 KB · Adobe PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#0f172a] border border-[#334155] border-solid content-stretch flex items-center justify-between p-[24px] relative shrink-0 w-full" data-node-id="39:176" data-name="email-actions-footer">
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-node-id="39:177" data-name="Frame">
              <div className="border-[#4f8ef7] border-[1.5px] border-solid content-stretch flex items-start px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:178" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[13px] whitespace-nowrap" data-node-id="39:179">
                  Clear Flags
                </p>
              </div>
              <div className="bg-[#ef4444] content-stretch flex gap-[8px] items-center px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:180" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-node-id="39:181" data-name="Frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:183">
                  Finish and Report
                </p>
              </div>
              <div className="bg-[#4f8ef7] content-stretch flex items-start px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:184" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:185">
                  Mark as Legitimate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````
