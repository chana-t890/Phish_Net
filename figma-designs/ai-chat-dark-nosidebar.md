# ai-chat-dark-nosidebar

- Figma node: 39:532
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=39-532&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Dark-theme AI chat variant with the same structure as the light design and darker chrome.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/56d66e1e-cbcc-411b-9fe1-7be973c09875";
const imgMoon = "https://www.figma.com/api/mcp/asset/24c01a93-df98-4615-a3d0-3c79996f5ab5";
const imgEllipse = "https://www.figma.com/api/mcp/asset/1ee872ac-c318-43fe-9187-495f7076dd57";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/1c631587-0684-4877-a0d3-eefc03d2809c";
const imgEllipse2 = "https://www.figma.com/api/mcp/asset/0bb2ecd1-aa09-4a0d-8c70-7ae8c38dd7fb";
const imgEllipse3 = "https://www.figma.com/api/mcp/asset/9542f4aa-22fd-4776-ac6a-8a12f1abbea5";
const imgVector = "https://www.figma.com/api/mcp/asset/5ee35d06-bc11-4179-8319-2a2b41772e33";
const imgVector1 = "https://www.figma.com/api/mcp/asset/8a3b4d10-b5f9-4696-b4e2-280578dbcf40";
const imgVector2 = "https://www.figma.com/api/mcp/asset/9b0a8dcf-2340-4e46-84d0-2a4248f6218c";
const imgFrame = "https://www.figma.com/api/mcp/asset/db8e310d-23cb-4704-a1f3-a6045f38b64a";
const imgVector3 = "https://www.figma.com/api/mcp/asset/86f25bce-6ef3-4106-8d6b-34d07cb3be1c";

