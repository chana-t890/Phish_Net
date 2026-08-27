# tag-popover-dark-nosidebar

- Figma node: 39:308
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=39-308&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Dark-theme tag popover design that preserves the light variant structure while adopting dark surfaces.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/72d2f24d-97a0-4a76-95ce-9867890bebb5";
const imgMoon = "https://www.figma.com/api/mcp/asset/fbd22a3a-112e-4443-b9fe-7aed4aecbccf";
const imgEllipse = "https://www.figma.com/api/mcp/asset/d54e21ed-b05b-4ce7-ae96-cbd7e12738d7";
const imgFrame = "https://www.figma.com/api/mcp/asset/c4e9ab74-f690-4af4-85d4-28a7e76d5fad";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/7eba9650-3525-4979-bd78-0dc479b239b4";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/7a176fe9-fe20-4038-92b3-c8325f520665";

export default function TagPopoverDarkNosidebar() {
  return (
    <div className="bg-[#0f172a] content-stretch flex flex-col items-start relative size-full" data-node-id="39:308" data-name="tag-popover-dark-nosidebar">
      <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="39:309" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="39:310" data-name="brand">
          <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[32px]" data-node-id="39:311" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="39:814" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="39:314">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="39:315" data-name="header-controls">
          <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="39:316" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="39:317" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#1e3a8a] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="39:319" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12.8px] whitespace-nowrap" data-node-id="39:320">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-node-id="39:321" data-name="Frame">
        <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[340px]" data-node-id="39:322" data-name="email-list-panel">
          <div className="content-stretch flex items-start p-[20px] relative shrink-0 w-full" data-node-id="39:323" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[18px] whitespace-nowrap" data-node-id="39:324">
              Training Inbox
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:325" data-name="Frame">
            <div className="bg-[#1e2c4a] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:326" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:327" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:328" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:329" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:330">
                    IT Support Desk
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:331">
                  10:42 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:332">
                Urgent: Direct Account Re-verification Needed
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:333">
                We have detected temporary irregular connection patterns on your LDAP account. To avoid suspension, please re-authenticate within...
              </p>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:334" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:335" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:336" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:337" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:338">
                    Docusign Office
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:339">
                  9:15 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:340">
                Completed: Q3 Regional Budget Planning.pdf
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:341">
                Please find the completed document regarding regional strategy and financial sign-off for execution starting...
              </p>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:342" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:343" data-name="Frame">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:344" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:345">
                    HR Benefits Team
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:346">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:347">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:348">
                The updated benefits enrollment portal is open now. Please confirm your direct deposit details and health option allocations...
              </p>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:349" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:350" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:351" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:352" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:353">
                    Slack Notifications
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:354">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:355">
                New direct message from Susan Vance (Director of Ops)
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:356">
                Hey, can you double check this vendor invoice for compliance? Let me know ASAP as she wants validation today...
              </p>
            </div>
            <div className="bg-[#161f2e] border border-[#334155] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:357" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:358" data-name="Frame">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:359" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:360">
                    Weekly Team Lunch
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:361">
                  Jul 10
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:362">{`Menu Selections: Friday Catering & Dietary Restrictions`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:363">{`Hope you are all having a great week! Let's choose our meal formats and note any severe food allergy parameters on...`}</p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="39:364" data-name="reading-pane-wrap">
          <div className="bg-[#1a2540] content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-node-id="39:365" data-name="Frame">
            <div className="border border-[#334155] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-node-id="39:366" data-name="email-header">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:367" data-name="Frame">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:368" data-name="Frame">
                  <div className="bg-[#7f1d1d] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="39:369" data-name="Frame">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[15px] whitespace-nowrap" data-node-id="39:370">
                      IT
                    </p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:371" data-name="Frame">
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[14px]" data-node-id="39:372">{`IT Support Desk <it-support@secure-verify.example.net>`}</p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[12px]" data-node-id="39:373">
                      To: john.doe@corporate-hq.com
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap" data-node-id="39:374">
                    Today at 10:42 AM
                  </p>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[20px] whitespace-nowrap" data-node-id="39:375">
                Urgent: Direct Account Re-verification Needed
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-node-id="39:376" data-name="email-body">
              <div className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[16px] items-start leading-[22px] not-italic relative shrink-0 text-[#f8fafc] text-[14px] w-full" data-node-id="39:377" data-name="Frame">
                <p className="relative shrink-0 whitespace-nowrap" data-node-id="39:378">
                  Dear Valued Employee,
                </p>
                <p className="min-w-full relative shrink-0 w-[min-content]" data-node-id="39:379">
                  Our Security Operations Center (SecOps) has flagged inconsistent LDAP authentication requests linked to your network profile over the last 24 hours. To ensure compliance with our updated multi-factor criteria and avoid immediate account suspension, you are required to re-authenticate.
                </p>
                <p className="relative shrink-0 whitespace-nowrap" data-node-id="39:380">
                  Please click the secure corporate bridge link below to finish validation before the automatic cutoff deadline of 5:00 PM today.
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="39:381" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap" data-node-id="39:382">
                  Attachments (1)
                </p>
                <div className="border border-[#334155] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[320px]" data-node-id="39:383" data-name="Frame">
                  <div className="relative shrink-0 size-[20px]" data-node-id="39:384" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:386" data-name="Frame">
                    <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#f8fafc] text-[13px]" data-node-id="39:387">
                      LDAP_Instruction_Manual.pdf
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[11px]" data-node-id="39:388">
                      420 KB · Adobe PDF
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#0f172a] border border-[#334155] border-solid content-stretch flex items-center justify-between p-[24px] relative shrink-0 w-full" data-node-id="39:389" data-name="email-actions-footer">
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-node-id="39:390" data-name="Frame">
                <div className="border-[#4f8ef7] border-[1.5px] border-solid content-stretch flex items-start px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:391" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[13px] whitespace-nowrap" data-node-id="39:392">
                    Clear Flags
                  </p>
                </div>
                <div className="bg-[#ef4444] content-stretch flex gap-[8px] items-center px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:393" data-name="Frame">
                  <div className="relative shrink-0 size-[16px]" data-node-id="39:394" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:396">
                    Finish and Report
                  </p>
                </div>
                <div className="bg-[#4f8ef7] content-stretch flex items-start px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:397" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:398">
                    Mark as Legitimate
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute content-stretch flex items-start right-[120px] top-[220px]" data-node-id="39:399" data-name="popover-anchor">
            <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch drop-shadow-[0px_12px_12px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-start p-[16px] relative rounded-[12px] shrink-0 w-[360px]" data-node-id="39:400" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[14px] whitespace-nowrap" data-node-id="39:401">
                Tag this as…
              </p>
              <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-node-id="39:402" data-name="Frame">
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:403" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:404">
                    Suspicious / spoofed URL
                  </p>
                </div>
                <div className="bg-[#4f8ef7] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:405" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[12px] text-white" data-node-id="39:406">
                    Urgency / pressure language
                  </p>
                  <div className="relative shrink-0 size-[14px]" data-node-id="39:407" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
                  </div>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:409" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:410">
                    Spelling or grammar error
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:411" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:412">
                    Fake / spoofed sender address
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:413" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:414">
                    Request for personal information
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:415" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:416">
                    Request for money / gift cards
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:417" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:418">
                    Too-good-to-be-true offer
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:419" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:420">
                    Threatening / fear-inducing language
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:421" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[12px]" data-node-id="39:422">
                    Suspicious file attachment
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-node-id="39:423" data-name="Frame">
                <div className="content-stretch flex items-start px-[14px] py-[8px] relative rounded-[8px] shrink-0" data-node-id="39:424" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[13px] whitespace-nowrap" data-node-id="39:425">
                    Cancel
                  </p>
                </div>
                <div className="bg-[#4f8ef7] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[8px] shrink-0" data-node-id="39:426" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:427">
                    Tag It
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````
