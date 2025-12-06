import { GTMPlan } from "../types";

export const generateMarkdown = (plan: GTMPlan): string => {
  let md = `# GTM Playbook for ${plan.domain}\n\n`;
  
  md += `## Executive Snapshot\n`;
  md += `- **MVCC:** ${plan.mvcc}\n`;
  md += `- **Primary Motion:** ${plan.primaryMotion}\n\n`;
  
  md += `## Quarterly Roadmap\n`;
  plan.roadmap.forEach(q => {
    md += `### ${q.quarterName}: ${q.focus}\n`;
    md += `**Goal:** ${q.successMetric.target} ${q.successMetric.name}\n\n`;
    
    md += `#### Actions\n`;
    q.actions.forEach((a, i) => {
      md += `**${i + 1}. ${a.title}**\n`;
      md += `   - *Resources:* ${a.resources}\n`;
      a.channels.forEach(ch => {
        md += `   - *${ch.name} Post Idea:* "${ch.samplePost}"\n`;
      });
      md += `\n`;
    });

    if (q.partners.length > 0) {
        md += `#### Tactical Partners\n`;
        q.partners.forEach(p => {
            md += `- **${p.name}:** "${p.outreach}"\n`;
        });
        md += `\n`;
    }
    md += `---\n\n`;
  });

  md += `## Strategic Partnership Playbook\n`;
  plan.strategicPartnerships.forEach(p => {
    md += `- **${p.target}:** ${p.leverage}\n`;
  });
  md += `\n`;

  md += `## Community & Content Plan\n`;
  plan.contentPlan.forEach(c => {
    md += `### ${c.platform}\n`;
    md += `- **Pillars:** ${c.pillars.join(', ')}\n`;
    md += `- **Hooks:** ${c.hooks.join(', ')}\n\n`;
  });

  return md;
};

export const downloadMarkdown = (plan: GTMPlan) => {
  const md = generateMarkdown(plan);
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GTM_Playbook.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};