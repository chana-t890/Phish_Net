# summary-dark-nosidebar

- Figma node: 39:717
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=39-717&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Dark-theme training summary screen that mirrors the light version with dark surfaces and high-contrast labels.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/3ec1ac03-2035-44ad-99ab-7e3324426ded";
const imgMoon = "https://www.figma.com/api/mcp/asset/32d97859-8b7d-418a-81c8-4e59aa36ff08";
const imgEllipse = "https://www.figma.com/api/mcp/asset/94a26742-c932-43cf-8b27-b2094d39dda9";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/168d583a-a222-413d-89ed-58b3a294d313";
const imgIconWrap = "https://www.figma.com/api/mcp/asset/69434f0e-6b19-43dc-873e-cec4bca70f5a";
const imgIconWrap1 = "https://www.figma.com/api/mcp/asset/d99c4351-e3dc-4ed5-856b-9f2725a0f0b5";
const imgIconWrap2 = "https://www.figma.com/api/mcp/asset/eb5b6c0a-b919-40d1-aecf-71f953643257";

export default function SummaryDarkNosidebar() {
  return (
    <div className="bg-[#0f172a] content-stretch flex flex-col items-start relative size-full" data-node-id="39:717" data-name="summary-dark-nosidebar">
      <div className="bg-[#111827] border-[#334155] border-b border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="39:718" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="39:719" data-name="brand">
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-node-id="39:720" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="39:822" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="39:723">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="39:724" data-name="header-controls">
          <div className="bg-[#0f172a] border border-[#334155] border-solid content-stretch flex items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="39:725" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="39:726" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#1e293b] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="39:728" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12px] whitespace-nowrap" data-node-id="39:729">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px p-[48px] relative w-full" data-node-id="39:730" data-name="Frame">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="39:731" data-name="Frame">
          <p className="font-['Inter:Extra_Bold'] font-extrabold relative shrink-0 text-[#f8fafc] text-[28px]" data-node-id="39:732">
            Session Complete!
          </p>
          <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[15px]" data-node-id="39:733">
            Review your training stats and analyze session emails below.
          </p>
        </div>
        <div className="content-stretch flex flex-[1_0_0] gap-[40px] items-start min-h-px relative w-full" data-node-id="39:734" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[480px]" data-node-id="39:735" data-name="Frame">
            <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch flex flex-col gap-[24px] items-start p-[32px] relative rounded-[16px] shrink-0 w-full" data-node-id="39:736" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap" data-node-id="39:737">
                SIMULATION SCORE
              </p>
              <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-node-id="39:738" data-name="Frame">
                <div className="content-stretch flex items-center justify-center relative shrink-0 size-[100px]" data-node-id="39:739" data-name="Frame">
                  <div className="relative shrink-0 size-[90px]" data-node-id="39:740" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <div className="absolute left-[5px] size-[90px] top-[5px]" data-node-id="39:741" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
                  </div>
                  <p className="[word-break:break-word] absolute font-['Inter:Extra_Bold'] font-extrabold leading-[normal] left-[calc(50%-24.5px)] not-italic text-[#f8fafc] text-[22px] top-[calc(50%-13.5px)] whitespace-nowrap" data-node-id="39:742">
                    86%
                  </p>
                </div>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="39:743" data-name="Frame">
                  <div className="bg-[#d1fae5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:744" data-name="Frame">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap" data-node-id="39:745">
                      PASSED
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[13px] whitespace-nowrap" data-node-id="39:746">
                    Passing threshold: 80%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch flex flex-col gap-[20px] items-start p-[28px] relative rounded-[16px] shrink-0 w-full" data-node-id="39:747" data-name="Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap" data-node-id="39:748">
                METRICS BREAKDOWN
              </p>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="39:749" data-name="Frame">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:750" data-name="stat-row">
                  <div className="relative shrink-0 size-[32px]" data-node-id="39:751" data-name="icon-wrap">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconWrap} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:753" data-name="Frame">
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[13px]" data-node-id="39:754">
                      Simulation accuracy
                    </p>
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[15px]" data-node-id="39:755">
                      Identified 5 of 7 emails correctly
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:756" data-name="stat-row">
                  <div className="relative shrink-0 size-[32px]" data-node-id="39:757" data-name="icon-wrap">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconWrap1} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:759" data-name="Frame">
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[13px]" data-node-id="39:760">
                      Time elapsed
                    </p>
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[15px]" data-node-id="39:761">
                      12 minutes, 34 seconds
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="39:762" data-name="stat-row">
                  <div className="relative shrink-0 size-[32px]" data-node-id="39:763" data-name="icon-wrap">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconWrap2} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:765" data-name="Frame">
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[13px]" data-node-id="39:766">
                      Session path
                    </p>
                    <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[15px]" data-node-id="39:767">
                      Assigned simulation path
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px relative" data-node-id="39:768" data-name="Frame">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap" data-node-id="39:769">
              EMAILS IN THIS SESSION
            </p>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="39:770" data-name="Frame">
              <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="39:771" data-name="summary-email-row">
                <div className="bg-[#1e293b] content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-node-id="39:772" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[13px] whitespace-nowrap" data-node-id="39:773">
                    IT
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:774" data-name="Frame">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[14px]" data-node-id="39:775">
                    IT Support Desk
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[12px]" data-node-id="39:776">
                    it-support@secure-verify.net
                  </p>
                  <p className="font-['Inter:Medium'] font-medium min-w-full overflow-hidden relative shrink-0 text-[#f8fafc] text-[13px] text-ellipsis w-[min-content]" data-node-id="39:777">
                    Urgent: Direct Account Re-verification Needed
                  </p>
                </div>
                <div className="bg-[#064e3b] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:778" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap" data-node-id="39:779">
                    CORRECT
                  </p>
                </div>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="39:780" data-name="summary-email-row">
                <div className="bg-[#7f1d1d] content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-node-id="39:781" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[13px] whitespace-nowrap" data-node-id="39:782">
                    DO
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:783" data-name="Frame">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[14px]" data-node-id="39:784">
                    Docusign Office
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[12px]" data-node-id="39:785">
                    docusign@external.com
                  </p>
                  <p className="font-['Inter:Medium'] font-medium min-w-full overflow-hidden relative shrink-0 text-[#f8fafc] text-[13px] text-ellipsis w-[min-content]" data-node-id="39:786">
                    Completed: Q3 Regional Budget Planning.pdf
                  </p>
                </div>
                <div className="bg-[#7f1d1d] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:787" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap" data-node-id="39:788">
                    MISSED
                  </p>
                </div>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="39:789" data-name="summary-email-row">
                <div className="bg-[#1e293b] content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-node-id="39:790" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[13px] whitespace-nowrap" data-node-id="39:791">
                    HR
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="39:792" data-name="Frame">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#f8fafc] text-[14px]" data-node-id="39:793">
                    HR Benefits Team
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#94a3b8] text-[12px]" data-node-id="39:794">
                    benefits@corporate-hq.com
                  </p>
                  <p className="font-['Inter:Medium'] font-medium min-w-full overflow-hidden relative shrink-0 text-[#f8fafc] text-[13px] text-ellipsis w-[min-content]" data-node-id="39:795">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
                </div>
                <div className="bg-[#334155] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="39:796" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap" data-node-id="39:797">
                    LEGITIMATE
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[16px] items-center pt-[20px] relative shrink-0" data-node-id="39:798" data-name="Frame">
              <div className="border border-[#94a3b8] border-solid content-stretch flex items-start px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="39:799" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap" data-node-id="39:800">
                  Download Report
                </p>
              </div>
              <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[14px] underline whitespace-nowrap" data-node-id="39:801">
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
