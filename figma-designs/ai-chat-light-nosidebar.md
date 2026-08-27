# ai-chat-light-nosidebar

- Figma node: 39:433
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=39-433&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Light-theme AI chat experience with inbox navigation, assistant message states, and chat action surfaces.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/0e2215c1-78c8-4bfd-a732-a66e735eb811";
const imgMoon = "https://www.figma.com/api/mcp/asset/cb4dbd4d-c6ad-499b-ab8b-6441d934aac9";
const imgEllipse = "https://www.figma.com/api/mcp/asset/2a14819f-7285-4cf9-878a-0e044dff7963";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/209a523c-3278-4bb0-952d-d2be80da70dd";
const imgEllipse2 = "https://www.figma.com/api/mcp/asset/114f8453-c01f-45db-a3f4-9c423d66db0a";
const imgEllipse3 = "https://www.figma.com/api/mcp/asset/f289d78b-95a5-4b7f-9cb1-681b974aa993";
const imgVector = "https://www.figma.com/api/mcp/asset/f39cf4ce-8168-48ad-af83-e4ba01f62918";
const imgVector1 = "https://www.figma.com/api/mcp/asset/13d9327b-dd3a-4f99-a0f2-6cb46bdb9ac5";
const imgVector2 = "https://www.figma.com/api/mcp/asset/3aa2d6f3-d11c-4aa3-9964-a9a90e3323ad";
const imgFrame = "https://www.figma.com/api/mcp/asset/2fcabe67-342c-45b1-9797-986d8f10edee";
const imgVector3 = "https://www.figma.com/api/mcp/asset/9ee79ae1-d3d2-4216-bb19-2734c756ce11";

