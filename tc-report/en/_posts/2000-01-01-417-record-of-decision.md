---
title: "A Tool for Record of Decision"
layout: post
lang: en
lang-ref: 417-record-of-decision
section: 4
category: 
hero:
  image:
    src: 4.17-tx-heading.jpg
    alt: A photo of someone taking pictures of hand drawn product prototypes.
  standards:
    - empower-staff
    - data
    - security
blocks:
  - type: tools
    tools:
      - name: Craft a Job Advertisement
        icon:
        status: disabled
        route: 
        title: Visit the job advertisement builder article.
      - name: Craft an Assessment Plan
        icon:
        status: disabled
        route: 
        title: Visit the assessment plan builder article.
      - name: Review Applications
        icon:
        status: disabled
        route: 
        title: Visit the application review article.
      - name: Record Applicant Assessment
        icon:
        status: active
        route: 
        title: Visit the record of decision article.
  - type: title
    label: Purpose of the Tool
  - As soon as managers start looking at the applications submitted to their job advertisement they start making decisions about which candidates are qualified and which candidates are not. Managers are required to record these decisions so they can be reviewed by their HR advisor, forming part of the official HR record, to ensure transparency and accountability in government job competitions.
  - The record of decision tool is intended to provide managers with a step by step process for reviewing job applications and recording the decisions made on the platform, in real-time as they progress through the staffing process. It organizes and presents the information provided by the applicant, as well as assessment decisions by managers at successive evaluation stages. The logic flow and standardization options are designed to facilitate a fast, accountable, consistent decision making process. Because of the different HR systems used by various HR advisors, the tool is also designed to produce an exportable record.
  - In the future the intention is to make this tool interoperable with the assessment planning tool, ratings guide builder, and applicant tracking system. This would also require the implementation of planned adjustments to these other tools to promote a smooth user experience and maximize pre-populated data and automated functionality across the platform.
  - type: title
    label: Current Status
  - The record of decision tool is in the advanced design phase of our product cycle, having gone through multiple rounds of iteration and mock process testing. However, without a Protected B server environment, we aren’t able to post assessment records on the platform because of the level of personal information they include. Because of this restriction against the tool hasn’t been released yet. 
  - High fidelity prototypes have been produced, with the help of input from several dozen managers and HR advisors in workshops, and through observation of the final HR steps required for live job processes in more than a dozen departments. The prototypes developed were then qualitatively tested with roughly a dozen HR advisors and managers, but the tool has not gone to the development team for coding.
  - type: title
    label: Insights
  - It remains a pain point for managers to capture a record of decision (decision and rationale) that meets the requirements of an accountable, transparent HR record. In essence, managers must account for their thinking as they review each applicant for each selection criteria during each assessment method applied. This also has a major impact on time-to-staff, as some of the work to record and report these decisions is often done retroactively at the end of the process. This can easily add weeks to the hiring process while managers and HR advisors go back-and-forth to ensure everything is in order.
  - The ways in which HR advisors require the selection decisions to be presented are based on years of practice and legal case precedent, but what is clear to HR is not always intuitive to managers. It would save managers a lot of time and effort if the platform was able to collect and present this information in a simple way that was validated by HR advisors as meeting policy requirements.
  - type: title
    label: Key Components of the Tool
  - type: subtitle
    label: Application Review Record
  - type: list
    style: unordered
    items:
      - Simple click-through process for reporting which candidates meet the education requirements with pre-populated text provided for the most common justifications, and the option to add additional notes or rationales.
  - type: graphic
    size: 100
    src: 4.17-en-application-review.png
    alt: "A screenshot of the assessment record of decision prototype. The prototyped aimed to allow managers to record their assessment decisions in a consistent and reliable way to ensure fairness and proper documentation. The manager could select whether the applicant met the criteria, and the reason behind their decision. Reasoning was organized such that the manager could select from a predetermined list or write their own custom entry to help alleviate decision paralysis."
  - type: list
    style: unordered
    items:
      - Similar click-through process for required and asset skills.
      - Clear indications to managers when a decision choice requires an additional explanation for the sake of HR accountability.
      - Optional notes section available at each step in case the manager wants to add more details.
      - The evidence provided by applicants is shown to managers, one skill at a time, so they can focus on the relevant information when making each decision.
      - As soon as an applicant is marked (and confirmed) as not meeting an essential requirement, they are moved to “no longer under consideration” in the applicant tracker and the manager is presented with a new application. Managers may review and amend this decision at any time.
      - “Still Thinking” option available at each step for managers in case they are uncertain. This allows the manager to keep working and come back later to make a final decision.
      - When an assessment method is added to the assessment plan, the need to complete a decision for the criteria being assessed is added automatically to the record.
      - Managers are able to see at a glance the strength of various applicants, and the overall “arc” of the staffing process in terms of how much is complete, what the attrition rate is for applicants at each stage, and how many applicants are deemed fully qualified.
      - Managers may also flag high-performing applicants per criteria per assessment method, which helps managers make evidence based decisions using high levels of detail gathered at each step. (The intention here is to provide a data source that can help prevent managers from being overly influenced by external factors that can artificially influence decision making, such as the initial and most recent applicants being more memorable or those with a more familiar life trajectory to the manager standing out as noteworthy.)
      - Summary page of all decisions available for HR, as well as the full record of decision per applicant per skill per assessment method.
  - type: graphic
    size: 100
    src: 4.17-en-applicant-comparison.png
    alt: "A screenshot of a job process results summary prototype that allowed HR advisors to view candidate decisions in a broad context. Candidates are organized by row, with their results indicated by checkmarks and \"x\" icons. Each candidates results are organized by skill, to help the HR advisor better understand where gaps exist."
---