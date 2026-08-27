# inbox-no-sidebar-light

- Figma node: 35:4
- URL: https://www.figma.com/design/WJ7e1UBVrA4PTuQyKEjCvz/PhishNet?timeline=keyframe&node-id=35-4&t=xd6NhUOvNyLR8nUr-11
- Source: Figma design export captured from the linked frame

## Summary
Light-theme inbox experience with a header, email list pane, reading pane, attachment actions, and an avatar dropdown.

## Full Figma export

````tsx
const imgFishingHook = "https://www.figma.com/api/mcp/asset/feb33195-b1c3-408e-8b01-50130c86cc2e";
const imgMoon = "https://www.figma.com/api/mcp/asset/f79e9d44-f3ba-447b-85c9-396f3ea025a2";
const imgEllipse = "https://www.figma.com/api/mcp/asset/c8dc6351-7fe9-4679-a1ce-0dc7872a33f2";
const imgFrame = "https://www.figma.com/api/mcp/asset/5a40d3ec-fcae-46e8-8f05-19bb3fecc0d2";
const imgVector = "https://www.figma.com/api/mcp/asset/8ee30589-8f41-49ae-bbe5-554e8ee4f23d";
const imgVector1 = "https://www.figma.com/api/mcp/asset/4840577e-7775-428f-8222-cb134c5b11db";
const imgLogOut = "https://www.figma.com/api/mcp/asset/a8207f14-03a4-4afa-8cee-ae45d6d0518c";

