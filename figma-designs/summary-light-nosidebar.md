# summary-light-nosidebar

- Figma node: 39:631
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=39-631&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Light-theme training summary screen highlighting completion status, score, metrics, and reviewed emails.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/0d60733b-5d84-4ede-b463-e4f4b8d7ce6b";
const imgMoon = "https://www.figma.com/api/mcp/asset/258eb10d-6446-4dea-beb6-c36095b64f71";
const imgEllipse = "https://www.figma.com/api/mcp/asset/31b06103-f95e-44e9-9d6f-cfd00fb39544";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/546e1eb2-b346-4ea8-b54d-9bb1148541bb";
const imgIconWrap = "https://www.figma.com/api/mcp/asset/33d03090-8503-4a07-92dc-00068edb418d";
const imgIconWrap1 = "https://www.figma.com/api/mcp/asset/145fb26c-6619-4cdc-894d-49d478136d76";
const imgIconWrap2 = "https://www.figma.com/api/mcp/asset/f2854e3d-a0df-4a8f-82b1-872eabd8a2fa";

export default function SummaryLightNosidebar() {
  return (
    <div className="bg-[#f8f9fc] content-stretch flex flex-col items-start relative size-full" data-node-id="39:631" data-name="summary-light-nosidebar">
      <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="39:632" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="39:633" data-name="brand">
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-node-id="39:634" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="39:820" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="39:637">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="39:638" data-name="header-controls">
          <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="39:639" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="39:640" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="39:642" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12px] whitespace-nowrap" data-node-id="39:643">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px p-[48px] relative w-full" data-node-id="39:644" data-name="Frame">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="39:645" data-name="Frame">
          <p className="font-['Inter:Extra_Bold'] font-extrabold relative shrink-0 text-[#1e293b] text-[28px]" data-node-id="39:646">
            Session Complete!
          </p>
          <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[15px]" data-node-id="39:647">
            Review your training stats and analyze session emails below.
          </p>
        </div>
        <div className="content-stretch flex flex-[1_0_0] gap-[40px] items-start min-h-px relative w-full" data-node-id="39:648" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[480px]" data-node-id="39:649" data-name="Frame">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[24px] items-start p-[32px] relative rounded-[16px] shrink-0 w-full" data-node-id="39:650" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap" data-node-id="39:651">
                SIMULATION SCORE
              </p>
              <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-node-id="39:652" data-name="Frame">
                <div className="content-stretch flex items-center justify-center relative shrink-0 size-[100px]" data-node-id="39:653" data-name="Frame">
                  <div className="relative shrink-0 size-[90px]" data-node-id="39:654" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <div className="absolute left-[5px] size-[90px] top-[5px]" data-node-id="39:655" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
                  </div>
                  <p className="[word-break:break-word] absolute font-['Inter:Extra_Bold'] font-extrabold leading-[normal] left-[calc(50%-24.5px)] not-italic text-[#1e293b] text-[22px] top-[calc(50%-13.5px)] whitespace-nowrap" data-node-id="39:656">
                    86%
                  </p>
                </div>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="39:657" data-name="Frame">
                  <div className="bg-[#d1fae5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:658" data-name="Frame">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap" data-node-id="39:659">
                      PASSED
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap" data-node-id="39:660">
                    Passing threshold: 80%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[16px] shrink-0 w-full" data-node-id="39:661" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap" data-node-id="39:662">
                METRICS BREAKDOWN
              </p>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="39:663" data-name="Frame">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:664" data-name="stat-row">
                  <div className="relative shrink-0 size-[32px]" data-node-id="39:665" data-name="icon-wrap">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconWrap} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:667" data-name="Frame">
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[13px]" data-node-id="39:668">
                      Simulation accuracy
                    </p>
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[15px]" data-node-id="39:669">
                      Identified 5 of 7 emails correctly
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:670" data-name="stat-row">
                  <div className="relative shrink-0 size-[32px]" data-node-id="39:671" data-name="icon-wrap">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconWrap1} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:673" data-name="Frame">
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[13px]" data-node-id="39:674">
                      Time elapsed
                    </p>
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[15px]" data-node-id="39:675">
                      12 minutes, 34 seconds
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:676" data-name="stat-row">
                  <div className="relative shrink-0 size-[32px]" data-node-id="39:677" data-name="icon-wrap">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconWrap2} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:679" data-name="Frame">
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[13px]" data-node-id="39:680">
                      Session path
                    </p>
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[15px]" data-node-id="39:681">
                      Assigned simulation path
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px relative" data-node-id="39:682" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap" data-node-id="39:683">
              EMAILS IN THIS SESSION
            </p>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="39:684" data-name="Frame">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="39:685" data-name="summary-email-row">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-node-id="39:686" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[13px] whitespace-nowrap" data-node-id="39:687">
                    IT
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:688" data-name="Frame">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[14px]" data-node-id="39:689">
                    IT Support Desk
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px]" data-node-id="39:690">
                    it-support@secure-verify.net
                  </p>
                  <p className="font-['Inter:Medium'] font-medium min-w-full overflow-hidden relative shrink-0 text-[#1e293b] text-[13px] text-ellipsis w-[min-content]" data-node-id="39:691">
                    Urgent: Direct Account Re-verification Needed
                  </p>
                </div>
                <div className="bg-[#d1fae5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:692" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap" data-node-id="39:693">
                    CORRECT
                  </p>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="39:694" data-name="summary-email-row">
                <div className="bg-[#fee2e2] content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-node-id="39:695" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[13px] whitespace-nowrap" data-node-id="39:696">
                    DO
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:697" data-name="Frame">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[14px]" data-node-id="39:698">
                    Docusign Office
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px]" data-node-id="39:699">
                    docusign@external.com
                  </p>
                  <p className="font-['Inter:Medium'] font-medium min-w-full overflow-hidden relative shrink-0 text-[#1e293b] text-[13px] text-ellipsis w-[min-content]" data-node-id="39:700">
                    Completed: Q3 Regional Budget Planning.pdf
                  </p>
                </div>
                <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:701" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap" data-node-id="39:702">
                    MISSED
                  </p>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="39:703" data-name="summary-email-row">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-node-id="39:704" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap" data-node-id="39:705">
                    HR
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:706" data-name="Frame">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[14px]" data-node-id="39:707">
                    HR Benefits Team
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px]" data-node-id="39:708">
                    benefits@corporate-hq.com
                  </p>
                  <p className="font-['Inter:Medium'] font-medium min-w-full overflow-hidden relative shrink-0 text-[#1e293b] text-[13px] text-ellipsis w-[min-content]" data-node-id="39:709">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
                </div>
                <div className="bg-[#e2e8f0] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:710" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="39:711">
                    LEGITIMATE
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[16px] items-center pt-[20px] relative shrink-0" data-node-id="39:712" data-name="Frame">
              <div className="border border-[#64748b] border-solid content-stretch flex items-start px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:713" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap" data-node-id="39:714">
                  Download Report
                </p>
              </div>
              <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[14px] underline whitespace-nowrap" data-node-id="39:715">
                Back to Training
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````
