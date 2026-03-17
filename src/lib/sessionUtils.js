// Generate random 6-character alphanumeric code
export function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing: I,O,0,1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Find group with fewest participants, using priority to break ties
export function assignToGroup(activeGroups, participants, maxPerGroup, groupsConfig) {
  // Count participants per group
  const counts = {};
  activeGroups.forEach(g => counts[g] = 0);
  participants.forEach(p => {
    if (counts[p.stakeholder_group] !== undefined) {
      counts[p.stakeholder_group]++;
    }
  });

  // Find groups with minimum count that aren't full
  const availableGroups = activeGroups.filter(g => counts[g] < maxPerGroup);

  if (availableGroups.length === 0) {
    return null; // All groups full
  }

  const minCount = Math.min(...availableGroups.map(g => counts[g]));
  const candidates = availableGroups.filter(g => counts[g] === minCount);

  // Sort by priority (lower number = higher priority for staffing)
  if (groupsConfig) {
    candidates.sort((a, b) => {
      const pa = groupsConfig[a]?.priority ?? 999;
      const pb = groupsConfig[b]?.priority ?? 999;
      return pa - pb;
    });
    return candidates[0];
  }

  // Fallback: random selection if no config provided
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Get participant counts per group
export function getGroupCounts(activeGroups, participants) {
  const counts = {};
  activeGroups.forEach(g => counts[g] = 0);
  participants.forEach(p => {
    if (counts[p.stakeholder_group] !== undefined) {
      counts[p.stakeholder_group]++;
    }
  });
  return counts;
}