export default function InboxNoSidebarLight() {
  return (
    <div className="bg-[#f8f9fc] content-stretch flex flex-col items-start relative size-full" data-node-id="35:4" data-name="inbox-no-sidebar-light">
      <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[48px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="35:5" data-name="top-header">
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-node-id="35:6" data-name="brand">
          <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[32px]" data-node-id="35:7" data-name="logo-icon-container">
            <div className="relative shrink-0 size-[28px]" data-node-id="35:92" data-name="fishing-hook">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFishingHook} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[20px] whitespace-nowrap" data-node-id="35:9">
            PhishNet
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="35:96" data-name="header-controls">
          <div className="bg-[#f8f9fc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[13px] shrink-0 size-[26px]" data-node-id="35:97" data-name="dark-mode-toggle">
            <div className="relative shrink-0 size-[14px]" data-node-id="35:108" data-name="moon">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoon} />
            </div>
          </div>
          <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="35:10" data-name="avatar">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[12.8px] whitespace-nowrap" data-node-id="35:11">
              JD
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-node-id="35:12" data-name="content-main">
        <div className="bg-white border-[#e2e8f0] border-r border-solid content-stretch flex flex-col h-full items-start relative shrink-0 w-[320px]" data-node-id="35:13" data-name="email-list-panel">
          <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center leading-[normal] not-italic p-[20px] relative shrink-0 w-full whitespace-nowrap" data-node-id="35:14" data-name="list-header">
            <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[18px]" data-node-id="35:15">
              Inbox
            </p>
            <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[13px]" data-node-id="35:16">
              5 unread
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="35:17" data-name="email-rows">
            <div className="bg-[#eff6ff] border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="35:18" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="35:19" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="35:20" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="35:21" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="35:22">
                    IT Support Desk
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="35:23">
                  10:42 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="35:24">
                Urgent: Direct Account Re-verification Needed
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="35:25">
                We have detected temporary irregular connection patterns on your LDAP account. To avoid suspension, please re-authenticate within...
              </p>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="35:26" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="35:27" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="35:28" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="35:29" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="35:30">
                    Docusign Office
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="35:31">
                  9:15 AM
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="35:32">
                Completed: Q3 Regional Budget Planning.pdf
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="35:33">
                Please find the completed document regarding regional strategy and financial sign-off for execution starting...
              </p>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="35:34" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="35:35" data-name="row-top">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="35:36" data-name="sender-group">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="35:37">
                    HR Benefits Team
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="35:38">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] min-w-full not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-[min-content] whitespace-nowrap" data-node-id="35:39">{`Changes to Health Insurance Coverage & Direct Deposit`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-[min-content]" data-node-id="35:40">
                The updated benefits enrollment portal is open now. Please confirm your direct deposit details and health option allocations...
              </p>
              <div className="content-stretch flex gap-[4px] items-center pt-[4px] relative shrink-0" data-node-id="35:41" data-name="status-row">
                <div className="relative shrink-0 size-[14px]" data-node-id="35:42" data-name="Frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[10px] whitespace-nowrap" data-node-id="35:44">
                  Handled correctly (Reported)
                </p>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="35:45" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="35:46" data-name="row-top">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="35:47" data-name="sender-group">
                  <div className="relative shrink-0 size-[8px]" data-node-id="35:48" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="35:49">
                    Slack Notifications
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="35:50">
                  Yesterday
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="35:51">
                New direct message from Susan Vance (Director of Ops)
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="35:52">{`"Hey, can you double check this vendor invoice for compliance? Let me know ASAP as she wants validation today..."`}</p>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[6px] items-start p-[16px] relative shrink-0 w-full" data-node-id="35:53" data-name="email-row">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="35:54" data-name="row-top">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="35:55" data-name="sender-group">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="35:56">
                    Weekly Team Lunch
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap" data-node-id="35:57">
                  Jul 10
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#1e293b] text-[12px] text-ellipsis w-full whitespace-nowrap" data-node-id="35:58">{`Menu Selections: Friday Catering & Dietary Restrictions`}</p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-full" data-node-id="35:59">{`Hope you are all having a great week! Let's choose our meal formats and note any severe food allergy parameters on...`}</p>
            </div>
          </div>
        </div>
        <div className="bg-white content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-node-id="35:60" data-name="reading-pane">
          <div className="border-[#e2e8f0] border-b border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-node-id="35:61" data-name="email-header">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="35:62" data-name="fields">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="35:63" data-name="from-row">
                <div className="bg-[#fee2e2] content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="35:64" data-name="Frame">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[15px] whitespace-nowrap" data-node-id="35:65">
                    IT
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="35:66" data-name="sender-details">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1e293b] text-[14px] w-full" data-node-id="35:67">{`IT Support Desk <it-support@secure-verify.example.net>`}</p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px] w-full" data-node-id="35:68">
                    To: john.doe@corporate-hq.com
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap" data-node-id="35:69">
                  Today at 10:42 AM
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[20px] w-full" data-node-id="35:70">
              Urgent: Direct Account Re-verification Needed
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-node-id="35:71" data-name="email-body">
            <div className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[16px] items-start leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[14px] w-full" data-node-id="35:72" data-name="body-paragraphs">
              <p className="relative shrink-0 w-full" data-node-id="35:73">
                Dear Valued Employee,
              </p>
              <p className="relative shrink-0 w-full" data-node-id="35:74">
                Our Security Operations Center (SecOps) has flagged inconsistent LDAP authentication requests linked to your network profile over the last 24 hours. To ensure compliance with our updated multi-factor criteria and avoid immediate account suspension, you are required to re-authenticate.
              </p>
              <p className="relative shrink-0 w-full" data-node-id="35:75">
                Please click the secure corporate bridge link below to finish validation before the automatic cutoff deadline of 5:00 PM today.
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="35:76" data-name="attachment-wrapper">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap" data-node-id="35:77">
                Attachments (1)
              </p>
              <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[320px]" data-node-id="35:78" data-name="attachment-chip">
                <div className="relative shrink-0 size-[20px]" data-node-id="35:79" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="35:80" data-name="Frame">
                  <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#1e293b] text-[13px] w-full" data-node-id="35:81">
                    LDAP_Instruction_Manual.pdf
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[11px] w-full" data-node-id="35:82">
                    420 KB · Adobe PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f8f9fc] border-[#e2e8f0] border-solid border-t content-stretch flex items-center justify-between p-[24px] relative shrink-0 w-full" data-node-id="35:83" data-name="email-actions-footer">
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-node-id="35:84" data-name="action-button-group">
              <div className="border-[#4f8ef7] border-[1.5px] border-solid content-stretch flex items-center px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="35:85" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#4f8ef7] text-[13px] whitespace-nowrap" data-node-id="35:86">
                  Clear Flags
                </p>
              </div>
              <div className="bg-[#ef4444] content-stretch flex gap-[8px] items-center px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="35:87" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-node-id="35:88" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector1} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="35:89">
                  Finish and Report
                </p>
              </div>
              <div className="bg-[#4f8ef7] content-stretch flex items-center px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-node-id="35:90" data-name="Frame">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="35:91">
                  Mark as Legitimate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(0,0,0,0.08)] flex flex-col gap-[12px] items-start p-[12px] right-[24px] rounded-[12px] top-[56px] w-[240px]" data-node-id="35:99" data-name="avatar-dropdown">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-node-id="35:100" data-name="user-info">
          <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#1e293b] text-[14px] w-full" data-node-id="35:101">
            John Doe
          </p>
          <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px] w-full" data-node-id="35:102">
            john.doe@corporate-hq.com
          </p>
        </div>
        <div className="bg-[#e2e8f0] h-px relative shrink-0 w-full" data-node-id="35:103" data-name="divider" />
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-node-id="35:104" data-name="log-out-row">
          <div className="relative shrink-0 size-[18px]" data-node-id="35:111" data-name="log-out">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogOut} />
          </div>
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap" data-node-id="35:106">
            Log out
          </p>
        </div>
      </div>
    </div>
  );
}
````
