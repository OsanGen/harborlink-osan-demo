// Verbatim teaching copy from 01_PAGE_TEXT_README.md in handoff revision 1.
// The C01–C16 identifiers are the package's copy-ledger references. HTML is
// static source markup; scene progress and presentation controls live elsewhere.
const context = 'HarborLink Mobile | Fictional case | Prepared example';
const proposedWorkflow = 'Designing the proposed workflow';

function paragraph(text) {
  return `<p>${text}</p>`;
}

function blockHeading(text) {
  return `<h3>${text}</h3>`;
}

function orderedList(items) {
  return `<ol>${items.map(item => `<li>${item}</li>`).join('')}</ol>`;
}

function unorderedList(items) {
  return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function page({ id, title, workflowContext = '', introduction = '', blocks, notes, takeaway, parts }) {
  const firstBlock = `${id}-C01`;
  const header = `<h2>${title}</h2>${paragraph(context)}`;
  const workflow = workflowContext ? paragraph(workflowContext) : '';
  const allBlocks = { [firstBlock]: header + workflow + introduction, ...blocks };
  const audience = Object.keys(allBlocks).filter(key => !notes.includes(key));
  return { id, title, context, workflowContext, blocks: allBlocks, audience, notes, takeaway, parts };
}

const openingIntro = `<p>A restaurant needs an operating plan before it opens. An AI assistant needs a defined job, usable information, and clear human responsibilities.</p>`;
const openingQuestions = ["What work needs doing?", "What can the assistant prepare?", "Who makes the decision?"];
const connectionIntro = `<p>Before connecting the assistant, identify the information it needs, who owns it, and what access is permitted.</p>`;

const workflowHeading = `<h3>The proposed workflow</h3>`;
const workflowSteps = [
  { name: "Trigger", description: "A new request arrives." },
  { name: "Classify", description: "Identify the request and relevant risks." },
  { name: "Prioritize", description: "Suggest its urgency." },
  { name: "Route", description: "Recommend the responsible team or person." },
  { name: "Draft", description: "Prepare a reply for human review." },
  { name: "Log", description: "Record evidence, recommendations, uncertainty, and confirmed actions separately." },
  { name: "Escalate", description: "Refer cases needing human review." },
];
function workflowRange(start, end) {
  const items = workflowSteps.slice(start - 1, end).map(({ name, description }) =>
    `<li><strong>${name}:</strong> ${description}</li>`
  );
  return `<ol start="${start}">${items.join('')}</ol>`;
}
const workflowThroughout = `<p>Logging and escalation apply throughout, not only at the end.</p>`;
const savedHeading = `<h3>Ticket A in the saved example</h3>`;
const savedFields = {
  classification: ['Classification', 'Billing-charge explanation.'],
  priority: ['Priority', 'Proposed normal pending account check.'],
  owner: ['Suggested owner', 'Billing Specialist.'],
  confidence: ['Confidence', 'Unknown, not scored.'],
  reply: ['Ticket A reply', 'Not generated in the supplied saved example.'],
};

const systemHeading = `<h3>HarborLink's proposed system environment</h3>`;
const systemNames = ["Zendesk", "Salesforce", "Legacy billing platform", "SharePoint", "Email and web chat", "Power BI"];
const systemDescriptions = [
  `<strong>Zendesk:</strong> Tickets, assignment history, internal notes, and response drafts.`,
  `<strong>Salesforce:</strong> Customer and account context.`,
  `<strong>Legacy billing platform:</strong> Plan details, charges, and billing history.`,
  `<strong>SharePoint:</strong> Billing policies and support knowledge articles.`,
  `<strong>Email and web chat:</strong> Customer intake channels.`,
  `<strong>Power BI:</strong> Operational reporting.`,
];
const legacyDefinition = `<p>A legacy system is an older system already in use.</p>`;
const glossaryHeading = `<h3>Terms used in the integration plan</h3>`;
const integrationApiText = `<p><strong>Integration:</strong> A connection through which systems exchange information or request permitted actions.</p>
<p><strong>Application Programming Interface (API):</strong> A defined way for software to request data or actions from another system.</p>`;
const mcpDefinition = `<p><strong>Model Context Protocol (MCP):</strong> A shared standard connecting AI applications to external tools and data.</p>`;
const middlewareDefinition = `<p><strong>Middleware:</strong> Software between existing and new systems that translates data and routes requests.</p>`;
const mcpRelationship = `<p>An MCP connection can use an application's API underneath. MCP and APIs are not necessarily alternatives.</p>`;
const integrationApi = `${glossaryHeading}${integrationApiText}`;
const mcp = `${glossaryHeading}${mcpDefinition}${mcpRelationship}`;
const middleware = `${glossaryHeading}${middlewareDefinition}`;

const incidentHeading = `<h3>I-01: Separate supplied incident</h3>`;
const incidentDescription = `<p>The customer reports repeated contact and disputes the charge. The supplied incident includes two open tickets, conflicting policies, and an unavailable billing lookup.</p>`;
const incidentNonLinkage = `<p>No connection between I-01 and Ticket A is established in the sources.</p>`;
const incidentIdentity = `${incidentHeading}${incidentNonLinkage}`;
const incidentSummary = `${incidentHeading}${incidentDescription}${incidentNonLinkage}`;
const incidentEvidenceHeading = `<h3>The evidence problem</h3>`;
const incidentChangesHeading = `<h3>What changes in the plan?</h3>`;
const incidentEvidencePolicyA = `<p>Two policy documents conflict.</p>`;
const incidentEvidencePolicyB = `<p>Neither is identified as the current approved policy.</p>`;
const incidentEvidenceBilling = `<p>The supplied billing lookup timed out.</p>`;
const incidentChange1 = `<p>CHANGED: Policy interpretation is on hold.</p>`;
const incidentChange2 = `<p>CONFIRMED: Suggestion-only and privacy limits remain.</p>`;
const incidentChange3 = `<p>CHANGED: Manual billing verification is required for I-01.</p>`;
const incidentControlHeading = `<h3>Control labels</h3>`;
const incidentIntroduceLabel = "Introduce I-01";
const incidentDraftLabel = "Read the prepared draft";
const incidentReportTitle = "Customer report, not verified account facts";
const incidentReportBody = `<blockquote><p>“This is my third attempt to fix this. My bill shows $186 in data-overage charges after HarborLink moved me to the new plan. I was told the plan included this usage. If this is not fixed today, I am canceling and disputing the charge. Your own help pages say different things.”</p></blockquote>`;

const pilotTableHeading = `<h3>Exactly three fictional pilot targets</h3>`;
const pilotColumns = ['Measure', 'Fictional baseline', 'Proposed target'];
const pilotTableHeaders = `<tr role="row">${pilotColumns.map(column =>
  `<th scope="col" role="columnheader">${column}</th>`
).join('')}</tr>`;
const pilotRows = [
  ['Average first response', '9.4 hours', '6 hours or less'],
  ['Tickets reassigned at least once', '24%', '15% or less'],
  ['Repeat contact within 72 hours', '18%', '13% or less'],
];

function pilotRow([measure, ...values], showStackedLabels = false) {
  const cells = values.map((value, index) => {
    const label = showStackedLabels
      ? `<span class="late-cell-label" aria-hidden="true">${pilotColumns[index + 1]}</span>`
      : '';
    return `<td role="cell">${label}${value}</td>`;
  });
  return `<th scope="row" role="rowheader">${measure}</th>${cells.join('')}`;
}

const [pilotTableRow1, pilotTableRow2, pilotTableRow3] = pilotRows.map(row => pilotRow(row, true));
const pilotTable = `<table><thead>${pilotTableHeaders}</thead><tbody>${pilotRows.map(row =>
  `<tr>${pilotRow(row)}</tr>`
).join('')}</tbody></table>`;
const pilotResults = `<p>Results: Not supplied.</p>`;
const measureDefinitionsLabel = 'What counts';
const measureDefinitionsHeading = blockHeading(measureDefinitionsLabel);
const measureDefinition1 = "A human-issued first reply, not merely a generated draft.";
const measureDefinition2 = "Actual ticket reassignments, not recommended moves.";
const measureDefinition3 = "Repeat contact measured after the required 72-hour follow-up window.";

const connectedWorkHeading = `<h3>The connected work</h3>`;
const artifactTitles = [
  "A01 | Agent Operating Specification",
  "A02 | System Access and Integration Map",
  "A03 | Incident Stress Test and Risk Register",
  "A04 | Two-Week Pilot Charter",
  "A05 | Leadership Email First Draft",
  "A06 | Final Leadership Email",
];
const artifactDescriptions = [
  'Define the job, workflow, and limits.',
  'Identify needed information, proposed access, and unresolved constraints.',
  'Record how the difficult case changes or confirms the plan.',
  'Set the proposed scope, owner, three targets, and stop conditions.',
  'Historical draft.',
  'Current recommendation in the saved example.',
];
const [artifact1, artifact2, artifact3, artifact4, artifact5, artifact6] = artifactTitles.map(
  (title, index) => `<h4>${title}</h4>${paragraph(artifactDescriptions[index])}`
);
const artifacts1to4 = `${connectedWorkHeading}${artifact1}${artifact2}${artifact3}${artifact4}`;
const artifacts5to6 = `${artifact5}${artifact6}`;
const artifactNames1to4 = orderedList(artifactTitles.slice(0, 4));
const artifactNames = orderedList(artifactTitles);
const handoffHeading = `<h3>The intended handoff</h3>`;
const handoffWorkOutput = `<p>Work output: Complete A01-A06, including both email versions.</p>`;
const handoffMatching = `<p>Matching run handoff: Supporting evidence, requirements, checks, unresolved issues, and instructions for the review site.</p>`;
const handoffIntendedSite = `<p>Intended review site: The same work organized for inspection, not a replacement for its evidence.</p>`;
const handoffCurrentPair = `<p>Current saved pair: Requires the updated Prompt 6 export before acceptance under the revised Part 2 contract.</p>`;
const traceControlHeading = `<h3>Control label</h3>`;
const traceLabel = "Trace this finding";

export const lessonPages = [
  page({
    id: "S001",
    title: "Design the service before opening",
    workflowContext: proposedWorkflow,
    introduction: `${openingIntro}${openingQuestions.map(paragraph).join('')}`,
    blocks: {
      "S001-C02": `<h3>The case</h3>
        <p>Customers question unexpected charges after a billing-plan migration and repeat their stories across support teams.</p>`,
      "S001-C03": `<h3>The proposed assistant</h3>
        <p>Help employees classify requests, recommend the right team, and prepare replies for review.</p>`,
      "S001-C04": `<h3>What we are creating</h3>
        <p>A01 | Agent Operating Specification</p>
        <p>A written description of the assistant's job, workflow, and limits.</p>`,
      "S001-C05": `<h3>Takeaway</h3>
        <p>Plan the service before giving the assistant access.</p>`,
      "S001-C06": `<p>“You've just seen why an agent needs a workflow, connections, and clear responsibilities. Think of opening a restaurant. A menu tells you what is offered; an operating plan explains how the service will work.</p>
        <p>HarborLink has a billing-support problem. Customers question charges and repeat their stories as requests move between teams. The proposed assistant would help employees organize those requests and prepare replies.</p>
        <p>Our first output is the operating specification: the written description of the job, the steps, and the limits. This is a proposal-design exercise. We are not opening a live support service. The restaurant comparison helps explain responsibilities; it does not give the software human judgment or authority.”</p>`,
    },
    notes: ["S001-C06"],
    takeaway: "S001-C05",
    parts: {
      intro: openingIntro,
      questions: openingQuestions,
    },
  }),
  page({
    id: "S002",
    title: "Prepare the next action",
    workflowContext: proposedWorkflow,
    blocks: {
      "S002-C02": `<h3>Ticket A: Customer report</h3>
        <blockquote><p>“My first bill after moving to FlexPlus is $43 higher. Can someone explain the new data charge?”</p></blockquote>`,
      "S002-C03": `<h3>Triage</h3>
        <p>Sort the request, assess urgency, and recommend who should handle it.</p>`,
      "S002-C04": `${workflowHeading}${workflowRange(1, 7)}${workflowThroughout}`,
      "S002-C05": `${savedHeading}${Object.values(savedFields).map(([label, value]) => `<p>${label}: ${value}</p>`).join('')}`,
      "S002-C06": `<h3>Human responsibility</h3>
        <p>People move tickets and send customer messages.</p>`,
      "S002-C07": `<h3>Takeaway</h3>
        <p>A recommendation is not a completed action. A draft is not a sent reply.</p>`,
      "S002-C08": `<p>“Here is Ticket A. The customer reports a higher bill, but the reason for the charge has not been verified. Sorting the request, assessing urgency, and suggesting who should handle it is triage.</p>
        <p>The operating specification uses seven steps: trigger, classify, prioritize, route, draft, log, and escalate. In this pilot, route means recommend a destination. A person makes the actual ticket move and sends any customer message.</p>
        <p>The saved example proposes a billing-charge classification and a Billing Specialist. It does not contain a Ticket A reply or a measured confidence score. Those missing outputs stay missing.</p>
        <p>Logging and escalation apply throughout. A sensitive or uncertain case should not wait until the final step for human review. Watch for these distinctions in A01.”</p>`,
    },
    notes: ["S002-C08"],
    takeaway: "S002-C07",
    parts: {
      workflowSteps,
      workflowHeading,
      workflowThroughout,
      savedHeading,
      savedFields,
    },
  }),
  page({
    id: "S003",
    title: "What information does this service need?",
    workflowContext: proposedWorkflow,
    introduction: connectionIntro,
    blocks: {
      "S003-C02": `${systemHeading}${unorderedList(systemDescriptions)}${legacyDefinition}`,
      "S003-C03": `${glossaryHeading}${integrationApiText}${mcpDefinition}${middlewareDefinition}${mcpRelationship}`,
      "S003-C04": `<h3>Three questions to resolve</h3>
        <p>Do the customer identifiers match?</p>
        <p>Which policy is the current approved version?</p>
        <p>Is the billing information current enough for this decision?</p>`,
      "S003-C05": `<h3>Status</h3>
        <p>Proposed connections. Access and behavior unverified. No live connections in this demonstration.</p>`,
      "S003-C06": `<h3>Demo output</h3>
        <p>A02 | System Access and Integration Map</p>`,
      "S003-C07": `<h3>Takeaway</h3>
        <p>A connection plan is not proof that the connection works or that its data is suitable.</p>`,
      "S003-C08": `<p>“A restaurant station needs the right ingredients. The proposed assistant needs the right information: the request, the customer context, the billing record, and the approved policy.</p>
        <p>The system map asks where that information comes from and whether the assistant could use it with permission. An API is a defined way to request data or actions. MCP is a shared standard for connecting AI applications to tools and data. An MCP connection can use an API underneath. Middleware is connecting software that can translate data and route requests.</p>
        <p>HarborLink still has practical questions: identifiers may not match, policy versions may be unclear, and billing information may be stale. In A02, watch for those constraints and the manual fallback, not just the proposed connection.”</p>`,
    },
    notes: ["S003-C08"],
    takeaway: "S003-C07",
    parts: {
      intro: connectionIntro,
      systemHeading,
      systemNames,
      systemDescriptions,
      legacyDefinition,
      integrationApi,
      mcp,
      middleware,
    },
  }),
  page({
    id: "S004",
    title: "What changes when the evidence conflicts?",
    workflowContext: proposedWorkflow,
    blocks: {
      "S004-C02": incidentSummary,
      "S004-C03": `${incidentEvidenceHeading}${incidentEvidencePolicyA}${incidentEvidencePolicyB}${incidentEvidenceBilling}`,
      "S004-C04": `<h3>Can continue</h3>
        <p>Summarize the issue without unnecessary personal details.</p>
        <p>Identify the evidence still needed.</p>
        <p>Prepare a response for human review.</p>`,
      "S004-C05": `<h3>Must wait for verification</h3>
        <p>Account-specific conclusions.</p>
        <p>A conclusion about which policy applies.</p>`,
      "S004-C06": `<h3>Outside the assistant's authority</h3>
        <p>Issue a credit, change a plan, settle a dispute, or send an external response.</p>`,
      "S004-C07": `<h3>Human review needed</h3>
        <p>Billing Specialist and Billing Policy Owner.</p>`,
      "S004-C08": `${incidentChangesHeading}${incidentChange1}${incidentChange2}${incidentChange3}`,
      "S004-C09": `<h3>Takeaway</h3>
        <p>Acknowledge the concern. Explain the next supported step. Do not invent the answer or promise an outcome.</p>`,
      "S004-C10": `<h3>Question</h3>
        <p>What can we still prepare, and what must wait for verification?</p>`,
      "S004-C11": `<h3>Answer</h3>
        <p>We can prepare a summary, identify missing evidence, and draft a reply for human review. Account-specific conclusions and policy interpretation must wait. Credits, plan changes, dispute settlements, and external sends remain outside the assistant's authority.</p>`,
      "S004-C12": `${incidentControlHeading}${paragraph(incidentIntroduceLabel)}${paragraph(incidentDraftLabel)}`,
      "S004-C13": `${blockHeading(incidentReportTitle)}${incidentReportBody}`,
      "S004-C14": `<h3>Additional evidence note</h3>
        <p>The supplied incident includes a 19-hour-old billing sync and a timed-out lookup. The sync age does not establish that the account information is current enough. The timeout is simulated case evidence, not a live request made in this demonstration.</p>`,
      "S004-C15": `<h3>Draft for human review. Not sent.</h3>
        <p>I'm sorry you've had to contact HarborLink repeatedly about these charges. A billing specialist needs to review the charge details and confirm which approved policy applies before we can give you an accurate answer. A member of the support team can review your existing requests and explain the next steps after the relevant records and policy are verified.</p>`,
      "S004-C16": `<p>“We now introduce I-01, a separate supplied incident. We have no evidence linking it to Ticket A. The customer has contacted support repeatedly, two policy documents conflict, and the supplied billing lookup has timed out.</p>
        <p>What can we still prepare, and what must wait for verification?</p>
        <p>We can summarize the issue, identify missing evidence, and prepare a reply for human review. We cannot establish the applicable policy or the account-specific answer from this evidence. A credit promise would also exceed the assistant's authority.</p>
        <p>Empathy here means acknowledging the repeated contact and explaining an honest next step. It does not mean inventing a reassuring outcome. A03 records two changes and one confirmation: hold policy interpretation, require manual billing verification, and keep the existing suggestion-only and privacy limits.”</p>`,
    },
    notes: ["S004-C16"],
    takeaway: "S004-C09",
    parts: {
      incidentIdentity,
      incidentEvidenceHeading,
      incidentEvidencePolicyA,
      incidentEvidencePolicyB,
      incidentEvidenceBilling,
      incidentReportTitle,
      incidentReportBody,
      incidentIntroduceLabel,
      incidentDraftLabel,
      incidentChangesHeading,
      incidentChange1,
      incidentChange2,
      incidentChange3,
    },
  }),
  page({
    id: "S005",
    title: "Define a pilot you can evaluate",
    blocks: {
      "S005-C02": `<h3>Pilot</h3>
        <p>A limited trial with a defined scope, owner, measures, and stop conditions.</p>`,
      "S005-C03": `<h3>Proposed scope</h3>
        <p>Two weeks. One team. One billing-migration ticket category. Suggestion mode throughout.</p>
        <p>People execute ticket moves and external sends. No scope or access expansion during the two-week pilot.</p>`,
      "S005-C04": `<h3>Key Performance Indicator (KPI)</h3>
        <p>A specific measure used to judge progress.</p>`,
      "S005-C05": `${pilotTableHeading}${pilotTable}${pilotResults}`,
      "S005-C06": `${measureDefinitionsHeading}${paragraph(measureDefinition1)}${paragraph(measureDefinition2)}${paragraph(measureDefinition3)}`,
      "S005-C07": `<h3>Accountable pilot owner</h3>
        <p>Support Operations Manager.</p>`,
      "S005-C08": `<h3>Proposed stop rule</h3>
        <p>Pause suggestions, return work to people, and preserve the evidence when required controls fail.</p>
        <p>Actual stop authority and recovery procedures still need validation.</p>`,
      "S005-C09": `<h3>Demo output</h3>
        <p>A04 | Two-Week Pilot Charter</p>`,
      "S005-C10": `<h3>Takeaway</h3>
        <p>Targets are not results. A proposal is not launch permission.</p>`,
      "S005-C11": `<p>“A soft opening tests a limited service. A pilot does the same for a proposed workflow: a defined scope, an owner, measures, and stop conditions.</p>
        <p>HarborLink's proposal stays with one team, one billing-migration category, and suggestion mode for two weeks. Its three key performance indicators, or KPIs, are first-response time, reassignments, and repeat contact. The baseline and target values are fictional planning inputs. Results have not been supplied.</p>
        <p>Generating a draft faster does not itself meet the first-response target. That measure needs an actual human-issued reply. The other measures also need agreed definitions and complete records.</p>
        <p>A04 names the Support Operations Manager and proposes a return to manual handling when controls fail. Those responsibilities and recovery procedures still need validation before launch.”</p>`,
    },
    notes: ["S005-C11"],
    takeaway: "S005-C10",
    parts: {
      pilotTableHeading,
      pilotTableHeaders,
      pilotTableRow1,
      pilotTableRow2,
      pilotTableRow3,
      pilotResults,
      measureDefinitionsLabel,
      measureDefinition1,
      measureDefinition2,
      measureDefinition3,
    },
  }),
  page({
    id: "S006",
    title: "The presentation changes. The evidence stays attached.",
    blocks: {
      "S006-C02": `${artifacts1to4}${artifacts5to6}`,
      "S006-C03": `<h3>The finding to carry forward</h3>
        <p>The current approved billing policy remains unresolved.</p>`,
      "S006-C04": `<h3>The saved recommendation</h3>
        <p>Conditional Go for preparation; launch on hold.</p>
        <p>“Conditional Go” here means continue preparation only. It does not authorize launch.</p>`,
      "S006-C05": `${handoffHeading}${handoffWorkOutput}${handoffMatching}${handoffIntendedSite}${handoffCurrentPair}`,
      "S006-C06": `<h3>Takeaway</h3>
        <p>A polished recommendation must retain the evidence and unresolved issues behind it.</p>`,
      "S006-C07": `${traceControlHeading}${paragraph(traceLabel)}`,
      "S006-C08": `<h3>Finding</h3>
        <p>The current approved billing policy remains unresolved.</p>`,
      "S006-C09": `<h3>A03</h3>
        <p>Policy interpretation is on hold until the Billing Policy Owner identifies the authoritative current policy.</p>`,
      "S006-C10": `<h3>A04</h3>
        <p>Policy authority still needs validation before launch.</p>`,
      "S006-C11": `<h3>A06</h3>
        <p>Continue preparation only. Launch remains on hold.</p>`,
      "S006-C12": `<h3>Intended review site</h3>
        <p>The same limitation must remain available for review. This carry-forward has not been runtime-verified.</p>`,
      "S006-C13": `<h3>We start here</h3>
        <p>Prompt 1: Define the AI agent and workflow.</p>
        <p>Output: A01 | Agent Operating Specification.</p>`,
      "S006-C14": `<h3>What to watch</h3>
        <p>Does each recommendation stay connected to its evidence, human responsibilities, and unresolved questions?</p>`,
      "S006-C15": `<p>“The opening plan now has exact counterparts in the demo: the operating specification, system map, incident assessment, and pilot charter. They support a first leadership email and its final revision.</p>
        <p>Follow the unresolved policy question. A03 holds the interpretation. A04 keeps policy authority as a validation requirement. A06 recommends preparation only, with launch on hold. Those are the saved example's conclusions, not a result we should force in a new run.</p>
        <p>The intended review site should preserve the same work and its limitations. Changing the presentation does not resolve the evidence.</p>
        <p>We will begin by uploading the case pack and artifact contracts, then running Prompt 1 to create A01. As we proceed, watch whether each recommendation stays connected to the evidence and the people responsible for the next action.”</p>`,
      "S006-C16": `<p>Part 1 source files:</p>
        <ul><li><code>harborlink_m3__CASE_PACK__v003.md</code></li><li><code>harborlink_m3__ARTIFACT_CONTRACTS__v003.md</code></li></ul>
        <p>The Part 1 script proceeds through prompts 1, 2, 3, 4, 5A, 5B, and 6. The final prompt packages the work for Part 2; it does not itself establish a working review site.</p>
        <p>The supplied <code>run_001</code> pair is precomputed planning material. It does not contain the <code>handoff_contract: self_contained_v1</code> field required by the revised Part 2 Prompt 1. That prompt requires re-export using the updated Part 1 Prompt 6 before accepting an older pair. No successful revised import is established by these supplied files.</p>`,
    },
    notes: ["S006-C15", "S006-C16"],
    takeaway: "S006-C06",
    parts: {
      connectedWorkHeading,
      artifact1,
      artifact2,
      artifact3,
      artifact4,
      artifact5,
      artifact6,
      artifactTitle1: artifactTitles[0],
      artifactTitle2: artifactTitles[1],
      artifactTitle3: artifactTitles[2],
      artifactTitle4: artifactTitles[3],
      artifactDescription1: artifactDescriptions[0],
      artifactDescription2: artifactDescriptions[1],
      artifactDescription3: artifactDescriptions[2],
      artifactDescription4: artifactDescriptions[3],
      artifactNames1to4,
      artifactNames,
      handoffHeading,
      handoffWorkOutput,
      handoffMatching,
      handoffIntendedSite,
      handoffCurrentPair,
      traceLabel,
    },
  }),
];
