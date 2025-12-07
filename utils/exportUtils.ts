import { GTMPlan } from "../types";

export const generateMarkdown = (plan: GTMPlan): string => {
  // Notion loves H1 for Title
  let md = `# 🚀 GTM Playbook: ${plan.domain}\n\n`;
  
  // Executive Snapshot - formatted as a Callout/Quote block
  md += `## 🎯 Executive Snapshot\n\n`;
  md += `> **Minimum Viable Customer Category (MVCC):** ${plan.mvcc}\n>\n`;
  md += `> **Primary GTM Motion:** ${plan.primaryMotion}\n\n`;
  
  // Competitor Intel (War Room)
  if (plan.competitorAnalysis && plan.competitorAnalysis.length > 0) {
    md += `## ⚔️ Competitor War Room\n\n`;
    md += `| Competitor | Their Weakness ⚠️ | Our Wedge 🛡️ |\n`;
    md += `|---|---|---|\n`;
    plan.competitorAnalysis.forEach(c => {
        const safeName = c.competitorName.replace(/\|/g, '\\|');
        const safeWeakness = c.weakness.replace(/\|/g, '\\|');
        const safeWedge = c.ourWedge.replace(/\|/g, '\\|');
        md += `| **${safeName}** | ${safeWeakness} | ${safeWedge} |\n`;
    });
    md += `\n`;
  }

  // Quarterly Roadmap
  md += `## 🗺️ Quarterly Roadmap\n\n`;
  plan.roadmap.forEach(q => {
    md += `### ${q.quarterName}: ${q.focus}\n`;
    md += `**🏆 Success Metric:** ${q.successMetric.target} ${q.successMetric.name}\n\n`;
    
    // Execution Plan Table
    // We use semi-colons for lists inside tables to ensure compatibility with Markdown viewers that don't support HTML line breaks well
    md += `#### ⚡ Execution Plan\n`;
    md += `| Action Item | Channels & Content Strategy | Resources |\n`;
    md += `|---|---|---|\n`;
    q.actions.forEach((a, i) => {
      const safeTitle = a.title.replace(/\|/g, '\\|');
      const safeResources = a.resources.replace(/\|/g, '\\|');
      
      // Format channels as a concise list: [Twitter]: "Post text..."
      const channels = a.channels.map(ch => `**[${ch.name}]** "${ch.samplePost}"`).join('; ');
      const safeChannels = channels.replace(/\|/g, '\\|');
      
      md += `| ${safeTitle} | ${safeChannels} | ${safeResources} |\n`;
    });

    // Partners as a list
    if (q.partners.length > 0) {
        md += `\n**🤝 Tactical Partners**\n`;
        q.partners.forEach(p => {
            md += `- **${p.name}:** ${p.outreach}\n`;
        });
    }
    md += `\n---\n\n`;
  });

  // Strategic Partners
  if (plan.strategicPartnerships.length > 0) {
      md += `## ♟️ Strategic Partnerships\n\n`;
      md += `| Partner Target | Leverage Strategy |\n`;
      md += `|---|---|\n`;
      plan.strategicPartnerships.forEach(p => {
        const safeTarget = p.target.replace(/\|/g, '\\|');
        const safeLeverage = p.leverage.replace(/\|/g, '\\|');
        md += `| **${safeTarget}** | ${safeLeverage} |\n`;
      });
      md += `\n`;
  }

  // Content Plan
  md += `## 📢 Content & Community Engine\n\n`;
  md += `| Platform | Content Pillars | Engagement Hooks |\n`;
  md += `|---|---|---|\n`;
  plan.contentPlan.forEach(c => {
    const pillars = c.pillars.join(', ').replace(/\|/g, '\\|'); 
    const hooks = c.hooks.join(', ').replace(/\|/g, '\\|');
    md += `| **${c.platform}** | ${pillars} | ${hooks} |\n`;
  });

  return md;
};

export const downloadMarkdown = (plan: GTMPlan) => {
  const md = generateMarkdown(plan);
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // Clean filename
  const safeDomain = plan.domain.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `GTM_Playbook_${safeDomain}_Notion.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};