export default function AiChatLightNosidebar() {
  return (
    <div className="bg-[#f8f9fc] content-stretch flex flex-col items-start relative size-full" data-node-id="39:433" data-name="ai-chat-light-nosidebar">
      <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="39:434" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="39:435" data-name="brand">
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-node-id="39:436" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="39:816" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="39:439">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="39:440" data-name="header-controls">
          <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="39:441" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="39:442" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="39:444" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12px] whitespace-nowrap" data-node-id="39:445">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-node-id="39:446" data-name="Frame">
        <div className="bg-white border-[#e2e8f0] border-r border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[280px]" data-node-id="39:447" data-name="Frame">
          <div className="content-stretch flex flex-col items-start p-[20px] relative shrink-0 w-full" data-node-id="39:448" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[18px] whitespace-nowrap" data-node-id="39:449">
              Training Inbox
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:450" data-name="Frame">
            <div className="bg-[#eff6ff] border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:451" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:452" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:453" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:454" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:455">
                    IT Support Desk
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:456">
                  10:42 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:457">
                Urgent: Direct Account Re-verification Needed
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:458">
                We have detected temporary irregular connection patterns on your LDAP account. To avoid suspension...
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0)] border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:459" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:460" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:461" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:462" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:463">
                    Docusign Office
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:464">
                  9:15 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:465">
                Completed: Q3 Regional Budget Planning.pdf
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:466">
                Please find the completed document regarding regional strategy and financial sign-off for execution...
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0)] border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:467" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:468" data-name="row-top">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:469" data-name="sender-group">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:470">
                    HR Benefits Team
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:471">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:472">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:473">
                The updated benefits enrollment portal is open now. Please confirm your direct deposit details...
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0)] border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:474" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:475" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:476" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:477" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="39:478">
                    Slack Notifications
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:479">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:480">
                New direct message from Susan Vance (Director of Ops)
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="39:481">
                Hey, can you double check this vendor invoice for compliance? Let me know ASAP...
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-node-id="39:482" data-name="Frame">
          <div className="bg-[#eff6ff] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[20px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-node-id="39:483" data-name="Frame">
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:484" data-name="legend-item">
              <div className="relative shrink-0 size-[8px]" data-node-id="39:485" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap" data-node-id="39:486">
                Correctly flagged
              </p>
            </div>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:487" data-name="legend-item">
              <div className="relative shrink-0 size-[8px]" data-node-id="39:488" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap" data-node-id="39:489">
                Missed flag
              </p>
            </div>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:490" data-name="legend-item">
              <div className="relative shrink-0 size-[8px]" data-node-id="39:491" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap" data-node-id="39:492">
                Not a real flag
              </p>
            </div>
          </div>
          <div className="border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-node-id="39:493" data-name="Frame">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:494" data-name="Frame">
              <div className="bg-[#fee2e2] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="39:495" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[15px] whitespace-nowrap" data-node-id="39:496">
                  IT
                </p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="39:497" data-name="Frame">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[14px] w-full" data-node-id="39:498">{`IT Support Desk <it-support@secure-verify.example.net>`}</p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px] w-full" data-node-id="39:499">
                  To: john.doe@corporate-hq.com
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[20px] whitespace-nowrap" data-node-id="39:500">
              Urgent: Direct Account Re-verification Needed
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[24px] relative w-full" data-node-id="39:501" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[14px] whitespace-nowrap" data-node-id="39:502">
              Dear Valued Employee,
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#1e293b] text-[14px] w-[min-content]" data-node-id="39:503">
              Our Security Operations Center (SecOps) has flagged inconsistent LDAP authentication requests linked to your network profile over the last 24 hours. To ensure compliance with our updated multi-factor criteria and avoid immediate account suspension, you are required to re-authenticate.
            </p>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="39:504" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#1e293b] text-[14px] w-[min-content]" data-node-id="39:505">
                <span className="leading-[24px]">{`Please click the `}</span>
                <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Bold'] font-bold leading-[24px] text-[#ef4444] underline">secure corporate bridge link</span>
                <span className="leading-[24px]">{` below to finish validation before the automatic cutoff deadline of `}</span>
                <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Bold'] font-bold leading-[24px] text-[#10b981] underline">5:00 PM today</span>
                <span className="leading-[24px]">.</span>
              </p>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="39:506" data-name="Frame">
                <div className="bg-[#d1fae5] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="39:507" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap" data-node-id="39:508">
                    Urgency / deadline language
                  </p>
                  <div className="relative shrink-0 size-[12px]" data-node-id="39:509" data-name="Vector">
                    <div className="absolute inset-[-4.72%_-6.87%_-14.71%_-6.87%]">
                      <img alt="" className="block max-w-none size-full" src={imgVector} />
                    </div>
                  </div>
                </div>
                <div className="bg-[#fee2e2] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="39:510" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap" data-node-id="39:511">
                    Suspicious / spoofed URL
                  </p>
                  <div className="relative shrink-0 size-[12px]" data-node-id="39:512" data-name="Vector">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f8f9fc] border-[#e2e8f0] border-solid border-t content-stretch flex items-center justify-center p-[20px] relative shrink-0 w-full" data-node-id="39:513" data-name="Frame">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="39:514" data-name="Frame">
              <div className="relative shrink-0 size-[16px]" data-node-id="39:515" data-name="Vector">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap" data-node-id="39:516">
                Session submitted. Training actions are locked.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-l border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[320px]" data-node-id="39:517" data-name="Frame">
          <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[20px] relative shrink-0 w-full" data-node-id="39:518" data-name="Frame">
            <div className="relative shrink-0 size-[32px]" data-node-id="39:519" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="39:521" data-name="Frame">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[15px]" data-node-id="39:522">
                AI Coach
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#10b981] text-[11px]" data-node-id="39:523">
                Online
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px p-[20px] relative w-full" data-node-id="39:524" data-name="Frame">
            <div className="bg-[#eff6ff] content-stretch flex flex-col items-start p-[12px] relative rounded-br-[12px] rounded-tl-[12px] rounded-tr-[12px] shrink-0 w-full" data-node-id="39:525" data-name="chat-bubble">
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#1e293b] text-[13px] w-full" data-node-id="39:526">
                I can see what you flagged — before I give you feedback, tell me in your own words: what made you suspicious about this email, and what do you think the attacker was trying to do?
              </p>
            </div>
          </div>
          <div className="border-[#e2e8f0] border-solid border-t content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-node-id="39:527" data-name="Frame">
            <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] items-center min-w-px px-[12px] py-[10px] relative rounded-[8px]" data-node-id="39:528" data-name="Frame">
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[13px]" data-node-id="39:529">
                Type your response…
              </p>
              <div className="relative shrink-0 size-[18px]" data-node-id="39:530" data-name="Vector">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````
