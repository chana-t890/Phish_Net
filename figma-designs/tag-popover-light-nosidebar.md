# tag-popover-light-nosidebar

- Figma node: 39:187
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=39-187&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Light-theme tag popover experience embedded in a training-inbox shell.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/6210217b-061e-40b7-9a17-dfa17b31559f";
const imgMoon = "https://www.figma.com/api/mcp/asset/b25b167e-3312-42ce-a4e7-6d01bdbb38af";
const imgEllipse = "https://www.figma.com/api/mcp/asset/6f51bf07-30c2-4dac-ac5d-769d38756f2e";
const imgFrame = "https://www.figma.com/api/mcp/asset/004da122-2c97-4dd3-beaa-a63a4f772ca6";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/cb85020d-ddf6-4ff4-814f-0e3d3f9131d5";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/f1b9d401-42e9-499d-adb2-5307d4b816a3";

export default function TagPopoverLightNosidebar() {
  return (
    <div className="bg-[#f8f9fc] content-stretch flex flex-col items-start relative size-full" data-node-id="39:187" data-name="tag-popover-light-nosidebar">
      <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="39:188" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="39:189" data-name="brand">
          <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[32px]" data-node-id="39:190" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="39:812" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="39:193">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="39:194" data-name="header-controls">
          <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="39:195" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="39:196" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="39:198" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12.8px] whitespace-nowrap" data-node-id="39:199">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-node-id="39:200" data-name="Frame">
        <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[340px]" data-node-id="39:201" data-name="email-list-panel">
          <div className="content-stretch flex items-start p-[20px] relative shrink-0 w-full" data-node-id="39:202" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[18px] whitespace-nowrap" data-node-id="39:203">
              Training Inbox
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:204" data-name="Frame">
            <div className="bg-[#eff6ff] border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:205" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:206" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:207" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:208" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:209">
                    IT Support Desk
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:210">
                  10:42 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:211">
                Urgent: Direct Account Re-verification Needed
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:212">
                We have detected temporary irregular connection patterns on your LDAP account. To avoid suspension, please re-authenticate within...
              </p>
            </div>
            <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:213" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:214" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:215" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:216" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:217">
                    Docusign Office
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:218">
                  9:15 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:219">
                Completed: Q3 Regional Budget Planning.pdf
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:220">
                Please find the completed document regarding regional strategy and financial sign-off for execution starting...
              </p>
            </div>
            <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:221" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:222" data-name="Frame">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:223" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:224">
                    HR Benefits Team
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:225">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:226">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:227">
                The updated benefits enrollment portal is open now. Please confirm your direct deposit details and health option allocations...
              </p>
            </div>
            <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:228" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:229" data-name="Frame">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:230" data-name="Frame">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:231" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:232">
                    Slack Notifications
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:233">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:234">
                New direct message from Susan Vance (Director of Ops)
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:235">
                Hey, can you double check this vendor invoice for compliance? Let me know ASAP as she wants validation today...
              </p>
            </div>
            <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:236" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:237" data-name="Frame">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:238" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:239">
                    Weekly Team Lunch
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:240">
                  Jul 10
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:241">{`Menu Selections: Friday Catering & Dietary Restrictions`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:242">{`Hope you are all having a great week! Let's choose our meal formats and note any severe food allergy parameters on...`}</p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="39:243" data-name="reading-pane-wrap">
          <div className="bg-white content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-node-id="39:244" data-name="Frame">
            <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-node-id="39:245" data-name="email-header">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:246" data-name="Frame">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:247" data-name="Frame">
                  <div className="bg-[#fee2e2] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="39:248" data-name="Frame">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[15px] whitespace-nowrap" data-node-id="39:249">
                      IT
                    </p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:250" data-name="Frame">
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[14px]" data-node-id="39:251">{`IT Support Desk <it-support@secure-verify.example.net>`}</p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px]" data-node-id="39:252">
                      To: john.doe@corporate-hq.com
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap" data-node-id="39:253">
                    Today at 10:42 AM
                  </p>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[20px] whitespace-nowrap" data-node-id="39:254">
                Urgent: Direct Account Re-verification Needed
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-node-id="39:255" data-name="email-body">
              <div className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[16px] items-start leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[14px] w-full" data-node-id="39:256" data-name="Frame">
                <p className="relative shrink-0 whitespace-nowrap" data-node-id="39:257">
                  Dear Valued Employee,
                </p>
                <p className="min-w-full relative shrink-0 w-[min-content]" data-node-id="39:258">
                  Our Security Operations Center (SecOps) has flagged inconsistent LDAP authentication requests linked to your network profile over the last 24 hours. To ensure compliance with our updated multi-factor criteria and avoid immediate account suspension, you are required to re-authenticate.
                </p>
                <p className="relative shrink-0 whitespace-nowrap" data-node-id="39:259">
                  Please click the secure corporate bridge link below to finish validation before the automatic cutoff deadline of 5:00 PM today.
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="39:260" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap" data-node-id="39:261">
                  Attachments (1)
                </p>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[320px]" data-node-id="39:262" data-name="Frame">
                  <div className="relative shrink-0 size-[20px]" data-node-id="39:263" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:265" data-name="Frame">
                    <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#1e293b] text-[13px]" data-node-id="39:266">
                      LDAP_Instruction_Manual.pdf
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[11px]" data-node-id="39:267">
                      420 KB · Adobe PDF
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[24px] relative shrink-0 w-full" data-node-id="39:268" data-name="email-actions-footer">
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-node-id="39:269" data-name="Frame">
                <div className="border-[#4f8ef7] border-[1.5px] border-solid content-stretch flex items-start px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:270" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[13px] whitespace-nowrap" data-node-id="39:271">
                    Clear Flags
                  </p>
                </div>
                <div className="bg-[#ef4444] content-stretch flex gap-[8px] items-center px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:272" data-name="Frame">
                  <div className="relative shrink-0 size-[16px]" data-node-id="39:273" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:275">
                    Finish and Report
                  </p>
                </div>
                <div className="bg-[#4f8ef7] content-stretch flex items-start px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:276" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:277">
                    Mark as Legitimate
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute content-stretch flex items-start right-[120px] top-[220px]" data-node-id="39:278" data-name="popover-anchor">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_12px_12px_rgba(0,0,0,0.08)] flex flex-col gap-[16px] items-start p-[16px] relative rounded-[12px] shrink-0 w-[360px]" data-node-id="39:279" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[14px] whitespace-nowrap" data-node-id="39:280">
                Tag this as…
              </p>
              <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-node-id="39:281" data-name="Frame">
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:282" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:283">
                    Suspicious / spoofed URL
                  </p>
                </div>
                <div className="bg-[#4f8ef7] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:284" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[#4f8ef7] text-[12px]" data-node-id="39:285">
                    Urgency / pressure language
                  </p>
                  <div className="relative shrink-0 size-[14px]" data-node-id="39:286" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
                  </div>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:288" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:289">
                    Spelling or grammar error
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:290" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:291">
                    Fake / spoofed sender address
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:292" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:293">
                    Request for personal information
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:294" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:295">
                    Request for money / gift cards
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:296" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:297">
                    Too-good-to-be-true offer
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:298" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:299">
                    Threatening / fear-inducing language
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-[10px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-node-id="39:300" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium'] font-medium leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]" data-node-id="39:301">
                    Suspicious file attachment
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-node-id="39:302" data-name="Frame">
                <div className="content-stretch flex items-start px-[14px] py-[8px] relative rounded-[8px] shrink-0" data-node-id="39:303" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap" data-node-id="39:304">
                    Cancel
                  </p>
                </div>
                <div className="bg-[#4f8ef7] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[8px] shrink-0" data-node-id="39:305" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="39:306">
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