export default function AiChatDarkNosidebar() {
  return (
    <div className="bg-[#0f172a] content-stretch flex flex-col items-start relative size-full" data-node-id="39:532" data-name="ai-chat-dark-nosidebar">
      <div className="bg-[#111827] border-[#334155] border-b border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="39:533" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="39:534" data-name="brand">
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-node-id="39:535" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="39:818" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="39:538">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="39:539" data-name="header-controls">
          <div className="bg-[#0f172a] border border-[#334155] border-solid content-stretch flex items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="39:540" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="39:541" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#1e293b] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="39:543" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12px] whitespace-nowrap" data-node-id="39:544">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-node-id="39:545" data-name="Frame">
        <div className="bg-[#111827] border-[#334155] border-r border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[280px]" data-node-id="39:546" data-name="Frame">
          <div className="content-stretch flex flex-col items-start p-[20px] relative shrink-0 w-full" data-node-id="39:547" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[18px] whitespace-nowrap" data-node-id="39:548">
              Training Inbox
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="39:549" data-name="Frame">
            <div className="bg-[#161f2e] border-[#334155] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:550" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:551" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:552" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:553" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:554">
                    IT Support Desk
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:555">
                  10:42 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:556">
                Urgent: Direct Account Re-verification Needed
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:557">
                We have detected temporary irregular connection patterns on your LDAP account. To avoid suspension...
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0)] border-[#334155] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:558" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:559" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:560" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:561" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:562">
                    Docusign Office
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:563">
                  9:15 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:564">
                Completed: Q3 Regional Budget Planning.pdf
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:565">
                Please find the completed document regarding regional strategy and financial sign-off for execution...
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0)] border-[#334155] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:566" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:567" data-name="row-top">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="39:568" data-name="sender-group">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:569">
                    HR Benefits Team
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:570">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:571">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:572">
                The updated benefits enrollment portal is open now. Please confirm your direct deposit details...
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0)] border-[#334155] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="39:573" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="39:574" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:575" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="39:576" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[13px] whitespace-nowrap" data-node-id="39:577">
                    Slack Notifications
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:578">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#f8fafc] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="39:579">
                New direct message from Susan Vance (Director of Ops)
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[13px] text-ellipsis w-full" data-node-id="39:580">
                Hey, can you double check this vendor invoice for compliance? Let me know ASAP...
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0f172a] content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-node-id="39:581" data-name="Frame">
          <div className="bg-[#1e293b] border-[#334155] border-b border-solid content-stretch flex gap-[20px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-node-id="39:582" data-name="Frame">
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:583" data-name="legend-item">
              <div className="relative shrink-0 size-[8px]" data-node-id="39:584" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap" data-node-id="39:585">
                Correctly flagged
              </p>
            </div>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:586" data-name="legend-item">
              <div className="relative shrink-0 size-[8px]" data-node-id="39:587" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap" data-node-id="39:588">
                Missed flag
              </p>
            </div>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="39:589" data-name="legend-item">
              <div className="relative shrink-0 size-[8px]" data-node-id="39:590" data-name="Ellipse">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap" data-node-id="39:591">
                Not a real flag
              </p>
            </div>
          </div>
          <div className="border-[#334155] border-b border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-node-id="39:592" data-name="Frame">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:593" data-name="Frame">
              <div className="bg-[#7f1d1d] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="39:594" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[15px] whitespace-nowrap" data-node-id="39:595">
                  IT
                </p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="39:596" data-name="Frame">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[14px] w-full" data-node-id="39:597">{`IT Support Desk <it-support@secure-verify.example.net>`}</p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[12px] w-full" data-node-id="39:598">
                  To: john.doe@corporate-hq.com
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#f8fafc] text-[20px] whitespace-nowrap" data-node-id="39:599">
              Urgent: Direct Account Re-verification Needed
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[24px] relative w-full" data-node-id="39:600" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[22px] not-italic relative shrink-0 text-[#f8fafc] text-[14px] whitespace-nowrap" data-node-id="39:601">
              Dear Valued Employee,
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#f8fafc] text-[14px] w-[min-content]" data-node-id="39:602">
              Our Security Operations Center (SecOps) has flagged inconsistent LDAP authentication requests linked to your network profile over the last 24 hours. To ensure compliance with our updated multi-factor criteria and avoid immediate account suspension, you are required to re-authenticate.
            </p>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="39:603" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#f8fafc] text-[14px] w-[min-content]" data-node-id="39:604">
                <span className="leading-[24px]">{`Please click the `}</span>
                <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Bold'] font-bold leading-[24px] text-[#ef4444] underline">secure corporate bridge link</span>
                <span className="leading-[24px]">{` below to finish validation before the automatic cutoff deadline of `}</span>
                <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Bold'] font-bold leading-[24px] text-[#10b981] underline">5:00 PM today</span>
                <span className="leading-[24px]">.</span>
              </p>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="39:605" data-name="Frame">
                <div className="bg-[#064e3b] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="39:606" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap" data-node-id="39:607">
                    Urgency / deadline language
                  </p>
                  <div className="relative shrink-0 size-[12px]" data-node-id="39:608" data-name="Vector">
                    <div className="absolute inset-[-4.72%_-6.87%_-14.71%_-6.87%]">
                      <img alt="" className="block max-w-none size-full" src={imgVector} />
                    </div>
                  </div>
                </div>
                <div className="bg-[#7f1d1d] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-node-id="39:609" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap" data-node-id="39:610">
                    Suspicious / spoofed URL
                  </p>
                  <div className="relative shrink-0 size-[12px]" data-node-id="39:611" data-name="Vector">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#0f172a] border-[#334155] border-solid border-t content-stretch flex items-center justify-center p-[20px] relative shrink-0 w-full" data-node-id="39:612" data-name="Frame">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="39:613" data-name="Frame">
              <div className="relative shrink-0 size-[16px]" data-node-id="39:614" data-name="Vector">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[13px] whitespace-nowrap" data-node-id="39:615">
                Session submitted. Training actions are locked.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#111827] border-[#334155] border-l border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[320px]" data-node-id="39:616" data-name="Frame">
          <div className="border-[#334155] border-b border-solid content-stretch flex gap-[12px] items-center p-[20px] relative shrink-0 w-full" data-node-id="39:617" data-name="Frame">
            <div className="relative shrink-0 size-[32px]" data-node-id="39:618" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="39:620" data-name="Frame">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[15px]" data-node-id="39:621">
                AI Coach
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#10b981] text-[11px]" data-node-id="39:622">
                Online
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px p-[20px] relative w-full" data-node-id="39:623" data-name="Frame">
            <div className="bg-[#161f2e] content-stretch flex flex-col items-start p-[12px] relative rounded-br-[12px] rounded-tl-[12px] rounded-tr-[12px] shrink-0 w-full" data-node-id="39:624" data-name="chat-bubble">
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#f8fafc] text-[13px] w-full" data-node-id="39:625">
                I can see what you flagged — before I give you feedback, tell me in your own words: what made you suspicious about this email, and what do you think the attacker was trying to do?
              </p>
            </div>
          </div>
          <div className="border-[#334155] border-solid border-t content-stretch flex items-start p-[16px] relative shrink-0 w-full" data-node-id="39:626" data-name="Frame">
            <div className="bg-[#0f172a] border border-[#334155] border-solid content-stretch flex flex-[1_0_0] items-center min-w-px px-[12px] py-[10px] relative rounded-[8px]" data-node-id="39:627" data-name="Frame">
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]" data-node-id="39:628">
                Type your response…
              </p>
              <div className="relative shrink-0 size-[18px]" data-node-id="39:629" data-name="Vector">
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
